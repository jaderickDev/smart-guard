# models.py
from django.db import models
from django.utils import timezone

class TrashAlert(models.Model):
    frame_image = models.ImageField(upload_to='alerts/')
    detected_at = models.DateTimeField(auto_now_add=True)
    location = models.CharField(max_length=255, default='Philippine Location')  # Ensure default is set

    def __str__(self):
        return f"Alert at {self.detected_at} in {self.location}"
