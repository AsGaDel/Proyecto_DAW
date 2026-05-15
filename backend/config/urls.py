from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

from apps.incidents.stats_views import global_stats, user_stats

urlpatterns = [
    path('admin/', admin.site.urls),
    # Documentación
    path('api/schema/',            SpectacularAPIView.as_view(),                      name='schema'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    # Stats
    path('api/stats/',                    global_stats, name='global-stats'),
    path('api/stats/user/<str:username>/', user_stats,   name='user-stats'),
    # Apps
    path('api/', include('apps.users.urls')),
    path('api/', include('apps.incidents.urls')),
    path('api/', include('apps.work_orders.urls')),
    path('api/', include('apps.notifications.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
