from django.contrib.auth.models import AbstractUser, Group 
from django.db import models

class CustomUser(AbstractUser):
    groups = models.ManyToManyField(
        Group,
        related_name='accounts_customuser_set',   # Change this to avoid clash
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name="customuser_permission_set",  # Change this to avoid clash
        blank=True,
    )