from django.contrib import admin
from .models import TrashAlert

@admin.register(TrashAlert)
class TrashAlertAdmin(admin.ModelAdmin):
    list_display = ('detected_at', 'location', 'frame_image')