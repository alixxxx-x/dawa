from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    RegisterView, LoginView, MeView,
    PharmacyViewSet, MedicineViewSet, AvailabilityReportViewSet,
    ProductViewSet, ReservationViewSet,
)

router = DefaultRouter()
router.register(r'pharmacies', PharmacyViewSet, basename='pharmacy')
router.register(r'medicines', MedicineViewSet, basename='medicine')
router.register(r'reports', AvailabilityReportViewSet, basename='report')
router.register(r'products', ProductViewSet, basename='product')
router.register(r'reservations', ReservationViewSet, basename='reservation')

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/me/', MeView.as_view(), name='me'),
    path('', include(router.urls)),
]
