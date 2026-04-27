from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.users.permissions import IsAdmin, IsWorkerOrAdmin

from .models import WorkOrder, WorkOrderPhoto
from .serializers import WorkOrderPhotoSerializer, WorkOrderSerializer, WorkOrderStatusSerializer

# Máquina de estados para trabajadores: cada estado solo puede avanzar al siguiente.
# Los admins pueden saltar a cualquier estado directamente (sin esta restricción).
VALID_TRANSITIONS = {
    WorkOrder.Status.ASSIGNED:    WorkOrder.Status.ACCEPTED,
    WorkOrder.Status.ACCEPTED:    WorkOrder.Status.IN_PROGRESS,
    WorkOrder.Status.IN_PROGRESS: WorkOrder.Status.COMPLETED,
}

# Relaciona cada estado con el campo de timestamp que se debe rellenar al llegar a él
TRANSITION_TIMESTAMPS = {
    WorkOrder.Status.ACCEPTED:    'accepted_at',
    WorkOrder.Status.IN_PROGRESS: 'started_at',
    WorkOrder.Status.COMPLETED:   'completed_at',
}


class WorkOrderViewSet(viewsets.ModelViewSet):
    """
    GET    /api/work-orders/             → lista (trabajador: las suyas; admin: todas)
    GET    /api/work-orders/{id}/        → detalle
    POST   /api/admin/work-orders/       → crear (solo admin)
    PATCH  /api/work-orders/{id}/status/ → cambiar estado (trabajador o admin)
    POST   /api/work-orders/{id}/photos/ → subir foto de evidencia
    GET    /api/workers/{id}/history/    → historial del trabajador
    """
    serializer_class = WorkOrderSerializer

    def get_queryset(self):
        user = self.request.user
        qs = WorkOrder.objects.select_related(
            'incident', 'assigned_worker', 'assigned_by'
        ).prefetch_related('photos')
        # Un trabajador solo puede ver las órdenes que tiene asignadas;
        # el admin ve todas para poder supervisarlas.
        if user.role == 'worker':
            return qs.filter(assigned_worker=user)
        return qs

    def get_permissions(self):
        # Crear, editar en bloque y eliminar son acciones exclusivas del admin
        if self.action == 'create':
            return [IsAdmin()]
        if self.action in ['update', 'partial_update', 'destroy']:
            return [IsAdmin()]
        return [IsWorkerOrAdmin()]

    def perform_create(self, serializer):
        # El campo assigned_by se rellena con el admin autenticado que crea la orden
        serializer.save(assigned_by=self.request.user)

    # ── Acciones extra ──────────────────────────────────────────

    @action(detail=True, methods=['patch'], url_path='status', permission_classes=[IsWorkerOrAdmin])
    def update_status(self, request, pk=None):
        """PATCH /api/work-orders/{id}/status/ — avanzar el estado de la orden."""
        work_order = self.get_object()
        serializer = WorkOrderStatusSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        new_status   = serializer.validated_data['status']
        worker_notes = serializer.validated_data.get('worker_notes', '')

        if request.user.role == 'worker':
            # Verificar que la orden pertenece al trabajador que hace la petición
            if work_order.assigned_worker != request.user:
                raise PermissionDenied('Esta orden no te está asignada.')
            # Verificar que el nuevo estado es el siguiente en la secuencia permitida
            expected = VALID_TRANSITIONS.get(work_order.status)
            if new_status != expected:
                raise ValidationError(
                    f'Transición inválida: {work_order.status} → {new_status}. '
                    f'El siguiente estado esperado es: {expected}.'
                )

        # Aplicar el nuevo estado y registrar el timestamp correspondiente
        update_fields = ['status']
        work_order.status = new_status

        timestamp_field = TRANSITION_TIMESTAMPS.get(new_status)
        if timestamp_field:
            setattr(work_order, timestamp_field, timezone.now())
            update_fields.append(timestamp_field)

        if worker_notes:
            work_order.worker_notes = worker_notes
            update_fields.append('worker_notes')

        # update_fields limita el UPDATE de SQL a solo las columnas modificadas
        work_order.save(update_fields=update_fields)
        return Response(WorkOrderSerializer(work_order, context={'request': request}).data)

    @action(detail=True, methods=['post'], url_path='photos', permission_classes=[IsWorkerOrAdmin])
    def upload_photo(self, request, pk=None):
        """POST /api/work-orders/{id}/photos/ — subir foto de evidencia."""
        work_order = self.get_object()
        if request.user.role == 'worker' and work_order.assigned_worker != request.user:
            raise PermissionDenied('Esta orden no te está asignada.')
        serializer = WorkOrderPhotoSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(work_order=work_order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class WorkerHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    """GET /api/workers/{worker_pk}/history/ — historial de órdenes completadas."""
    serializer_class   = WorkOrderSerializer
    permission_classes = [IsWorkerOrAdmin]

    def get_queryset(self):
        # worker_pk llega de la URL anidada /workers/{worker_pk}/history/
        return WorkOrder.objects.filter(
            assigned_worker_id=self.kwargs['worker_pk'],
            status=WorkOrder.Status.COMPLETED,
        ).select_related('incident', 'assigned_worker', 'assigned_by').prefetch_related('photos')
