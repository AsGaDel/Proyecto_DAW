from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Notification
from .serializers import NotificationSerializer


class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET   /api/notifications/           → lista de notificaciones del usuario
    PATCH /api/notifications/{id}/read/ → marcar como leída
    POST  /api/notifications/read-all/  → marcar todas como leídas

    ReadOnlyModelViewSet porque las notificaciones las crea el sistema (señales/tareas),
    nunca el cliente directamente.
    """
    serializer_class   = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Cada usuario solo puede ver sus propias notificaciones
        return Notification.objects.filter(recipient=self.request.user)

    @action(detail=True, methods=['patch'], url_path='read')
    def mark_read(self, request, pk=None):
        """PATCH /api/notifications/{id}/read/"""
        notification = self.get_object()
        notification.is_read = True
        # update_fields evita sobreescribir created_at u otros campos al guardar
        notification.save(update_fields=['is_read'])
        return Response(NotificationSerializer(notification).data)

    @action(detail=False, methods=['post'], url_path='read-all')
    def mark_all_read(self, request):
        """POST /api/notifications/read-all/"""
        # queryset.update() ejecuta un único UPDATE en lugar de uno por notificación
        updated = self.get_queryset().filter(is_read=False).update(is_read=True)
        return Response({'updated': updated}, status=status.HTTP_200_OK)
