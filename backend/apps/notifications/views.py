from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Notification
from .serializers import NotificationSerializer


class NotificationViewSet(viewsets.ModelViewSet):
    """
    GET    /api/notifications/                → lista del usuario autenticado
    PATCH  /api/notifications/{id}/           → marcar como leída ({ read: true })
    POST   /api/notifications/mark-all-read/  → marcar todas como leídas
    DELETE /api/notifications/{id}/           → eliminar notificación
    """
    serializer_class   = NotificationSerializer
    permission_classes = [IsAuthenticated]
    # Las notificaciones las crea el sistema, no el cliente
    http_method_names  = ['get', 'patch', 'delete', 'post', 'head', 'options']

    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user)

    def partial_update(self, request, *args, **kwargs):
        """PATCH /api/notifications/{id}/ con { read: true } → marca como leída."""
        notification = self.get_object()
        if request.data.get('read') is True:
            notification.is_read = True
            notification.save(update_fields=['is_read'])
        return Response(NotificationSerializer(notification).data)

    @action(detail=False, methods=['post'], url_path='mark-all-read')
    def mark_all_read(self, request):
        """POST /api/notifications/mark-all-read/ → marca todas como leídas."""
        updated = self.get_queryset().filter(is_read=False).update(is_read=True)
        return Response({'updated': updated})

    # destroy ya está disponible por heredar de ModelViewSet;
    # el queryset filtrado garantiza que cada usuario solo borre las suyas.
