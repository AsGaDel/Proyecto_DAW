from rest_framework import serializers

from .models import WorkOrder, WorkOrderPhoto


class WorkOrderPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model  = WorkOrderPhoto
        fields = ['id', 'image', 'uploaded_at']
        read_only_fields = ['uploaded_at']


class WorkOrderSerializer(serializers.ModelSerializer):
    # Campos anidados de solo lectura para mostrar información legible sin consultas extra
    photos                 = WorkOrderPhotoSerializer(many=True, read_only=True)
    assigned_worker_email  = serializers.EmailField(source='assigned_worker.email', read_only=True)
    incident_title         = serializers.CharField(source='incident.title', read_only=True)

    class Meta:
        model  = WorkOrder
        fields = [
            'id', 'incident', 'incident_title',
            'assigned_worker', 'assigned_worker_email',
            'assigned_by',
            'status', 'priority',
            'admin_instructions', 'worker_notes',
            'assigned_at', 'accepted_at', 'started_at', 'completed_at',
            'photos',
        ]
        # Los timestamps de ciclo de vida y assigned_by los gestiona la lógica
        # de la vista, no el cliente
        read_only_fields = [
            'assigned_by', 'assigned_at',
            'accepted_at', 'started_at', 'completed_at',
        ]


class WorkOrderStatusSerializer(serializers.Serializer):
    """
    Serializer de uso exclusivo para el endpoint PATCH /work-orders/{id}/status/.
    No es un ModelSerializer porque solo valida el nuevo estado y las notas opcionales,
    sin exponer ni escribir el resto de campos del modelo.
    """
    status       = serializers.ChoiceField(choices=WorkOrder.Status.choices)
    worker_notes = serializers.CharField(required=False, allow_blank=True)
