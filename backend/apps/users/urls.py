from django.urls import include, path
from rest_framework.routers import SimpleRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import AdminUserViewSet, MeView, RegisterView

router = SimpleRouter()
router.register('admin/users', AdminUserViewSet, basename='admin-users')

urlpatterns = [
    # Autenticación
    path('auth/register/', RegisterView.as_view(), name='auth-register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='auth-login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='auth-token-refresh'),
    # Perfil propio
    path('users/me/', MeView.as_view(), name='users-me'),
    # Admin CRUD usuarios
    path('', include(router.urls)),
]
