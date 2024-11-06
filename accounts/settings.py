import os
from pathlib import Path

# Define BASE_DIR
BASE_DIR = Path(__file__).resolve().parent.parent

INSTALLED_APPS = [
    'rest_framework',
    'accounts',  # Your accounts app
    ...
]   

ALLOWED_HOSTS = ["mysite.com"]
CSRF_TRUSTED_ORIGINS = ["http://localhost:3000"]
CSRF_ALLOWED_ORIGINS = ["http://localhost:3000 "]
CORS_ORIGINS_WHITELIST = ["http://localhost:3000 "]
# Database configuration (example using MySQL)
DATABASES = {           
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'litter_detection',         
        'USER': 'root',        
        'PASSWORD': 'Jade@gen1310', 
        'HOST': 'localhost',                  
        'PORT': '3306', 
    }
}

AUTH_USER_MODEL = 'accounts.CustomUser', 'APPNAME.User'
