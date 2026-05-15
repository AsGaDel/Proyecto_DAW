from django.shortcuts import get_object_or_404
from django.utils.timezone import now
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.users.models import User

from .models import Incident


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def global_stats(request):
    """GET /api/stats/ — contadores globales para el Dashboard."""
    month_start = now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    active_qs   = Incident.objects.filter(deleted_at__isnull=True)
    return Response({
        'active':              active_qs.exclude(status=Incident.Status.RESOLVED).count(),
        'pending_review':      active_qs.filter(status=Incident.Status.PENDING).count(),
        'resolved_this_month': active_qs.filter(
            status=Incident.Status.RESOLVED,
            updated_at__gte=month_start,
        ).count(),
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_stats(request, username):
    """GET /api/stats/user/{username}/ — estadísticas de un usuario concreto."""
    user      = get_object_or_404(User, username=username)
    incidents = user.reported_incidents.filter(deleted_at__isnull=True)
    return Response({
        'reported':       incidents.count(),
        'votes_received': sum(i.vote_count for i in incidents.only('vote_count')),
        'subscriptions':  user.subscriptions.count(),
    })
