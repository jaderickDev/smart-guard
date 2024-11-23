from rest_framework import serializers
from .models import AdminSmart, UserSmart

class AdminSmartSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminSmart
        fields = ('id', 'username', 'password')

class UserSmartSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSmart
        fields = ('id', 'username', 'password')