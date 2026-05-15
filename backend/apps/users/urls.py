from django.urls import include, path
from rest_framework.routers import SimpleRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .token import CustomTokenObtainPairView
from .views import AdminUserViewSet, MeView, RegisterView, UserViewSet

router = SimpleRouter()
router.register('admin/users', AdminUserViewSet, basename='admin-users')

# Lookup por username: /api/users/carlos_m/
user_router = SimpleRouter()
user_router.register('users', UserViewSet, basename='users')

urlpatterns = [
    # Autenticación
    path('auth/register/',        RegisterView.as_view(),           name='auth-register'),
    path('auth/login/',           CustomTokenObtainPairView.as_view(), name='auth-login'),
    path('auth/token/refresh/',   TokenRefreshView.as_view(),       name='auth-token-refresh'),
    # Perfil propio (me antes que {username} para que no colisionen)
    path('users/me/',             MeView.as_view(),                 name='users-me'),
    # Perfiles públicos y gestión por username
    path('', include(user_router.urls)),
    # Admin CRUD completo por id
    path('', include(router.urls)),
]
