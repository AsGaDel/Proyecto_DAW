from django.contrib import admin

from .models import WorkOrder, WorkOrderPhoto


@admin.register(WorkOrder)
class WorkOrderAdmin(admin.ModelAdmin):
    list_display = ['incident', 'assigned_worker', 'status', 'priority', 'assigned_at']
    list_filter = ['status', 'priority']
    search_fields = ['incident__title', 'assigned_worker__email']
    readonly_fields = ['assigned_at', 'accepted_at', 'started_at', 'completed_at']


admin.site.register(WorkOrderPhoto)
