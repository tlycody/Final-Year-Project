from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib import messages

def home(request):
    """
    Home page view
    """
    return render(request, 'game/homepage.html')


def user_login(request):
    """
    Login view
    """
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                messages.success(request, f"Welcome back, {username}!")
                return redirect('home')  # Redirect to home or dashboard
            else:
                messages.error(request, "Invalid username or password.")
        else:
            messages.error(request, "Invalid username or password.")
    else:
        form = AuthenticationForm()
    
    return render(request, 'game/login.html', {'form': form})


def user_register(request):
    """
    Registration view
    """
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            username = form.cleaned_data.get('username')
            messages.success(request, f"Account created successfully for {username}!")
            login(request, user)  # Auto-login after registration
            return redirect('home')  # Redirect to home or dashboard
        else:
            messages.error(request, "Registration failed. Please correct the errors.")
    else:
        form = UserCreationForm()
    
    return render(request, 'game/register.html', {'form': form})


def user_logout(request):
    """
    Logout view
    """
    logout(request)
    messages.info(request, "You have been logged out.")
    return redirect('home')


def glossary(request):
    """
    Glossary page view
    """
    # You can add glossary terms here or load from database
    glossary_terms = {
        'Phishing': 'A cyber attack that uses disguised emails to trick recipients into revealing sensitive information.',
        'Deepfake': 'Synthetic media created using AI to replace a person\'s likeness with someone else\'s.',
        'Malware': 'Malicious software designed to harm or exploit computer systems.',
        'Social Engineering': 'Manipulation techniques used to trick people into divulging confidential information.',
        'Two-Factor Authentication': 'A security process requiring two different authentication factors to verify identity.',
    }
    return render(request, 'game/glossary.html', {'glossary_terms': glossary_terms})


def gdpr(request):
    """
    GDPR information page view
    """
    return render(request, 'game/gdpr.html')


def play_game(request):
    """
    Main game page view - users play the cybersecurity training game here
    """
    # You can add login_required decorator later if needed
    # For now, anyone can access the game
    return render(request, 'game/gamepage.html')

def game1(request):
    return render(request, 'game/emailgame.html')

def game2(request):
    return render(request, 'game/aidetectorgame.html')

def game3(request):
    return render(request, 'game/urlgame.html')
