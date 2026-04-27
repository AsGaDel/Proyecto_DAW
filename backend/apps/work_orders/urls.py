from django.urls import include, path
from rest_framework.routers import SimpleRouter

from .views import WorkOrderViewSet, WorkerHistoryViewSet

router = SimpleRouter()
router.register('work-orders', WorkOrderViewSet, basename='work-orders')
router.register('admin/work-orders', WorkOrderViewSet, basename='admin-work-orders')

history_router = SimpleRouter()
history_router.register('history', WorkerHistoryViewSet, basename='worker-history')

urlpatterns = [
    path('', include(router.urls)),
    path('workers/<int:worker_pk>/', include(history_router.urls)),
]
