from django.conf import settings
from django.db import models


class Incident(models.Model):
    class Status(models.TextChoices):
        PENDING     = 'pending',     'Pendiente'
        IN_PROGRESS = 'in_progress', 'En proceso'
        RESOLVED    = 'resolved',    'Resuelto'
        DELETED     = 'deleted',     'Eliminado'

    title       = models.CharField(max_length=200)
    description = models.TextField()
    reporter    = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reported_incidents',
    )
    status    = models.CharField(max_length=15, choices=Status.choices, default=Status.PENDING)
    latitude  = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    address   = models.CharField(max_length=255, blank=True)

    # Campo desnormalizado: se actualiza cada vez que se añade o elimina un voto.
    # Evita hacer COUNT(*) en cada listado de incidentes, mejorando el rendimiento.
    vote_count = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Campos de soft delete: en lugar de borrar el registro se marca con fecha
    # y motivo. Así se conserva el historial y se puede restaurar si es necesario.
    deleted_at     = models.DateTimeField(null=True, blank=True)
    deleted_reason = models.TextField(blank=True, null=True)

    # Notas internas visibles solo por los administradores (filtradas en el serializer)
    admin_notes = models.TextField(blank=True)

    class Meta:
        verbose_name        = 'Incidente'
        verbose_name_plural = 'Incidentes'
        ordering            = ['-created_at']

    def __str__(self):
        return self.title


class IncidentPhoto(models.Model):
    class PhotoType(models.TextChoices):
        REPORT   = 'report',   'Reporte'    # foto del ciudadano al reportar
        EVIDENCE = 'evidence', 'Evidencia'  # foto del trabajador como prueba de resolución

    incident    = models.ForeignKey(Incident, on_delete=models.CASCADE, related_name='photos')
    image       = models.ImageField(upload_to='incidents/photos/')
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='uploaded_photos',
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)
    photo_type  = models.CharField(max_length=10, choices=PhotoType.choices, default=PhotoType.REPORT)

    class Meta:
        verbose_name        = 'Foto de incidente'
        verbose_name_plural = 'Fotos de incidente'

    def __str__(self):
        return f'Foto {self.photo_type} — {self.incident.title}'


class Comment(models.Model):
    incident   = models.ForeignKey(Incident, on_delete=models.CASCADE, related_name='comments')
    author     = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='comments',
    )
    text       = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    # Soft delete de comentarios: se oculta el texto pero se conserva el registro
    # para no romper hilos de conversación ni contadores de actividad.
    is_deleted = models.BooleanField(default=False)

    class Meta:
        verbose_name        = 'Comentario'
        verbose_name_plural = 'Comentarios'
        ordering            = ['created_at']

    def __str__(self):
        return f'Comentario de {self.author} en "{self.incident.title}"'


class Vote(models.Model):
    incident   = models.ForeignKey(Incident, on_delete=models.CASCADE, related_name='votes')
    user       = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='votes',
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name        = 'Voto'
        verbose_name_plural = 'Votos'
        # Garantiza que un mismo usuario no pueda votar dos veces el mismo incidente
        unique_together = ('incident', 'user')

    def __str__(self):
        return f'Voto de {self.user} en "{self.incident.title}"'


class Subscription(models.Model):
    incident   = models.ForeignKey(Incident, on_delete=models.CASCADE, related_name='subscriptions')
    user       = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='subscriptions',
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name        = 'Suscripción'
        verbose_name_plural = 'Suscripciones'
        # Un usuario solo puede suscribirse una vez por incidente
        unique_together = ('incident', 'user')

    def __str__(self):
        return f'{self.user} suscrito a "{self.incident.title}"'
