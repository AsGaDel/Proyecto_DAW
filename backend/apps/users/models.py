from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        CITIZEN = 'citizen', 'Ciudadano'
        WORKER  = 'worker',  'Trabajador'
        ADMIN   = 'admin',   'Administrador'

    # email único para que sirva como identificador de login
    email     = models.EmailField(unique=True)
    full_name = models.CharField(max_length=150, blank=True)
    role      = models.CharField(max_length=10, choices=Role.choices, default=Role.CITIZEN)

    # Usamos email en lugar del username heredado de AbstractUser como campo de login
    USERNAME_FIELD = 'email'
    # username sigue siendo obligatorio para mantener compatibilidad con django.contrib.auth
    REQUIRED_FIELDS = ['username']

    class Meta:
        verbose_name         = 'Usuario'
        verbose_name_plural  = 'Usuarios'

    def __str__(self):
        return self.email


class UserProfile(models.Model):
    """
    Extiende User con datos opcionales de perfil.
    Se separa del modelo principal para no cargar esos campos en cada consulta
    de autenticación; se accede solo cuando se necesita mostrar el perfil.
    """
    user   = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    bio    = models.TextField(blank=True)
    # Preferencias de notificación: se consultan antes de enviar emails o push
    notification_email = models.BooleanField(default=True)
    notification_push  = models.BooleanField(default=True)

    class Meta:
        verbose_name        = 'Perfil de usuario'
        verbose_name_plural = 'Perfiles de usuario'

    def __str__(self):
        return f'Perfil de {self.user.email}'
