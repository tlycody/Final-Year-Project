from django.urls import path
from . import views

urlpatterns = [
    # ── Public pages ────────────────────────────────────────────
    path('',          views.home,        name='home'),
    path('glossary/', views.glossary,    name='glossary'),
    path('gdpr/',     views.gdpr,        name='gdpr'),

    # ── Auth ────────────────────────────────────────────────────
    path('login/',    views.login_view,    name='login'),
    path('register/', views.register_view, name='register'),
    path('logout/',   views.logout_view,   name='logout'),

    # ── Game pages ──────────────────────────────────────────────
    path('play/',                    views.play_game, name='play_game'),
    path('game/email-detective/',    views.game1,     name='game1'),
    path('game/deepfake-detector/',  views.game2,     name='game2'),
    path('game/url-lab/',            views.game3,     name='game3'),

    # ── Profile + leaderboard + dev dashboard ───────────────────
    path('profile/',         views.profile_view,        name='profile'),
    path('profile/delete/',  views.delete_account_view, name='delete_account'),
    path('leaderboard/',     views.leaderboard_view,    name='leaderboard'),
    path('dev/dashboard/',   views.dev_dashboard_view,  name='dev_dashboard'),

    # ── API endpoint that the games POST results to ─────────────
    path('api/submit-result/', views.submit_result_view, name='submit_result'),
]