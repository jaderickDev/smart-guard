# models.py
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractUser, Group, Permission

class TrashAlert(models.Model):
    frame_image = models.ImageField(upload_to='alerts/')
    detected_at = models.DateTimeField(auto_now_add=True)
    location = models.CharField(max_length=255, default='Philippine Location')  # Ensure default is set

    def __str__(self):
        return f"Alert at {self.detected_at} in {self.location}"

class CustomUser(AbstractUser):
    # Add any additional fields if needed
    groups = models.ManyToManyField(
        Group,
        related_name='myapp_customuser_set',  # Change this to a unique name
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='customuser_set',  # Change this to a unique name
        blank=True,
    )

class AdminSmart(models.Model):
    # Define your model fields here, for example:
    name = models.CharField(max_length=100)
    email = models.EmailField()
    # ... other fields ...

    def __str__(self):
        return self.name

class UserSmart(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
