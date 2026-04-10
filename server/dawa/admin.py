from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Pharmacy, Medicine, AvailabilityReport, Product, Reservation


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    ordering = ['phone']
    list_display = ['phone', 'name', 'role', 'wilaya', 'is_active', 'is_staff']
    fieldsets = (
        (None, {'fields': ('phone', 'password')}),
        ('Personal info', {'fields': ('name', 'role', 'wilaya')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )
    add_fieldsets = (
        (None, {'classes': ('wide',), 'fields': ('phone', 'password1', 'password2', 'role')}),
    )
    search_fields = ['phone', 'name']
    filter_horizontal = ('groups', 'user_permissions')


@admin.register(Pharmacy)
class PharmacyAdmin(admin.ModelAdmin):
    list_display = ['name', 'wilaya', 'is_verified', 'pharmacist']
    list_filter = ['wilaya', 'is_verified']
    search_fields = ['name', 'wilaya']


@admin.register(Medicine)
class MedicineAdmin(admin.ModelAdmin):
    list_display = ['commercial_name', 'inn', 'form', 'dosage']
    search_fields = ['commercial_name', 'inn']
    list_filter = ['form']


@admin.register(AvailabilityReport)
class AvailabilityReportAdmin(admin.ModelAdmin):
    list_display = ['medicine', 'pharmacy', 'status', 'confidence', 'reported_at']
    list_filter = ['status', 'confidence']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'brand', 'pharmacy', 'category', 'price_dzd', 'stock_level']
    list_filter = ['category', 'stock_level', 'is_b2b_listed']
    search_fields = ['name', 'brand']


@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ['product', 'buyer', 'pharmacy', 'type', 'status', 'reserved_at']
    list_filter = ['type', 'status']
