from django.contrib.auth.models import AbstractUser, Group 
from django.db import models
from django.contrib.auth.hashers import make_password
from django.db.models.signals import post_migrate
from django.dispatch import receiver

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
class AdminSmart(models.Model):
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=150, unique=True)
    password = models.CharField(max_length=128)

    def __str__(self):
        return self.username

    class Meta:
        db_table = 'adminsmart'

class UserSmart(models.Model):
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=150, unique=True)
    password = models.CharField(max_length=128)

    def __str__(self):
        return self.username

    class Meta:
        db_table = 'usersmart'

# Signal to create default admin after migration
@receiver(post_migrate)
def create_default_admin(sender, **kwargs):
    if sender.name == 'accounts':  # Changed from 'your_app_name' to 'accounts'
        AdminSmart.objects.get_or_create(
            username='admin',
            defaults={'password': make_password('admin')}
        )