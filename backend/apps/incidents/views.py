from django.utils import timezone
from django.utils.timezone import now
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.users.permissions import IsAdmin

from .filters import IncidentFilter
from .models import Category, Comment, Incident, IncidentPhoto, Subscription, Vote
from .serializers import CategorySerializer, CommentSerializer, IncidentPhotoSerializer, IncidentSerializer


class IncidentViewSet(viewsets.ModelViewSet):
    """
    CRUD de incidentes con acciones adicionales:
      - GET  /incidents/my/             → mis incidentes
      - POST /incidents/{id}/vote/      → toggle voto
      - POST /incidents/{id}/subscribe/ → toggle suscripción
      - POST /incidents/{id}/photos/    → subir foto
    """
    serializer_class  = IncidentSerializer
    filterset_class   = IncidentFilter
    search_fields     = ['title', 'description']
    ordering_fields   = ['created_at', 'vote_count', 'status']
    ordering          = ['-created_at']

    def get_queryset(self):
        # select_related y prefetch_related evitan el problema N+1:
        # cargan reporter, fotos, votos y suscripciones en el mínimo de consultas posible.
        qs = Incident.objects.select_related('reporter').prefetch_related(
            'photos', 'votes', 'subscriptions'
        )
        # Los admins ven todos los incidentes, incluso los eliminados (soft delete),
        # para poder auditarlos o restaurarlos desde el panel.
        if getattr(self.request.user, 'role', None) != 'admin':
            qs = qs.filter(deleted_at__isnull=True).exclude(status=Incident.Status.DELETED)
        return qs

    def get_permissions(self):
        # Solo los admins pueden eliminar (soft-delete) incidentes
        if self.action == 'destroy':
            return [IsAdmin()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        if self.request.user.role == 'worker':
            raise PermissionDenied('Los trabajadores no pueden crear incidentes.')
        incident = serializer.save(reporter=self.request.user)
        photo_file = self.request.FILES.get('photo')
        if photo_file:
            IncidentPhoto.objects.create(
                incident=incident,
                image=photo_file,
                uploaded_by=self.request.user,
                photo_type=IncidentPhoto.PhotoType.REPORT,
            )

    def perform_update(self, serializer):
        from apps.work_orders.models import WorkOrder
        from apps.notifications.services import notify_incident_status_change
        incident = self.get_object()
        user = self.request.user
        old_status = incident.status

        if user.role == 'worker':
            is_assigned = WorkOrder.objects.filter(incident=incident, assigned_worker=user).exists()
            if not is_assigned:
                raise PermissionDenied('Solo puedes actualizar incidentes que tienes asignados.')
            non_status_fields = set(serializer.validated_data.keys()) - {'status'}
            if non_status_fields:
                raise PermissionDenied('Los trabajadores solo pueden cambiar el estado del incidente.')
            updated = serializer.save()
            if 'status' in serializer.validated_data and updated.status != old_status:
                notify_incident_status_change(updated, updated.get_status_display())
            return

        if user.role == 'citizen' and incident.reporter != user:
            raise PermissionDenied('Solo puedes editar tus propios incidentes.')
        if user.role == 'citizen' and 'status' in serializer.validated_data:
            raise PermissionDenied('Los ciudadanos no pueden cambiar el estado de un incidente.')
        updated = serializer.save()
        if 'status' in serializer.validated_data and updated.status != old_status:
            notify_incident_status_change(updated, updated.get_status_display())

    def perform_destroy(self, instance):
        # Soft delete: se marca el incidente como eliminado sin borrarlo de la BD.
        # El historial queda intacto y el admin puede recuperarlo si es necesario.
        instance.deleted_at = timezone.now()
        instance.status = Incident.Status.DELETED
        instance.save(update_fields=['deleted_at', 'status'])

    # ── Acciones extra ──────────────────────────────────────────

    def _paginated_response(self, qs):
        page = self.paginate_queryset(qs)
        if page is not None:
            return self.get_paginated_response(self.get_serializer(page, many=True).data)
        return Response(self.get_serializer(qs, many=True).data)

    @action(detail=False, methods=['get'], url_path='mine')
    def mine(self, request):
        """GET /api/incidents/mine/ — incidentes reportados por el usuario autenticado."""
        return self._paginated_response(self.get_queryset().filter(reporter=request.user))

    @action(detail=False, methods=['get'], url_path='assigned')
    def assigned(self, request):
        """GET /api/incidents/assigned/ — incidentes con orden de trabajo asignada al trabajador."""
        from apps.work_orders.models import WorkOrder
        ids = WorkOrder.objects.filter(assigned_worker=request.user).values_list('incident_id', flat=True)
        return self._paginated_response(self.get_queryset().filter(id__in=ids))

    @action(detail=False, methods=['get'], url_path='subscribed')
    def subscribed(self, request):
        """GET /api/incidents/subscribed/ — incidentes a los que el usuario está suscrito."""
        return self._paginated_response(
            self.get_queryset().filter(subscriptions__user=request.user)
        )

    @action(detail=True, methods=['post'], url_path='vote')
    def vote(self, request, pk=None):
        """POST /api/incidents/{id}/vote/ — toggle voto."""
        incident = self.get_object()
        # get_or_create implementa el toggle: si el voto ya existe se elimina,
        # si no existe se crea. Devuelve si el usuario ha votado tras la acción.
        vote, created = Vote.objects.get_or_create(incident=incident, user=request.user)
        if not created:
            vote.delete()
            incident.vote_count = incident.votes.count()
            incident.save(update_fields=['vote_count'])
            return Response({'voted': False, 'vote_count': incident.vote_count})
        incident.vote_count = incident.votes.count()
        incident.save(update_fields=['vote_count'])
        return Response({'voted': True, 'vote_count': incident.vote_count}, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], url_path='subscribe')
    def subscribe(self, request, pk=None):
        """POST /api/incidents/{id}/subscribe/ — toggle suscripción."""
        incident = self.get_object()
        # Mismo patrón toggle que en vote
        sub, created = Subscription.objects.get_or_create(incident=incident, user=request.user)
        if not created:
            sub.delete()
            return Response({'subscribed': False})
        return Response({'subscribed': True}, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], url_path='stats')
    def stats(self, request):
        """GET /api/incidents/stats/ — contadores para el dashboard."""
        month_start = now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        active_statuses = [Incident.Status.PENDING, Incident.Status.IN_PROGRESS]
        return Response({
            'active':              Incident.objects.filter(status__in=active_statuses, deleted_at__isnull=True).count(),
            'pending_review':      Incident.objects.filter(status=Incident.Status.PENDING, deleted_at__isnull=True).count(),
            'resolved_this_month': Incident.objects.filter(status=Incident.Status.RESOLVED, updated_at__gte=month_start).count(),
        })

    @action(detail=True, methods=['post'], url_path='photos', serializer_class=IncidentPhotoSerializer)
    def photos(self, request, pk=None):
        """POST /api/incidents/{id}/photos/ — subir foto al incidente."""
        incident = self.get_object()
        # Límite de 4 fotos por incidente definido en el esquema de datos
        if incident.photos.count() >= 4:
            return Response(
                {'detail': 'Se permite un máximo de 4 fotos por incidente.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer = IncidentPhotoSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save(incident=incident, uploaded_by=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class CategoryViewSet(viewsets.ModelViewSet):
    """
    GET    /api/categories/      → lista de categorías (todos los autenticados)
    POST   /api/categories/      → crear (solo admin)
    PATCH  /api/categories/{id}/ → actualizar nombre (solo admin)
    DELETE /api/categories/{id}/ → eliminar (solo admin)
    """
    serializer_class = CategorySerializer
    queryset = Category.objects.all()

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [IsAdmin()]
        return [IsAuthenticated()]


class CommentViewSet(viewsets.ModelViewSet):
    """
    GET/POST   /api/incidents/{incident_pk}/comments/
    PUT/DELETE /api/incidents/{incident_pk}/comments/{id}/
    """
    serializer_class = CommentSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options']

    def get_queryset(self):
        # Filtrar por el incidente padre extraído de la URL anidada
        # y excluir comentarios con soft delete aplicado
        return Comment.objects.filter(
            incident_id=self.kwargs['incident_pk'],
            is_deleted=False,
        ).select_related('author')

    def perform_create(self, serializer):
        from apps.notifications.services import notify_new_comment
        incident = Incident.objects.get(pk=self.kwargs['incident_pk'])
        comment = serializer.save(author=self.request.user, incident=incident)
        notify_new_comment(comment)

    def perform_update(self, serializer):
        comment = self.get_object()
        if self.request.user.role != 'admin' and comment.author != self.request.user:
            raise PermissionDenied('Solo puedes editar tus propios comentarios.')
        serializer.save()

    def perform_destroy(self, instance):
        if self.request.user.role != 'admin' and instance.author != self.request.user:
            raise PermissionDenied('Solo puedes eliminar tus propios comentarios.')
        # Soft delete: marcar como eliminado en vez de borrar el registro
        instance.is_deleted = True
        instance.save(update_fields=['is_deleted'])
