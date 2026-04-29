import os
from pathlib import Path
from django.contrib.messages import constants as messages_constants

BASE_DIR = Path(__file__).resolve().parent.parent


SECRET_KEY = 'django-insecure-hl8s^2m6rw#j%b67$%9nk)_3yt(4cpq#w-m(rrx4fzqm72y8_h'
DEBUG = True
ALLOWED_HOSTS = []


# ═══ Apps + Middleware ════════════════════════════════════════════
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'game',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'finalyearproject.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'finalyearproject.wsgi.application'


# ═══ Database ═════════════════════════════════════════════════════
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# ═══ Password validation ══════════════════════════════════════════
# Empty — CustomUserCreationForm enforces our own rule (8+ chars,
# letters + numbers + special character).
AUTH_PASSWORD_VALIDATORS = []


# ═══ Auth flow ════════════════════════════════════════════════════
LOGIN_URL           = 'login'
LOGIN_REDIRECT_URL  = 'play_game'
LOGOUT_REDIRECT_URL = 'home'


# ═══ Sessions ═════════════════════════════════════════════════════
SESSION_COOKIE_AGE = 60 * 60 * 24 * 14   # 14 days


# ═══ Messages ═════════════════════════════════════════════════════
MESSAGE_TAGS = {
    messages_constants.DEBUG:    'debug',
    messages_constants.INFO:     'info',
    messages_constants.SUCCESS:  'success',
    messages_constants.WARNING:  'warning',
    messages_constants.ERROR:    'error',
}


# ═══ I18N ═════════════════════════════════════════════════════════
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True


# ═══ Static files ═════════════════════════════════════════════════
STATIC_URL = 'static/'
STATICFILES_DIRS = [os.path.join(BASE_DIR, 'static')]
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')


# ═══ Default primary key ══════════════════════════════════════════
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'