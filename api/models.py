from django.contrib.auth.models import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models

class UserManager(BaseUserManager):
    def create_user(self, number, password=None, **extra_fields):
        if not number:
            raise ValueError("The phone number must be set.")
        user = self.model(number=number, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, number, password=None, **extra_fields):
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_staff", True)
        
        if not extra_fields.get("is_superuser"):
            raise ValueError("Superuser must have is_superuser = True.")
        if not extra_fields.get("is_staff"):
            raise ValueError("Superuser must have is_staff = True.")
    
        return self.create_user(number, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    uid = models.AutoField(primary_key=True)
    number = models.CharField(max_length=10, unique=True)
    email = models.EmailField(unique=True, blank=True, null=True)
    name = models.CharField(max_length=100)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = "number"

    objects = UserManager()

class Driver(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    car_model = models.CharField(max_length=50)
    car_number = models.CharField(max_length=15, unique=True)
    car_type = models.CharField(max_length=50, choices=[
        ('sedan', 'Sedan'),
        ('suv', 'SUV'),
        ('hatchback', 'Hatchback'),
        ('luxury', 'Luxury'),
        ('minivan', 'Minivan'),
    ])
    license_number = models.CharField(max_length=20, unique=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Trip(models.Model):
    tid = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE, null=True, blank=True)
    booking_code = models.CharField(max_length=20, unique=True)
    pickup_location = models.CharField(max_length=255)
    pickup_lat = models.FloatField()
    pickup_lng = models.FloatField()
    drop_location = models.CharField(max_length=255)
    drop_lat = models.FloatField()
    drop_lng = models.FloatField()
    distance = models.FloatField()
    est_duration = models.IntegerField()
    fare = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=[
        ('requested', 'Requested'),
        ('accepted', 'Accepted'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    ], default='requested')
    start_time = models.DateTimeField(null=True, blank=True)
    completed_time = models.DateTimeField(null=True, blank=True)
    actual_duration = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
