from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == 'admin'
        )


class IsWorker(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == 'worker'
        )


class IsWorkerOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role in ('worker', 'admin')
        )


class IsOwnerOrAdmin(BasePermission):
    """
    Permiso a nivel de objeto: solo el propietario del recurso o un admin puede
    modificarlo. Las peticiones de solo lectura (GET, HEAD, OPTIONS) siempre pasan.

    Para determinar el propietario se busca en orden el primer campo que exista
    en el objeto: 'reporter' (incidentes), 'author' (comentarios) o 'user' (votos,
    suscripciones). De esta forma una sola clase cubre todos los modelos.
    """
    def has_object_permission(self, request, view, obj):
        # Lecturas permitidas a cualquier usuario autenticado
        if request.method in SAFE_METHODS:
            return True
        # Los admins pueden modificar cualquier objeto
        if request.user.role == 'admin':
            return True
        # Buscar el campo propietario según el modelo del objeto
        owner = (
            getattr(obj, 'reporter', None)
            or getattr(obj, 'author', None)
            or getattr(obj, 'user', None)
        )
        return owner == request.user
