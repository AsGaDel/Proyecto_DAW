from rest_framework import generics, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated

from .models import User
from .permissions import IsAdmin
from .serializers import AdminUserSerializer, RegisterSerializer, UserSerializer


class RegisterView(generics.CreateAPIView):
    """POST /api/auth/register/ — Registro público de ciudadanos."""
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


class MeView(generics.RetrieveUpdateAPIView):
    """GET/PUT /api/users/me/ — Ver y editar perfil propio."""
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'put', 'patch', 'head', 'options']

    def get_object(self):
        return self.request.user


class AdminUserViewSet(viewsets.ModelViewSet):
    """GET/POST/PUT/DELETE /api/admin/users/ — CRUD de usuarios (solo admin)."""
    serializer_class = AdminUserSerializer
    permission_classes = [IsAdmin]
    queryset = User.objects.all().order_by('date_joined')
    http_method_names = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options']
