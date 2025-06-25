from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import (
    UserViewSet, SignupView, DriverViewSet, TripViewSet,
    CustomTokenObtainPairView, ors_proxy_view  # ✅ updated import
)
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'drivers', DriverViewSet)
router.register(r'trips', TripViewSet)

urlpatterns = [
    path('', include(router.urls)),

    # Auth
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('refresh/', TokenRefreshView.as_view(), name='refresh'),

    # ORS Proxy
    path('ors/', ors_proxy_view),  # ✅ new reusable endpoint
]
