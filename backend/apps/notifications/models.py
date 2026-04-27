from django.conf import settings
from django.db import models

from apps.incidents.models import Incident
from apps.work_orders.models import WorkOrder


class Notification(models.Model):
    class Type(models.TextChoices):
        INCIDENT_STATUS_CHANGE = 'incident_status_change', 'Cambio de estado del incidente'
        WORKER_ASSIGNED        = 'worker_assigned',        'Trabajador asignado'
        INCIDENT_RESOLVED      = 'incident_resolved',      'Incidente resuelto'
        NEW_COMMENT            = 'new_comment',            'Nuevo comentario'
        WORK_ORDER_ASSIGNED    = 'work_order_assigned',    'Orden de trabajo asignada'
        WORK_ORDER_STATUS      = 'work_order_status',      'Cambio de estado de orden de trabajo'
        SUBSCRIPTION_UPDATE    = 'subscription_update',    'Actualización de suscripción'

    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications',
    )
    type    = models.CharField(max_length=30, choices=Type.choices)
    title   = models.CharField(max_length=255)
    message = models.TextField()

    # SET_NULL en lugar de CASCADE: si se borra el incidente o la orden de trabajo,
    # la notificación se conserva en el historial del usuario (sin el enlace).
    incident = models.ForeignKey(
        Incident,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='notifications',
    )
    work_order = models.ForeignKey(
        WorkOrder,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='notifications',
    )

    is_read    = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name        = 'Notificación'
        verbose_name_plural = 'Notificaciones'
        ordering            = ['-created_at']

    def __str__(self):
        return f'[{self.type}] para {self.recipient} — {self.title}'
