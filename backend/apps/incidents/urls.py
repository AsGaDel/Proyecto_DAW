from django.urls import include, path
from rest_framework.routers import SimpleRouter

from .views import CommentViewSet, IncidentViewSet

router = SimpleRouter()
router.register('incidents', IncidentViewSet, basename='incidents')

# Router anidado para comentarios: /incidents/{incident_pk}/comments/
comment_router = SimpleRouter()
comment_router.register('comments', CommentViewSet, basename='incident-comments')

urlpatterns = [
    path('', include(router.urls)),
    path('incidents/<int:incident_pk>/', include(comment_router.urls)),
]
