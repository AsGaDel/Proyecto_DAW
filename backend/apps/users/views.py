from rest_framework import generics, mixins, viewsets
from rest_framework.filters import SearchFilter
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import User
from .permissions import IsAdmin
from .serializers import AdminUserSerializer, RegisterSerializer, UserSerializer


class RegisterView(generics.CreateAPIView):
    """POST /api/auth/register/ — Registro público de ciudadanos."""
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


class MeView(generics.RetrieveUpdateAPIView):
    """GET/PATCH /api/users/me/ — Ver y editar perfil propio."""
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'put', 'patch', 'head', 'options']

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        # Guardar el avatar antes de delegar al serializer,
        # ya que viene como campo top-level en multipart/form-data
        # y el serializer lo tiene anidado en 'profile'.
        avatar_file = request.FILES.get('avatar')
        if avatar_file:
            profile = request.user.profile
            profile.avatar = avatar_file
            profile.save(update_fields=['avatar'])
        kwargs['partial'] = True
        return super().update(request, *args, **kwargs)


class UserViewSet(mixins.ListModelMixin,
                  mixins.RetrieveModelMixin,
                  mixins.UpdateModelMixin,
                  mixins.DestroyModelMixin,
                  viewsets.GenericViewSet):
    """
    GET    /api/users/             → lista de usuarios
    GET    /api/users/{username}/  → perfil público por username
    PATCH  /api/users/{username}/  → cambiar rol / desactivar (solo admin)
    DELETE /api/users/{username}/  → eliminar (solo admin)
    """
    lookup_field    = 'username'
    filter_backends = [SearchFilter]
    search_fields   = ['username', 'full_name', 'email']

    def get_queryset(self):
        qs = User.objects.select_related('profile').order_by('date_joined')
        if getattr(self.request.user, 'role', None) != 'admin':
            qs = qs.filter(is_active=True)
        role = self.request.query_params.get('role')
        if role:
            qs = qs.filter(role=role)
        return qs

    def get_serializer_class(self):
        # El admin usa AdminUserSerializer para poder cambiar rol e is_active
        if self.request.user.role == 'admin' and self.action in ('update', 'partial_update'):
            return AdminUserSerializer
        return UserSerializer

    def get_permissions(self):
        if self.action in ('update', 'partial_update', 'destroy'):
            return [IsAdmin()]
        return [IsAuthenticated()]


class AdminUserViewSet(viewsets.ModelViewSet):
    """GET/POST/PUT/DELETE /api/admin/users/ — CRUD completo de usuarios (solo admin)."""
    serializer_class = AdminUserSerializer
    permission_classes = [IsAdmin]
    queryset = User.objects.all().order_by('date_joined')
    http_method_names = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options']
