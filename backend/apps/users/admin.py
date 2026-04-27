from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User, UserProfile


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ['email', 'username', 'full_name', 'role', 'is_active', 'date_joined']
    list_filter = ['role', 'is_active']
    search_fields = ['email', 'username', 'full_name']
    ordering = ['-date_joined']
    fieldsets = UserAdmin.fieldsets + (
        ('Datos adicionales', {'fields': ('full_name', 'role')}),
    )


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'notification_email', 'notification_push']
    raw_id_fields = ['user']
