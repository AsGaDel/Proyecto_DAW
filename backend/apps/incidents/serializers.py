from rest_framework import serializers

from .models import Category, Comment, Incident, IncidentPhoto, Subscription, Vote


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model  = Category
        fields = ['id', 'name', 'created_at']
        read_only_fields = ['id', 'created_at']


class IncidentPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model  = IncidentPhoto
        fields = ['id', 'image', 'uploaded_by', 'uploaded_at', 'photo_type']
        read_only_fields = ['uploaded_by', 'uploaded_at']


class IncidentSerializer(serializers.ModelSerializer):
    photos            = IncidentPhotoSerializer(many=True, read_only=True)
    reporter_email    = serializers.EmailField(source='reporter.email', read_only=True)
    reporter_username = serializers.CharField(source='reporter.username', read_only=True)
    status_display    = serializers.CharField(source='get_status_display', read_only=True)
    is_voted      = serializers.SerializerMethodField()
    is_subscribed = serializers.SerializerMethodField()
    location      = serializers.SerializerMethodField()
    work_order    = serializers.SerializerMethodField()

    class Meta:
        model  = Incident
        fields = [
            'id', 'title', 'description',
            'reporter', 'reporter_email', 'reporter_username',
            'status', 'status_display', 'priority', 'category',
            'latitude', 'longitude', 'address', 'location',
            'vote_count', 'is_voted', 'is_subscribed',
            'created_at', 'updated_at',
            'deleted_at', 'deleted_reason', 'admin_notes',
            'photos', 'work_order',
        ]
        read_only_fields = [
            'reporter', 'reporter_email', 'reporter_username',
            'vote_count', 'created_at', 'updated_at', 'deleted_at',
            'location', 'status_display', 'work_order',
        ]

    def get_location(self, obj):
        return {
            'address': obj.address,
            'latlng': {'lat': float(obj.latitude), 'lng': float(obj.longitude)},
        }

    def get_is_voted(self, obj):
        # Acceder al request desde el contexto que inyecta el ViewSet automáticamente
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.votes.filter(user=request.user).exists()
        return False

    def get_is_subscribed(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.subscriptions.filter(user=request.user).exists()
        return False

    def get_work_order(self, obj):
        try:
            wo = obj.work_order
            return {
                'id':                      wo.pk,
                'status':                  wo.status,
                'status_display':          wo.get_status_display(),
                'priority':                wo.priority,
                'assigned_worker_id':      wo.assigned_worker_id,
                'assigned_worker_username': wo.assigned_worker.username,
                'admin_instructions':      wo.admin_instructions,
            }
        except Exception:
            return None

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        # Ocultar campos internos a cualquier usuario que no sea admin.
        # Se hace aquí, en la capa de serialización, para no necesitar
        # serializers separados por rol.
        if request and getattr(request.user, 'role', None) != 'admin':
            data.pop('admin_notes', None)
            data.pop('deleted_reason', None)
            data.pop('deleted_at', None)
        return data


class CommentSerializer(serializers.ModelSerializer):
    author_email    = serializers.EmailField(source='author.email', read_only=True)
    author_name     = serializers.CharField(source='author.full_name', read_only=True)
    author_username = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model  = Comment
        fields = [
            'id', 'incident', 'author', 'author_email', 'author_name', 'author_username',
            'text', 'created_at', 'updated_at', 'is_deleted',
        ]
        read_only_fields = [
            'author', 'author_email', 'author_name', 'author_username',
            'incident', 'created_at', 'updated_at', 'is_deleted',
        ]


class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Vote
        fields = ['id', 'incident', 'user', 'created_at']
        read_only_fields = ['user', 'created_at']


class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Subscription
        fields = ['id', 'incident', 'user', 'created_at']
        read_only_fields = ['user', 'created_at']
