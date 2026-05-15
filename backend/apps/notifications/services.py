from .models import Notification


def notify(recipient, notif_type, title, message, incident=None, work_order=None):
    Notification.objects.create(
        recipient=recipient,
        type=notif_type,
        title=title,
        message=message,
        incident=incident,
        work_order=work_order,
    )


def notify_incident_status_change(incident, new_status_display):
    """Notifica al reporter y a los suscriptores cuando cambia el estado."""
    recipients = set()
    recipients.add(incident.reporter)
    for sub in incident.subscriptions.select_related('user'):
        recipients.add(sub.user)

    for user in recipients:
        notify(
            recipient=user,
            notif_type=Notification.Type.INCIDENT_STATUS_CHANGE,
            title=f'Estado actualizado: {incident.title}',
            message=f'El incidente "{incident.title}" cambió a "{new_status_display}".',
            incident=incident,
        )


def notify_new_comment(comment):
    """Notifica al reporter y suscriptores cuando se añade un comentario."""
    incident = comment.incident
    recipients = set()
    recipients.add(incident.reporter)
    for sub in incident.subscriptions.select_related('user'):
        recipients.add(sub.user)
    recipients.discard(comment.author)

    for user in recipients:
        notify(
            recipient=user,
            notif_type=Notification.Type.NEW_COMMENT,
            title=f'Nuevo comentario en: {incident.title}',
            message=f'@{comment.author.username} comentó: "{comment.text[:100]}"',
            incident=incident,
        )


def notify_work_order_assigned(work_order):
    """Notifica al trabajador que le han asignado una orden de trabajo."""
    notify(
        recipient=work_order.assigned_worker,
        notif_type=Notification.Type.WORK_ORDER_ASSIGNED,
        title='Nueva orden de trabajo asignada',
        message=f'Se te ha asignado el incidente "{work_order.incident.title}".',
        incident=work_order.incident,
        work_order=work_order,
    )
