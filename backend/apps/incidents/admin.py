from django.contrib import admin

from .models import Comment, Incident, IncidentPhoto, Subscription, Vote


@admin.register(Incident)
class IncidentAdmin(admin.ModelAdmin):
    list_display = ['title', 'reporter', 'status', 'priority', 'vote_count', 'created_at']
    list_filter = ['status', 'priority']
    search_fields = ['title', 'description', 'reporter__email']
    ordering = ['-created_at']
    readonly_fields = ['vote_count', 'created_at', 'updated_at', 'deleted_at']


@admin.register(IncidentPhoto)
class IncidentPhotoAdmin(admin.ModelAdmin):
    list_display = ['incident', 'uploaded_by', 'photo_type', 'uploaded_at']
    list_filter = ['photo_type']


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['incident', 'author', 'is_deleted', 'created_at']
    list_filter = ['is_deleted']


admin.site.register(Vote)
admin.site.register(Subscription)
