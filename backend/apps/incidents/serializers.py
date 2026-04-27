from rest_framework import serializers

from .models import Comment, Incident, IncidentPhoto, Subscription, Vote


class IncidentPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model  = IncidentPhoto
        fields = ['id', 'image', 'uploaded_by', 'uploaded_at', 'photo_type']
        read_only_fields = ['uploaded_by', 'uploaded_at']


class IncidentSerializer(serializers.ModelSerializer):
    photos           = IncidentPhotoSerializer(many=True, read_only=True)
    reporter_email   = serializers.EmailField(source='reporter.email', read_only=True)
    reporter_username = serializers.CharField(source='reporter.username', read_only=True)
    # Campos calculados que dependen del usuario que hace la petición;
    # se computan mediante SerializerMethodField para poder acceder al request.
    is_voted      = serializers.SerializerMethodField()
    is_subscribed = serializers.SerializerMethodField()
    # Objeto location anidado para compatibilidad con el frontend (location.address, location.latlng)
    location      = serializers.SerializerMethodField()

    class Meta:
        model  = Incident
        fields = [
            'id', 'title', 'description',
            'reporter', 'reporter_email', 'reporter_username',
            'status', 'priority',
            'latitude', 'longitude', 'address', 'location',
            'vote_count', 'is_voted', 'is_subscribed',
            'created_at', 'updated_at',
            'deleted_at', 'deleted_reason', 'admin_notes',
            'photos',
        ]
        read_only_fields = [
            'reporter', 'reporter_email', 'reporter_username',
            'vote_count', 'created_at', 'updated_at', 'deleted_at', 'location',
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
    author_email = serializers.EmailField(source='author.email', read_only=True)
    author_name  = serializers.CharField(source='author.full_name', read_only=True)

    class Meta:
        model  = Comment
        fields = [
            'id', 'incident', 'author', 'author_email', 'author_name',
            'text', 'created_at', 'updated_at', 'is_deleted',
        ]
        # author e incident los asigna la vista, no el cliente
        read_only_fields = [
            'author', 'author_email', 'author_name',
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
