"""
forms.py
========
Custom user registration form for BotBusters.

Implements Cody's specific rules:
  • Username: letters, digits, and @ . _ only (NO spaces, NO + - / etc.)
  • Password: ≥ 8 characters, mix of letters + numbers + special characters
  • No Django default help_text shown (unless user explicitly violates a rule)
"""

import re

from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.models import User


# ─── Validation regexes ─────────────────────────────────────────────
USERNAME_RE  = re.compile(r'^[A-Za-z0-9@._]+$')        # letters, digits, @ . _
PASSWORD_RE  = re.compile(r'^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$')

PASSWORD_ERROR = (
    'Password must contain at least 8 characters, '
    'mix of letters, numbers, and special characters.'
)


class CustomUserCreationForm(UserCreationForm):
    """
    Replacement for Django's default UserCreationForm that:
      - Removes the verbose default help_text on every field
      - Validates username against Cody's exact character set
      - Validates password against the simple rule above
    """

    class Meta:
        model = User
        fields = ('username',)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Strip help_text from EVERY field so Django doesn't render
        # the default "150 characters or fewer..." messaging.
        for name, field in self.fields.items():
            field.help_text = ''

    # ─── Username validation ────────────────────────────────────────
    def clean_username(self):
        username = (self.cleaned_data.get('username') or '').strip()

        if ' ' in username:
            raise forms.ValidationError('Username cannot contain spaces.')

        if not USERNAME_RE.match(username):
            raise forms.ValidationError(
                'Username may only contain letters, digits, and the '
                'characters @ . and _ (no spaces).'
            )

        # Don't let users register names that look like guest placeholders
        if username.lower().startswith('guest'):
            raise forms.ValidationError(
                'Usernames starting with "guest" are reserved.'
            )

        if User.objects.filter(username__iexact=username).exists():
            raise forms.ValidationError('That username is already taken.')

        return username

    # ─── Password validation ────────────────────────────────────────
    def clean_password1(self):
        password = self.cleaned_data.get('password1') or ''
        if not PASSWORD_RE.match(password):
            raise forms.ValidationError(PASSWORD_ERROR)
        return password

    def clean_password2(self):
        p1 = self.cleaned_data.get('password1')
        p2 = self.cleaned_data.get('password2')
        if p1 and p2 and p1 != p2:
            raise forms.ValidationError("The two password fields don't match.")
        return p2


class CustomAuthenticationForm(AuthenticationForm):
    """
    Login form — kept simple. The only reason to subclass is to wipe
    the default help_text and to provide a single, friendly error on
    bad credentials.
    """

    error_messages = {
        'invalid_login': 'Incorrect username or password.',
        'inactive': 'This account is inactive.',
    }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.fields.values():
            field.help_text = ''