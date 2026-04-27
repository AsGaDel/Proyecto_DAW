from django.conf import settings
from django.db import models

from apps.incidents.models import Incident


class WorkOrder(models.Model):
    # Secuencia de estados: assigned → accepted → in_progress → completed
    # Solo el trabajador puede avanzar el estado; el admin puede forzar cualquier transición.
    class Status(models.TextChoices):
        ASSIGNED    = 'assigned',    'Asignada'
        ACCEPTED    = 'accepted',    'Aceptada'
        IN_PROGRESS = 'in_progress', 'En progreso'
        COMPLETED   = 'completed',   'Completada'

    class Priority(models.TextChoices):
        LOW    = 'low',    'Baja'
        MEDIUM = 'medium', 'Media'
        HIGH   = 'high',   'Alta'
        URGENT = 'urgent', 'Urgente'

    # OneToOne porque un incidente genera como máximo una orden de trabajo
    incident = models.OneToOneField(Incident, on_delete=models.CASCADE, related_name='work_order')

    # Dos FKs a User con related_names distintos para distinguir roles:
    # assigned_worker → el trabajador que ejecuta la orden
    # assigned_by     → el admin que la creó y asignó
    assigned_worker = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='assigned_work_orders',
    )
    assigned_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='created_work_orders',
    )

    status   = models.CharField(max_length=15, choices=Status.choices, default=Status.ASSIGNED)
    priority = models.CharField(max_length=10, choices=Priority.choices, default=Priority.MEDIUM)

    admin_instructions = models.TextField(blank=True)
    worker_notes       = models.TextField(blank=True)

    # Timestamps de ciclo de vida: parten como null y se rellenan conforme
    # el trabajador avanza el estado. Permiten auditar la duración de cada fase.
    assigned_at  = models.DateTimeField(auto_now_add=True)
    accepted_at  = models.DateTimeField(null=True, blank=True)
    started_at   = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name        = 'Orden de trabajo'
        verbose_name_plural = 'Órdenes de trabajo'
        ordering            = ['-assigned_at']

    def __str__(self):
        return f'OT #{self.pk} — {self.incident.title}'


class WorkOrderPhoto(models.Model):
    work_order  = models.ForeignKey(WorkOrder, on_delete=models.CASCADE, related_name='photos')
    image       = models.ImageField(upload_to='work_orders/photos/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name        = 'Foto de orden de trabajo'
        verbose_name_plural = 'Fotos de orden de trabajo'

    def __str__(self):
        return f'Foto de OT #{self.work_order.pk}'
