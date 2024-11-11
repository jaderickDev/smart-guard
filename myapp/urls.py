from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from django.urls import path
from .views import list_output_files

print("Loading urls.py")  # Add this line

urlpatterns = [
    path('', views.index, name='index'),
    path('', TemplateView.as_view(template_name='index.html')),
    path('video_feed/', views.video_feed, name='video_feed'),
    path('video_feed_options/', views.handle_preflight, name='video_feed_options'),
    path('api/alerts/', views.get_alerts, name='get_alerts'),
    path('alert/<int:alert_id>/', views.alert_detail, name='alert_detail'),
    path('stop_streaming/', views.stop_streaming, name='stop_streaming'),
    path("api/output_files/", views.list_output_files, name="output_files"),
] + static(settings.OUTPUT_DIR_URL, document_root=settings.OUTPUT_DIR_PATH)

print("URLs configured")  # Add this line
