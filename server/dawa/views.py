from django.contrib.auth import get_user_model
from django.db.models import Q
from rest_framework import generics, viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import Pharmacy, Medicine, AvailabilityReport, Product, Reservation
from .serializers import (
    RegisterSerializer, UserSerializer, PhoneTokenObtainPairSerializer,
    PharmacySerializer, MedicineSerializer, AvailabilityReportSerializer,
    ProductSerializer, ReservationSerializer,
)

User = get_user_model()


# ── Auth ──────────────────────────────────────────────────────────────────────

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


class LoginView(TokenObtainPairView):
    serializer_class = PhoneTokenObtainPairSerializer


class MeView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


# ── Pharmacy ──────────────────────────────────────────────────────────────────

class PharmacyViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Pharmacy.objects.all()
    serializer_class = PharmacySerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'wilaya', 'address']

    @action(detail=True, methods=['get'])
    def products(self, request, pk=None):
        pharmacy = self.get_object()
        qs = pharmacy.products.all()
        category = request.query_params.get('category')
        if category:
            qs = qs.filter(category=category)
        serializer = ProductSerializer(qs, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def availability(self, request, pk=None):
        pharmacy = self.get_object()
        reports = pharmacy.reports.select_related('medicine').order_by('medicine', '-reported_at')
        serializer = AvailabilityReportSerializer(reports, many=True, context={'request': request})
        return Response(serializer.data)


# ── Medicine ──────────────────────────────────────────────────────────────────

class MedicineViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = MedicineSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = Medicine.objects.filter(molecule__isnull=True)
        q = self.request.query_params.get('q')
        if q:
            qs = Medicine.objects.filter(
                Q(inn__icontains=q) | Q(commercial_name__icontains=q)
            )
        return qs

    @action(detail=True, methods=['get'])
    def pharmacies(self, request, pk=None):
        medicine = self.get_object()
        medicine_ids = [medicine.pk] + list(medicine.brands.values_list('pk', flat=True))
        all_reports = (
            AvailabilityReport.objects
            .filter(medicine_id__in=medicine_ids)
            .select_related('pharmacy')
            .order_by('-reported_at')
        )
        seen = set()
        data = []
        for report in all_reports:
            if report.pharmacy_id not in seen:
                seen.add(report.pharmacy_id)
                data.append({
                    'pharmacy': PharmacySerializer(report.pharmacy).data,
                    'confidence': report.confidence,
                    'status': report.status,
                    'reported_at': report.reported_at,
                })
        return Response(data)


# ── Availability Report ───────────────────────────────────────────────────────

class AvailabilityReportViewSet(viewsets.ModelViewSet):
    serializer_class = AvailabilityReportSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        qs = AvailabilityReport.objects.select_related('pharmacy', 'medicine', 'reporter')
        pharmacy_id = self.request.query_params.get('pharmacy')
        medicine_id = self.request.query_params.get('medicine')
        if pharmacy_id:
            qs = qs.filter(pharmacy_id=pharmacy_id)
        if medicine_id:
            qs = qs.filter(medicine_id=medicine_id)
        return qs

    def get_permissions(self):
        if self.action in ['create']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]


# ── Product ───────────────────────────────────────────────────────────────────

class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        qs = Product.objects.select_related('pharmacy').all()
        q = self.request.query_params.get('q')
        category = self.request.query_params.get('category')
        b2b = self.request.query_params.get('b2b')
        pharmacy_id = self.request.query_params.get('pharmacy')

        if q:
            qs = qs.filter(Q(name__icontains=q) | Q(brand__icontains=q))
        if category:
            qs = qs.filter(category=category)
        if b2b == 'true':
            qs = qs.filter(is_b2b_listed=True)
        if pharmacy_id:
            qs = qs.filter(pharmacy_id=pharmacy_id)
        return qs

    def perform_create(self, serializer):
        pharmacy = self.request.user.pharmacy
        serializer.save(pharmacy=pharmacy)

    def perform_update(self, serializer):
        serializer.save()


# ── Reservation ───────────────────────────────────────────────────────────────

class ReservationViewSet(viewsets.ModelViewSet):
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'pharmacist' and hasattr(user, 'pharmacy'):
            return Reservation.objects.filter(pharmacy=user.pharmacy).select_related(
                'product', 'pharmacy', 'buyer'
            )
        return Reservation.objects.filter(buyer=user).select_related('product', 'pharmacy')

    @action(detail=True, methods=['patch'])
    def confirm(self, request, pk=None):
        reservation = self.get_object()
        reservation.status = Reservation.STATUS_CONFIRMED
        reservation.save()
        return Response(ReservationSerializer(reservation).data)

    @action(detail=True, methods=['patch'])
    def cancel(self, request, pk=None):
        reservation = self.get_object()
        reservation.status = Reservation.STATUS_CANCELLED
        reservation.save()
        return Response(ReservationSerializer(reservation).data)

    @action(detail=True, methods=['patch'])
    def complete(self, request, pk=None):
        reservation = self.get_object()
        reservation.status = Reservation.STATUS_COMPLETED
        reservation.save()
        return Response(ReservationSerializer(reservation).data)
