"""
game/views.py — v3
==================
Adds: rank badges are reassigned every time a result is submitted, so
the gold/silver/bronze badges always reflect the current top-3.
"""

import json

from django.shortcuts import render, redirect
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib import messages
from django.db.models import Avg, Count, Sum, Q, Max
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import ensure_csrf_cookie

from .forms import CustomUserCreationForm, CustomAuthenticationForm
from .models import (
    GuestPlayer, GameSession, QuestionResult, FeatureResult,
    Badge, UserBadge, GAME_CHOICES,
    award_badges_for_session, reassign_leaderboard_badges,
)


# ════════════════════════════════════════════════════════════════
# PUBLIC / SIMPLE PAGES
# ════════════════════════════════════════════════════════════════

def home(request):
    return render(request, 'game/homepage.html')


def gdpr(request):
    return render(request, 'game/gdpr.html')


def play_game(request):
    return render(request, 'game/gamepage.html')

@ensure_csrf_cookie
def game1(request):
    return render(request, 'game/emailgame.html')

@ensure_csrf_cookie
def game2(request):
    return render(request, 'game/aidetectorgame.html')

@ensure_csrf_cookie
def game3(request):
    return render(request, 'game/urlgame.html')


GLOSSARY_TERMS = {
    'Phishing':         'A social-engineering attack where attackers impersonate a trusted source by email, text, or phone in order to trick the victim into revealing credentials or clicking malicious links.',
    'Spear Phishing':   'A targeted phishing attack aimed at a specific individual or organisation, using personal details to appear more convincing.',
    'Deepfake':         'AI-generated synthetic media (audio, image, or video) that imitates a real person — often used to impersonate executives, family members, or public figures.',
    'AI Voice Clone':   'A type of deepfake that replicates a person\'s voice from short audio samples, often used in scam phone calls or voice-message fraud.',
    'Typosquatting':    'Registering domain names that look like a real brand but contain a typo (e.g. arnazon.com instead of amazon.com) to trick users.',
    'Homograph Attack': 'Using lookalike characters (e.g. the digit 0 instead of the letter o, or "rn" instead of "m") in a domain name to impersonate a legitimate site.',
    'URL Shortener':    'A service like bit.ly that hides the real destination of a link behind a short alias. Often abused to obscure phishing or malicious URLs.',
    'TLD':              'Top-Level Domain — the part of a URL after the final dot (e.g. .com, .net, .org). Wrong TLDs (e.g. paypal.net) are a common phishing indicator.',
    'HTTPS':            'Encrypted version of HTTP. Indicates the connection is private — but does NOT prove the site is legitimate, since attackers can also obtain certificates.',
    'Two-Factor Authentication': 'A security method requiring two forms of verification (typically password + a code or device) to log in. Strongly defends against credential phishing.',
    'Credential Harvesting': 'A scam designed to capture usernames and passwords, usually via a fake login page that looks identical to a real one.',
    'Social Engineering': 'Manipulating people into giving up information or access by exploiting trust, urgency, fear, or authority — rather than by hacking systems directly.',
    'CEO Fraud':        'A scam where attackers impersonate a senior executive to pressure staff into urgent wire transfers or sharing sensitive information.',
    'Spoofing':         'Faking the apparent source of a message — e.g. caller ID spoofing, email sender spoofing, or domain spoofing.',
    'Red Flag':         'A specific suspicious indicator within a message, URL, or interaction (e.g. urgent language, unusual sender, mismatched links) that signals potential fraud.',
}


def glossary(request):
    return render(request, 'game/glossary.html', {'glossary_terms': GLOSSARY_TERMS})


# ════════════════════════════════════════════════════════════════
# AUTHENTICATION
# ════════════════════════════════════════════════════════════════

def register_view(request):
    if request.user.is_authenticated:
        return redirect('play_game')

    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            messages.success(
                request,
                f'Account created successfully for {user.username}! You can now log in.'
            )
            return redirect('register')
    else:
        form = CustomUserCreationForm()

    return render(request, 'game/register.html', {'form': form})


def login_view(request):
    if request.user.is_authenticated:
        return redirect('play_game')

    if request.method == 'POST':
        form = CustomAuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('play_game')
    else:
        form = CustomAuthenticationForm()

    return render(request, 'game/login.html', {'form': form})


def logout_view(request):
    logout(request)
    return redirect('home')


# ════════════════════════════════════════════════════════════════
# PROFILE
# ════════════════════════════════════════════════════════════════

@login_required
def profile_view(request):
    user = request.user
    sessions = user.game_sessions.all().order_by('-completed_at')

    total_sessions = sessions.count()
    total_score    = sessions.aggregate(s=Sum('score'))['s'] or 0
    best_email     = sessions.filter(game='email').aggregate(m=Max('score'))['m'] or 0
    best_url       = sessions.filter(game='url').aggregate(m=Max('score'))['m'] or 0
    best_ai        = sessions.filter(game='ai').aggregate(m=Max('score'))['m'] or 0

    earned_badges = (
        UserBadge.objects.filter(user=user)
        .select_related('badge')
        .order_by('-earned_at')
    )

    # ADD THIS LINE: Extract a simple list of the badge IDs the user has earned
    earned_badge_ids = list(earned_badges.values_list('badge_id', flat=True))

    return render(request, 'game/profile.html', {
        'profile_user':   user,
        'sessions':       sessions[:20],
        'total_sessions': total_sessions,
        'total_score':    total_score,
        'best_email':     best_email,
        'best_url':       best_url,
        'best_ai':        best_ai,
        'earned_badges':  earned_badges,
        'all_badges':     Badge.objects.all().order_by('tier', 'name'),
        # ADD THIS LINE: Pass the ID list to the template
        'earned_badge_ids': earned_badge_ids,
    })


@login_required
@require_POST
def delete_account_view(request):
    confirm = request.POST.get('confirm', '').strip()
    if confirm != request.user.username:
        messages.error(
            request,
            'Confirmation text did not match your username. Account NOT deleted.'
        )
        return redirect('profile')

    username = request.user.username
    request.user.delete()
    logout(request)
    # Recompute rank badges since this user just left every leaderboard
    reassign_leaderboard_badges()
    messages.success(request, f'Account "{username}" has been permanently deleted.')
    return redirect('home')


# ════════════════════════════════════════════════════════════════
# LEADERBOARD
# ════════════════════════════════════════════════════════════════

def leaderboard_view(request):
    game_filter = request.GET.get('game', 'total')

    rows = []
    if game_filter in ('email', 'url', 'ai'):
        qs = (
            GameSession.objects
            .filter(game=game_filter)
            .values('user__username', 'guest__display_name', 'user_id', 'guest_id')
            .annotate(best=Max('score'))
            .order_by('-best')[:50]
        )
        for r in qs:
            name = r['user__username'] or r['guest__display_name'] or 'Unknown'
            rows.append({
                'name':     name,
                'is_guest': r['guest_id'] is not None,
                'is_you':   request.user.is_authenticated and r['user__username'] == request.user.username,
                'score':    r['best'],
            })
    else:
        agg = {}
        for game_code, _ in GAME_CHOICES:
            for s in (
                GameSession.objects
                .filter(game=game_code)
                .values('user_id', 'guest_id', 'user__username', 'guest__display_name')
                .annotate(best=Max('score'))
            ):
                key = ('u', s['user_id']) if s['user_id'] else ('g', s['guest_id'])
                if key not in agg:
                    agg[key] = {
                        'name':     s['user__username'] or s['guest__display_name'] or 'Unknown',
                        'is_guest': s['guest_id'] is not None,
                        'is_you':   request.user.is_authenticated and s['user__username'] == request.user.username,
                        'score':    0,
                    }
                agg[key]['score'] += s['best'] or 0
        rows = sorted(agg.values(), key=lambda x: -x['score'])[:50]

    return render(request, 'game/leaderboard.html', {
        'rows': rows,
        'game_filter': game_filter,
        'tabs': [
            ('total', 'Overall'),
            ('email', 'Phishing Ninja'),
            ('url',   'URL Slayer'),
            ('ai',    'Deepfake Detector'),
        ],
    })


# ════════════════════════════════════════════════════════════════
# DEV DASHBOARD
# ════════════════════════════════════════════════════════════════

def is_dev(user):
    return user.is_authenticated and user.is_staff


@user_passes_test(is_dev, login_url='home')
def dev_dashboard_view(request):
    game = request.GET.get('game', 'email')
    if game not in {g for g, _ in GAME_CHOICES}:
        game = 'email'

    sessions_qs = GameSession.objects.filter(game=game)

    overview = {
        'total_plays':   sessions_qs.count(),
        'unique_users':  sessions_qs.exclude(user=None).values('user').distinct().count(),
        'unique_guests': sessions_qs.exclude(guest=None).values('guest').distinct().count(),
        'avg_score':     round(sessions_qs.aggregate(a=Avg('score'))['a'] or 0, 1),
        'avg_verdicts':  round(sessions_qs.aggregate(a=Avg('correct_verdicts'))['a'] or 0, 2),
    }

    question_rows = []
    qres_qs = QuestionResult.objects.filter(session__game=game)
    scenario_ids = qres_qs.values_list('scenario_id', flat=True).distinct().order_by('scenario_id')
    for sid in scenario_ids:
        rows = qres_qs.filter(scenario_id=sid)
        n = rows.count()
        correct = rows.filter(verdict_correct=True).count()
        question_rows.append({
            'id':       sid,
            'attempts': n,
            'correct':  correct,
            'pct':      round(100 * correct / n, 1) if n else 0,
        })

    feature_rows = []
    grouped = (
        FeatureResult.objects.filter(game=game)
        .values('scenario_id', 'segment_id', 'segment_text')
        .annotate(seen=Count('id'), found=Count('id', filter=Q(identified=True)))
        .order_by('scenario_id', 'segment_id')
    )
    for g in grouped:
        feature_rows.append({
            'scenario': g['scenario_id'],
            'segment':  g['segment_id'],
            'text':     g['segment_text'],
            'seen':     g['seen'],
            'found':    g['found'],
            'pct':      round(100 * g['found'] / g['seen'], 1) if g['seen'] else 0,
        })

    return render(request, 'game/developerdashboard.html', {
        'game':          game,
        'overview':      overview,
        'question_rows': question_rows,
        'feature_rows':  feature_rows,
        'tabs': [
            ('email', 'Phishing Ninja'),
            ('url',   'URL Slayer'),
            ('ai',    'Deepfake Detector'),
        ],
    })


# ════════════════════════════════════════════════════════════════
# RESULT SUBMISSION (called from JS at end of each game)
# ════════════════════════════════════════════════════════════════

@require_POST
def submit_result_view(request):
    try:
        payload = json.loads(request.body.decode('utf-8'))
    except (ValueError, UnicodeDecodeError):
        return JsonResponse({'ok': False, 'error': 'Invalid JSON'}, status=400)

    game = payload.get('game')
    if game not in {g for g, _ in GAME_CHOICES}:
        return JsonResponse({'ok': False, 'error': 'Invalid game'}, status=400)

    user, guest = None, None
    if request.user.is_authenticated:
        user = request.user
    else:
        if not request.session.session_key:
            request.session.create()
        guest = GuestPlayer.get_or_create_for_session(request.session.session_key)

    session = GameSession.objects.create(
        user=user, guest=guest, game=game,
        score            = int(payload.get('score', 0) or 0),
        correct_verdicts = int(payload.get('correct_verdicts', 0) or 0),
        total_scenarios  = int(payload.get('total_scenarios',  0) or 0),
        flags_found      = int(payload.get('flags_found',      0) or 0),
        flags_total      = int(payload.get('flags_total',      0) or 0),
    )

    questions = payload.get('questions') or []
    QuestionResult.objects.bulk_create([
        QuestionResult(
            session=session,
            scenario_id=str(q.get('id', ''))[:20],
            verdict_correct=bool(q.get('verdict_correct', False)),
            flags_found=int(q.get('flags_found', 0) or 0),
            flags_total=int(q.get('flags_total', 0) or 0),
            points=int(q.get('points', 0) or 0),
        )
        for q in questions if q.get('id') is not None
    ])

    features = payload.get('features') or []
    FeatureResult.objects.bulk_create([
        FeatureResult(
            session=session, game=game,
            scenario_id=str(f.get('scenario', ''))[:20],
            segment_id=str(f.get('segment', ''))[:20],
            segment_text=(f.get('text') or '')[:255],
            identified=bool(f.get('identified', False)),
        )
        for f in features if f.get('scenario') and f.get('segment')
    ])

    # Award the personal badges (Triple Threat, Flawless Defender)
    new_badges = []
    if user:
        new_badges = award_badges_for_session(session)

    # Recompute rank badges after EVERY submission so the gold/silver/bronze
    # badges always reflect the current leaderboard standings.
    reassign_leaderboard_badges()

    # If the player just claimed a top-3 spot, surface the new rank badge in the toast.
    # We re-read their current badges and diff against what they had before this call.
    if user:
        # Anything they hold now that wasn't in `new_badges` and is a rank badge
        from .models import ALL_RANK_CODES
        rank_held = (
            UserBadge.objects.filter(user=user, badge__code__in=ALL_RANK_CODES)
            .select_related('badge')
        )
        for ub in rank_held:
            if not any(b.code == ub.badge.code for b in new_badges):
                # This is awarded but wasn't in the personal-badges return list.
                # Toast it on this submission too — only if it was just earned (within 5s).
                from django.utils import timezone
                from datetime import timedelta
                if timezone.now() - ub.earned_at < timedelta(seconds=5):
                    new_badges.append(ub.badge)

    return JsonResponse({
        'ok': True,
        'session_id': session.pk,
        'new_badges': [
            {'code': b.code, 'name': b.name, 'icon': b.icon, 'tier': b.tier}
            for b in new_badges
        ],
    })