from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import User, UserProfile


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """
    Crea automáticamente un UserProfile vacío cada vez que se registra un usuario nuevo.
    Así se garantiza que todo User siempre tiene su perfil asociado sin necesidad
    de crearlo manualmente en cada vista de registro.
    """
    if created:
        UserProfile.objects.create(user=instance)
