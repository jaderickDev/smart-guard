import os
from pathlib import Path

# Define BASE_DIR
BASE_DIR = Path(__file__).resolve().parent.parent

INSTALLED_APPS = [
    'rest_framework',
    'accounts',  # Your accounts app
    ...
]

# Database configuration (example using SQLite)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / "db.sqlite3",
    }
}

AUTH_USER_MODEL = 'accounts.CustomUser', 'APPNAME.User'