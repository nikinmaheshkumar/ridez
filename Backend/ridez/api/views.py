from rest_framework import generics, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .serializers import SignupSerializer, DriverSerializer, TripSerializer
from .models import User, Driver, Trip
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer

from django.http import JsonResponse
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

import requests
import json


# ----- Auth Views -----
class SignupView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = SignupSerializer
    permission_classes = [permissions.AllowAny]


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


# ----- User Views -----
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = SignupSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(uid=self.request.user.uid)


# ----- Driver Views -----
class DriverViewSet(viewsets.ModelViewSet):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return self.queryset.filter(user=self.request.user)
        return self.queryset.none()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# ----- Trip Views -----
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


# ----- Reusable OpenRouteService Proxy -----
@csrf_exempt
@require_http_methods(["GET", "POST"])
def ors_proxy_view(request):
    endpoint = request.GET.get("endpoint")
    method = request.method

    if not endpoint:
        return JsonResponse({"error": "Missing 'endpoint' query param"}, status=400)

    # Construct the full ORS URL
    base_url = "https://api.openrouteservice.org"
    full_url = f"{base_url}/{endpoint.lstrip('/')}"

    headers = {
        "Authorization": settings.ORS_API_KEY,
        "Content-Type": "application/json",
    }

    try:
        if method == "GET":
            # Use .dict() to extract query parameters except "endpoint"
            params = request.GET.copy()
            params.pop("endpoint", None)
            response = requests.get(full_url, headers=headers, params=params)
        else:
            body = json.loads(request.body.decode("utf-8"))
            response = requests.post(full_url, headers=headers, json=body)

        return JsonResponse(response.json(), status=response.status_code)
    except requests.exceptions.RequestException as e:
        return JsonResponse({"error": "Request failed", "details": str(e)}, status=500)
