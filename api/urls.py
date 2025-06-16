from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import UserViewSet, DriverViewSet, TripViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'drivers', DriverViewSet)
router.register(r'trips', TripViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
