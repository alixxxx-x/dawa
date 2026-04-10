from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Pharmacy, Medicine, AvailabilityReport, Product, Reservation

User = get_user_model()


# ── Auth ──────────────────────────────────────────────────────────────────────

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['phone', 'password', 'name', 'role', 'wilaya']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'phone', 'name', 'role', 'wilaya', 'created_at']


class PhoneTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = User.USERNAME_FIELD

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['phone'] = user.phone
        token['role'] = user.role
        return token


# ── Pharmacy ──────────────────────────────────────────────────────────────────

class PharmacySerializer(serializers.ModelSerializer):
    class Meta:
        model = Pharmacy
        fields = '__all__'
        read_only_fields = ['pharmacist', 'created_at']


# ── Medicine ──────────────────────────────────────────────────────────────────

class MedicineSerializer(serializers.ModelSerializer):
    brands = serializers.SerializerMethodField()

    class Meta:
        model = Medicine
        fields = ['id', 'inn', 'commercial_name', 'form', 'dosage', 'molecule', 'brands']

    def get_brands(self, obj):
        return MedicineSerializer(obj.brands.all(), many=True, context=self.context).data


# ── Availability Report ───────────────────────────────────────────────────────

class AvailabilityReportSerializer(serializers.ModelSerializer):
    pharmacy_name = serializers.CharField(source='pharmacy.name', read_only=True)
    medicine_name = serializers.CharField(source='medicine.commercial_name', read_only=True)

    class Meta:
        model = AvailabilityReport
        fields = ['id', 'pharmacy', 'pharmacy_name', 'medicine', 'medicine_name',
                  'status', 'confidence', 'reported_at', 'expires_at']
        read_only_fields = ['reporter', 'reported_at', 'expires_at']

    def create(self, validated_data):
        validated_data['reporter'] = self.context['request'].user
        validated_data['expires_at'] = timezone.now() + timedelta(hours=48)
        return super().create(validated_data)


# ── Product ───────────────────────────────────────────────────────────────────

class ProductSerializer(serializers.ModelSerializer):
    pharmacy_name = serializers.CharField(source='pharmacy.name', read_only=True)
    pharmacy_wilaya = serializers.CharField(source='pharmacy.wilaya', read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'pharmacy', 'pharmacy_name', 'pharmacy_wilaya',
                  'name', 'brand', 'category', 'price_dzd', 'wholesale_price_dzd',
                  'description', 'stock_level', 'is_b2b_listed', 'photo_url', 'created_at']
        read_only_fields = ['created_at']


# ── Reservation ───────────────────────────────────────────────────────────────

class ReservationSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    pharmacy_name = serializers.CharField(source='pharmacy.name', read_only=True)
    pharmacy_address = serializers.CharField(source='pharmacy.address', read_only=True)
    pharmacy_lat = serializers.FloatField(source='pharmacy.lat', read_only=True)
    pharmacy_lng = serializers.FloatField(source='pharmacy.lng', read_only=True)

    class Meta:
        model = Reservation
        fields = ['id', 'product', 'product_name', 'pharmacy', 'pharmacy_name',
                  'pharmacy_address', 'pharmacy_lat', 'pharmacy_lng',
                  'type', 'status', 'reserved_at', 'pickup_deadline', 'commission_pct']
        read_only_fields = ['buyer', 'reserved_at', 'pickup_deadline', 'commission_pct', 'status']

    def create(self, validated_data):
        validated_data['buyer'] = self.context['request'].user
        validated_data['pickup_deadline'] = timezone.now() + timedelta(hours=2)
        validated_data['pharmacy'] = validated_data['product'].pharmacy
        return super().create(validated_data)
