from rest_framework import serializers
from .models import User, Driver, Trip

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ['uid', 'number', 'email', 'name', 'is_staff', 'is_superuser', 'created_at' , 'password']
        read_only_fields = ['uid', 'created_at']
        
    def create(self, validated_data):  
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user


class DriverSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all()) 
    class Meta:
        model = Driver
        fields = ['user', 'car_model', 'car_number', 'car_type', 'license_number', 'is_active', 'created_at']
        read_only_fields = ['user', 'created_at']


class TripSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all()) 
    driver = serializers.PrimaryKeyRelatedField(queryset=Driver.objects.all()) 
    class Meta:
        model = Trip
        fields = ['tid', 'user', 'driver', 'booking_code', 'pickup_location', 'pickup_lat', 'pickup_lng', 
                  'drop_location', 'drop_lat', 'drop_lng', 'status', 'created_at']
        read_only_fields = ['tid', 'created_at']  