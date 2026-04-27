from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.users.permissions import IsAdmin

from .filters import IncidentFilter
from .models import Comment, Incident, IncidentPhoto, Subscription, Vote
from .serializers import CommentSerializer, IncidentPhotoSerializer, IncidentSerializer


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
        # Los trabajadores no reportan incidentes, solo los gestionan
        if self.request.user.role == 'worker':
            raise PermissionDenied('Los trabajadores no pueden crear incidentes.')
        # El reporter se asigna automáticamente al usuario autenticado
        serializer.save(reporter=self.request.user)

    def perform_update(self, serializer):
        incident = self.get_object()
        user = self.request.user
        # Un ciudadano solo puede editar sus propios incidentes
        if user.role != 'admin' and incident.reporter != user:
            raise PermissionDenied('Solo puedes editar tus propios incidentes.')
        # El cambio de estado es competencia de los trabajadores/admin, no del ciudadano
        if user.role == 'citizen' and 'status' in serializer.validated_data:
            raise PermissionDenied('Los ciudadanos no pueden cambiar el estado de un incidente.')
        serializer.save()

    def perform_destroy(self, instance):
        # Soft delete: se marca el incidente como eliminado sin borrarlo de la BD.
        # El historial queda intacto y el admin puede recuperarlo si es necesario.
        instance.deleted_at = timezone.now()
        instance.status = Incident.Status.DELETED
        instance.save(update_fields=['deleted_at', 'status'])

    # ── Acciones extra ──────────────────────────────────────────

    @action(detail=False, methods=['get'], url_path='my')
    def my(self, request):
        """GET /api/incidents/my/ — incidentes del usuario autenticado."""
        qs = self.get_queryset().filter(reporter=request.user)
        # Respetar la paginación configurada globalmente en el proyecto
        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

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
        incident = Incident.objects.get(pk=self.kwargs['incident_pk'])
        # author e incident se inyectan desde la vista, no los envía el cliente
        serializer.save(author=self.request.user, incident=incident)

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
