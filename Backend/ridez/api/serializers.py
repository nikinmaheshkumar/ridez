from rest_framework import serializers
from .models import User, Driver, Trip
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import User

class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    number = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    name = serializers.CharField(required=True)
    class Meta:
        model = User
        fields = ['number', 'email', 'name', 'password']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        return user
    


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['number', 'email', 'name', 'is_staff', 'is_superuser', 'created_at']
        

class DriverSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="user.name", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)
    number = serializers.CharField(source="user.number", read_only=True)

    class Meta:
        model = Driver
        fields = [
            "car_model",
            "car_number",
            "car_type",
            "license_number",
            "is_active",
            "created_at",
            "name",     # added
            "email",    # added
            "number",   # added
        ]
    
class TripSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.get_full_name", read_only=True)

    class Meta:
        model = Trip
        fields = [
            'tid', 'user', 'user_name', 'driver', 'booking_code',
            'pickup_location', 'pickup_lat', 'pickup_lng',
            'drop_location', 'drop_lat', 'drop_lng',
            'distance', 'est_duration', 'fare',
            'status', 'start_time', 'completed_time',
            'actual_duration', 'created_at'
        ]
        read_only_fields = [
            'user', 'driver', 'created_at',
            'start_time', 'completed_time', 'actual_duration'
        ]


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    number = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        number = attrs.get("number")
        password = attrs.get("password")
        try:
            user = User.objects.get(number=number)
        except User.DoesNotExist:
            raise serializers.ValidationError("No user with this phone number.")

        if not user.check_password(password):
            raise serializers.ValidationError("Incorrect password.")

        if not user.is_active:
            raise serializers.ValidationError("User account is disabled.")
        refresh = self.get_token(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'name': user.name,
                'number': user.number,
                'email': user.email,
                'is_driver': hasattr(user, 'driver')
            }
        }
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['name'] = user.name
        token['number'] = user.number
        token['is_driver'] = hasattr(user, 'driver')
        return token
