from rest_framework import serializers

from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            'id', 'type', 'title', 'message',
            'incident', 'work_order',
            'is_read', 'created_at',
        ]
        read_only_fields = [
            'type', 'title', 'message',
            'incident', 'work_order', 'created_at',
        ]
