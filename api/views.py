from rest_framework import generics, permissions, viewsets
from .serializers import SignupSerializer, DriverSerializer
from .models import User, Driver

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


