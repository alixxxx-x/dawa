from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin


class UserManager(BaseUserManager):
    def create_user(self, phone, password=None, **extra_fields):
        if not phone:
            raise ValueError('Phone number is required')
        user = self.model(phone=phone, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, phone, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(phone, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    ROLE_PATIENT = 'patient'
    ROLE_PHARMACIST = 'pharmacist'
    ROLE_CHOICES = [(ROLE_PATIENT, 'Patient'), (ROLE_PHARMACIST, 'Pharmacist')]

    phone = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=150, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=ROLE_PATIENT)
    wilaya = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'phone'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.phone


class Pharmacy(models.Model):
    name = models.CharField(max_length=255)
    address = models.TextField()
    wilaya = models.CharField(max_length=100)
    lat = models.FloatField(null=True, blank=True)
    lng = models.FloatField(null=True, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    hours = models.CharField(max_length=255, blank=True)
    is_verified = models.BooleanField(default=False)
    pharmacist = models.OneToOneField(
        User, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='pharmacy', limit_choices_to={'role': 'pharmacist'}
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = 'pharmacies'


class Medicine(models.Model):
    inn = models.CharField(max_length=255, help_text='International Non-proprietary Name / molecule')
    commercial_name = models.CharField(max_length=255)
    form = models.CharField(max_length=100, blank=True, help_text='Tablet, syrup, injectable...')
    dosage = models.CharField(max_length=100, blank=True, help_text='e.g. 850mg')
    molecule = models.ForeignKey(
        'self', on_delete=models.SET_NULL, null=True, blank=True,
        related_name='brands', help_text='Points to the canonical INN entry; null if this IS the canonical entry'
    )

    def __str__(self):
        return f'{self.commercial_name} ({self.inn})'


class AvailabilityReport(models.Model):
    STATUS_FOUND = 'found'
    STATUS_NOT_FOUND = 'not_found'
    STATUS_CHOICES = [(STATUS_FOUND, 'Found'), (STATUS_NOT_FOUND, 'Not found')]

    CONFIDENCE_HIGH = 'high'
    CONFIDENCE_MEDIUM = 'medium'
    CONFIDENCE_LOW = 'low'
    CONFIDENCE_UNKNOWN = 'unknown'
    CONFIDENCE_CHOICES = [
        (CONFIDENCE_HIGH, 'High'),
        (CONFIDENCE_MEDIUM, 'Medium'),
        (CONFIDENCE_LOW, 'Low'),
        (CONFIDENCE_UNKNOWN, 'Unknown'),
    ]

    pharmacy = models.ForeignKey(Pharmacy, on_delete=models.CASCADE, related_name='reports')
    medicine = models.ForeignKey(Medicine, on_delete=models.CASCADE, related_name='reports')
    reporter = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='reports')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    confidence = models.CharField(max_length=20, choices=CONFIDENCE_CHOICES, default=CONFIDENCE_UNKNOWN)
    reported_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    class Meta:
        ordering = ['-reported_at']


class Product(models.Model):
    CATEGORY_CHOICES = [
        ('dermo_cosmetics', 'Dermo-cosmetics'),
        ('baby_care', 'Baby care'),
        ('supplements', 'Supplements'),
        ('orthopedics', 'Orthopedics'),
        ('wound_care', 'Wound care'),
        ('oral_hygiene', 'Oral hygiene'),
        ('hair_care', 'Hair care'),
        ('wellness_devices', 'Wellness devices'),
    ]
    STOCK_HIGH = 'high'
    STOCK_MEDIUM = 'medium'
    STOCK_LOW = 'low'
    STOCK_OUT = 'out'
    STOCK_CHOICES = [
        (STOCK_HIGH, 'High'), (STOCK_MEDIUM, 'Medium'),
        (STOCK_LOW, 'Low'), (STOCK_OUT, 'Out of stock'),
    ]

    pharmacy = models.ForeignKey(Pharmacy, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=255)
    brand = models.CharField(max_length=255, blank=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    price_dzd = models.PositiveIntegerField()
    wholesale_price_dzd = models.PositiveIntegerField(null=True, blank=True)
    stock_level = models.CharField(max_length=20, choices=STOCK_CHOICES, default=STOCK_MEDIUM)
    is_b2b_listed = models.BooleanField(default=False)
    description = models.TextField(blank=True, help_text='Detailed product description')
    photo_url = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.name} — {self.pharmacy.name}'


class Reservation(models.Model):
    TYPE_B2C = 'b2c'
    TYPE_B2B = 'b2b'
    TYPE_CHOICES = [(TYPE_B2C, 'Patient pickup'), (TYPE_B2B, 'Inter-pharmacy')]

    STATUS_PENDING = 'pending'
    STATUS_CONFIRMED = 'confirmed'
    STATUS_COMPLETED = 'completed'
    STATUS_CANCELLED = 'cancelled'
    STATUS_CHOICES = [
        (STATUS_PENDING, 'Pending'), (STATUS_CONFIRMED, 'Confirmed'),
        (STATUS_COMPLETED, 'Completed'), (STATUS_CANCELLED, 'Cancelled'),
    ]

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reservations')
    buyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reservations')
    pharmacy = models.ForeignKey(Pharmacy, on_delete=models.CASCADE, related_name='reservations')
    type = models.CharField(max_length=10, choices=TYPE_CHOICES, default=TYPE_B2C)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    reserved_at = models.DateTimeField(auto_now_add=True)
    pickup_deadline = models.DateTimeField()
    commission_pct = models.FloatField(default=10.0)

    class Meta:
        ordering = ['-reserved_at']
