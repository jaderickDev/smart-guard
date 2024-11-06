from django.urls import path
from .views import register, login_view, RegisterListView, LoginView

urlpatterns = [
    path('api/register/', register, name='register'),
    path('api/login/', login_view, name='login_view'),
    path('api/register-class/', RegisterListView.as_view(), name='register_class'),
    path('api/login-class/', LoginView.as_view(), name='login_class'),
]
