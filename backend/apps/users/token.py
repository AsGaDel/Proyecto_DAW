from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Datos del usuario incluidos en el payload del JWT.
        # AuthContext los lee con parseJwt() para saber quién está logado.
        token['role']      = user.role
        token['username']  = user.username
        token['full_name'] = user.full_name
        return token


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
