from rest_framework import serializers
from .models import User, Driver, Trip

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
    class Meta:
        model = Driver
        fields = ['user', 'car_model', 'car_number', 'car_type', 'license_number', 'is_active', 'created_at']
        read_only_fields = ['user', 'created_at']
    
class TripSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = ['user', 'driver', 'booking_code', 'pickup_location',
                   'pickup_lat', 'pickup_lng',
                   'drop_location', 'drop_lat', 'drop_lng',
                   'distance', 'est_duration', 'fare',
                   'status', 'start_time', 'completed_time',
                   'actual_duration', 'created_at']

        read_only_fields = ['user', 'driver', 'created_at', 'start_time', 'completed_time', 'actual_duration']
