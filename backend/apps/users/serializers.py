from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from .models import User, UserProfile


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model  = UserProfile
        fields = ['avatar', 'bio', 'notification_email', 'notification_push']


class RegisterSerializer(serializers.ModelSerializer):
    # write_only impide que la contraseña aparezca en ninguna respuesta JSON
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model  = User
        fields = ['username', 'email', 'full_name', 'password']

    def validate_password(self, value):
        # Ejecuta los validadores de contraseña configurados en AUTH_PASSWORD_VALIDATORS
        validate_password(value)
        return value

    def create(self, validated_data):
        # create_user en lugar de User() directo porque gestiona el hash de la contraseña
        # El rol se fuerza a CITIZEN: el auto-registro solo crea ciudadanos;
        # workers y admins los crea el administrador desde el panel.
        return User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            full_name=validated_data.get('full_name', ''),
            password=validated_data['password'],
            role=User.Role.CITIZEN,
        )


class UserSerializer(serializers.ModelSerializer):
    """Serializer para que el usuario vea y edite su propio perfil."""
    # Incluir el perfil anidado permite leer y actualizar ambos modelos en una sola petición
    profile = UserProfileSerializer()

    class Meta:
        model  = User
        fields = ['id', 'username', 'email', 'full_name', 'role', 'is_active', 'date_joined', 'profile']
        # role e is_active solo los puede cambiar un admin mediante AdminUserSerializer
        read_only_fields = ['id', 'role', 'is_active', 'date_joined']

    def update(self, instance, validated_data):
        # Extraer los datos del perfil antes de actualizar el usuario
        # para que ModelSerializer no intente asignar un dict a un OneToOneField
        profile_data = validated_data.pop('profile', {})

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Actualizar el perfil por separado
        profile = instance.profile
        for attr, value in profile_data.items():
            setattr(profile, attr, value)
        profile.save()
        return instance


class AdminUserSerializer(serializers.ModelSerializer):
    """Serializer para gestión de usuarios por el administrador."""
    # required=False permite actualizar otros campos sin obligar a resetear la contraseña
    password = serializers.CharField(write_only=True, min_length=8, required=False)

    class Meta:
        model  = User
        fields = ['id', 'username', 'email', 'full_name', 'role', 'is_active', 'date_joined', 'password']
        read_only_fields = ['id', 'date_joined']

    def validate_password(self, value):
        validate_password(value)
        return value

    def create(self, validated_data):
        # Separar la contraseña para hashearla con set_password antes de guardar
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        # Solo cambiar la contraseña si se envió una nueva en la petición
        if password:
            instance.set_password(password)
        instance.save()
        return instance
