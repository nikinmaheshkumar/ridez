from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import UserViewSet,SignupView, DriverViewSet, TripViewSet
from rest_framework_simplejwt.views import TokenRefreshView
from .views import CustomTokenObtainPairView, autocomplete_view
router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'drivers', DriverViewSet)
router.register(r'trips', TripViewSet) 




urlpatterns = [
    path('', include(router.urls)),
    path('signup/', SignupView.as_view(), name='signup'),  # Signup
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),  # ✅ Custom Login
    path('refresh/', TokenRefreshView.as_view(), name='refresh'),  # Refresh
    path('api/autocomplete/', autocomplete_view),
]
