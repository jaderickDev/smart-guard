from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import AdminSmart, UserSmart
from django.contrib.auth.hashers import check_password, make_password

@api_view(['POST'])
def user_register (request):
    try:
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response(
                {'error': 'Please provide both username and password'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if UserSmart.objects.filter(username=username).exists():
            return Response(
                {'error': 'Username already exists'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = UserSmart.objects.create(
            username=username,
            password=make_password(password)
        )
        
        return Response({
            'message': 'Registration successful',
            'user_id': user.id,
            'username': user.username
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        print(f"Registration error: {str(e)}")  # For debugging
        return Response(
            {'error': 'An error occurred during registration'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def user_login(request):
    try:
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response(
                {'error': 'Please provide both username and password'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = UserSmart.objects.get(username=username)
        except UserSmart.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        if check_password(password, user.password):
            return Response({
                'message': 'Login successful',
                'user_id': user.id,
                'username': user.username
            })
        
        return Response(
            {'error': 'Invalid password'},
            status=status.HTTP_400_BAD_REQUEST
        )

    except Exception as e:
        print(f"Login error: {str(e)}")  # For debugging
        return Response(
            {'error': 'An error occurred during login'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def admin_login(request):
    try:
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response(
                {'error': 'Please provide both username and password'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            admin = AdminSmart.objects.get(username=username)
        except AdminSmart.DoesNotExist:
            return Response(
                {'error': 'Admin not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # For the default admin with non-hashed password
        if admin.username == 'admin' and password == 'admin':
            admin.password = make_password('admin')
            admin.save()
            return Response({
                'message': 'Admin login successful',
                'admin_id': admin.id,
                'username': admin.username
            })
        
        # For regular login with hashed password
        if check_password(password, admin.password):
            return Response({
                'message': 'Admin login successful',
                'admin_id': admin.id,
                'username': admin.username
            })
        
        return Response(
            {'error': 'Invalid password'},
            status=status.HTTP_400_BAD_REQUEST
        )

    except Exception as e:
        print(f"Login error: {str(e)}")  # For debugging
        return Response(
            {'error': 'An error occurred during login'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )