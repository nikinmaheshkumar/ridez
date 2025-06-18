from rest_framework import generics, permissions, viewsets, response
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .serializers import SignupSerializer, DriverSerializer, TripSerializer
from .models import User, Driver,Trip
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer

class SignupView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = SignupSerializer
    permission_classes = [permissions.AllowAny]


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = SignupSerializer
    permission_classes = [permissions.IsAuthenticated]

    # Optional: restrict to own profile
    def get_queryset(self):
        return self.queryset.filter(uid=self.request.user.uid)

class DriverViewSet(viewsets.ModelViewSet):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer
    permission_classes = [permissions.IsAuthenticated]

    # Optional: restrict to own profile
    def get_queryset(self):
        if self.request.user.is_authenticated:
            return self.queryset.filter(user=self.request.user)
        return self.queryset.none()
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TripViewSet(viewsets.ModelViewSet):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        if hasattr(self.request.user, 'driver'):
            raise ValidationError("Drivers cannot create booking requests.")
        serializer.save(user=self.request.user)
        
    def get_queryset(self):
        if self.request.user.is_authenticated:
            if hasattr(self.request.user, 'driver'):
                return self.queryset.all()
            return self.queryset.filter(user=self.request.user)
        return self.queryset.none()

    
    @action(detail=True, methods=['post'], url_path='accept')
    def confirm_trip(self, request, pk=None):
        trip = self.get_object()
        if trip.status == 'requested' and hasattr(request.user, 'driver'):
            trip.driver = request.user.driver
            trip.start_time = timezone.now()
            trip.status = 'accepted'
            trip.save()
            return Response({'status': 'Trip confirmed'})
        return Response({'status': 'Trip already confirmed or invalid'}, status=400)

    @action(detail=True, methods=['post'], url_path='complete')
    def complete_trip(self, request, pk=None):
        trip = self.get_object()
        if trip.status == 'accepted':
            trip.completed_time = timezone.now()
            trip.status = 'completed'
            trip.actual_duration = (trip.completed_time - trip.start_time).total_seconds()
            trip.save()
            return Response({'status': 'Trip completed'})
        return Response({'status': 'Trip not in progress'}, status=400)
    
    @action(detail=False, methods=['get'], url_path='driver-trips')
    def driver_trips(self, request):
        """List both current and completed trips for this driver."""
        if not hasattr(request.user, 'driver'):
             return Response({'error': 'Not a driver'}, status=403)
    
        driver = request.user.driver
        current = self.queryset.filter(driver=driver, status='accepted')
        completed = self.queryset.filter(driver=driver, status='completed')
    
        response = {
            'current_trips': self.serializer_class(current, many=True).data,
            'completed_trips': self.serializer_class(completed, many=True).data,
        }
        return Response(response)
    @action(detail=True, methods=['post'], url_path='cancel')
    def cancel_trip(self, request, pk=None):
        trip = self.get_object()
        if trip.status == 'requested' and trip.user == request.user:
            trip.status = 'canceled'
            trip.save()
            return Response({'status': 'Trip canceled'})
        return Response({'status': 'Unable to cancel'},status=400)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
