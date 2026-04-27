from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('login/', views.user_login, name='login'),
    path('register/', views.user_register, name='register'),
    path('logout/', views.user_logout, name='logout'),
    path('glossary/', views.glossary, name='glossary'),
    path('gdpr/', views.gdpr, name='gdpr'),
    path('play/', views.play_game, name='play_game'),
    path('game/email-detective/', views.game1, name='game1'),
    path('game/deepfake-detector/', views.game2, name='game2'),   # ADD
    path('game/url-lab/', views.game3, name='game3'),             # ADD
]