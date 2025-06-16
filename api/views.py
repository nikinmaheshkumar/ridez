from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import UserSerializer, DriverSerializer, TripSerializer
from .models import User, Driver, Trip


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    # Anyone can create a new user, but other operations require authentication
    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]
    

    # Hash password before saving
    def perform_create(self, serializer):
        serializer.save()


class DriverViewSet(viewsets.ModelViewSet):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer
    permission_classes = [IsAuthenticated]

    # Bind driver to the authenticated user
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TripViewSet(viewsets.ModelViewSet):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    permission_classes = [IsAuthenticated]

    # Filter queryset to show only the user's own trips
    def get_queryset(self):
        return Trip.objects.filter(user=self.request.user)

    # Bind trip to the authenticated user
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
