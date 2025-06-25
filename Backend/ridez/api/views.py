from rest_framework import generics, permissions, viewsets, response
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .serializers import SignupSerializer, DriverSerializer, TripSerializer
from .models import User, Driver,Trip
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer
import requests
from django.http import JsonResponse
from django.conf import settings

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
        user = self.request.user
        if hasattr(user, 'driver'):
            raise ValidationError("Drivers cannot create booking requests.")
        existing = Trip.objects.filter(user=user, status__in=['requested', 'in_progress'])
        if existing.exists():
            raise ValidationError("You already have a trip in progress or requested.")
        serializer.save(user=user)

    def get_queryset(self):
        if self.request.user.is_authenticated:
            if hasattr(self.request.user, 'driver'):
                return self.queryset.all()
            return self.queryset.filter(user=self.request.user)
        return self.queryset.none()

    @action(detail=True, methods=['post'], url_path='accept')
    def confirm_trip(self, request, pk=None):
        trip = self.get_object()
        user = request.user
        if trip.status != 'requested':
            return Response({'status': 'Trip already confirmed or invalid'}, status=400)
        if not hasattr(user, 'driver'):
            return Response({'status': 'Only drivers can accept trips'}, status=403)
        driver = user.driver
        existing = Trip.objects.filter(driver=driver, status__in=['in_progress'])
        if existing.exists():
            return Response({'status': 'You already have an active trip'}, status=400)
        trip.driver = driver
        trip.start_time = timezone.now()
        trip.status = 'in_progress'
        trip.save()
        return Response({'status': 'Trip confirmed'})

    @action(detail=True, methods=['post'], url_path='complete')
    def complete_trip(self, request, pk=None):
        trip = self.get_object()

        if not trip.driver or trip.driver.user != request.user:
            return Response({'status': 'Only the assigned driver can complete this trip'}, status=403)

        if trip.status == 'in_progress':
            trip.completed_time = timezone.now()
            trip.status = 'completed'
            trip.actual_duration = (trip.completed_time - trip.start_time).total_seconds()
            trip.save()
            return Response({'status': 'Completed'})

        return Response({'status': 'Trip not in progress'}, status=400)

    @action(detail=False, methods=['get'], url_path='driver-trips')
    def driver_trips(self, request):
        """Return all trips (accepted, in progress, completed) in a single list."""
        if not hasattr(request.user, 'driver'):
            return Response({'error': 'Not a driver'}, status=403)

        driver = request.user.driver
        trips = self.queryset.filter(driver=driver, status__in=['accepted', 'in_progress', 'completed'])
        return Response(self.serializer_class(trips, many=True).data)

    @action(detail=True, methods=['post'], url_path='cancel')
    def cancel_trip(self, request, pk=None):
        trip = self.get_object()
        if trip.status == 'requested' and trip.user == request.user:
            trip.status = 'cancelled'
            trip.save()
            return Response({'status': 'Cancelled'})
        return Response({'status': 'Unable to cancel'}, status=400)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


def autocomplete_view(request):
    print("ORS KEY:", settings.ORS_API_KEY)
    text = request.GET.get('text')
    if not text:
        return JsonResponse({'error': 'Text query required'}, status=400)

    ors_url = 'https://api.openrouteservice.org/geocode/autocomplete'
    headers = {
        'Authorization': settings.ORS_API_KEY,
    }
    params = {
        'text': text,
        'boundary.country': 'in',
    }

    try:
        ors_response = requests.get(ors_url, headers=headers, params=params)
        print("ORS response:", response.status_code, response.text)
        ors_response.raise_for_status()  # Raise HTTPError if status is 4xx or 5xx
        return JsonResponse(ors_response.json(), safe=False)
    except requests.exceptions.HTTPError as http_err:
        return JsonResponse({'error': 'ORS error', 'details': str(http_err)}, status=ors_response.status_code)
    except Exception as e:
        return JsonResponse({'error': 'Request failed', 'details': str(e)}, status=500)
