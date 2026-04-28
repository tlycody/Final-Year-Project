"""
models.py — v3
==============
Database schema + badge-awarding logic for BotBusters.

Badges (only these):
  • Top-3 Overall (sum of best score across all 3 games):  gold/silver/bronze
  • Top-3 Phishing Ninja:    gold/silver/bronze
  • Top-3 URL Slayer:        gold/silver/bronze
  • Top-3 Deepfake Detector: gold/silver/bronze
  • Triple Threat — completed all three games at least once
  • Flawless Defender — no wrong verdicts across all three games

The leaderboard rank badges are reassigned every time a new result is
submitted, so that #1/#2/#3 always reflect the current standings.
"""

from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


# ════════════════════════════════════════════════════════════════
# GUEST PLAYER
# ════════════════════════════════════════════════════════════════
class GuestPlayer(models.Model):
    session_key  = models.CharField(max_length=64, unique=True, db_index=True)
    display_name = models.CharField(max_length=32)
    created_at   = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return self.display_name

    @classmethod
    def get_or_create_for_session(cls, session_key):
        guest, created = cls.objects.get_or_create(session_key=session_key)
        if created or not guest.display_name:
            guest.display_name = f'Guest {guest.pk}'
            guest.save(update_fields=['display_name'])
        return guest


# ════════════════════════════════════════════════════════════════
# GAME SESSION + RESULTS
# ════════════════════════════════════════════════════════════════
GAME_CHOICES = [
    ('email', 'Phishing Ninja'),
    ('url',   'URL Slayer'),
    ('ai',    'Deepfake Detector'),
]


class GameSession(models.Model):
    user  = models.ForeignKey(User, on_delete=models.CASCADE, related_name='game_sessions',
                              null=True, blank=True)
    guest = models.ForeignKey(GuestPlayer, on_delete=models.CASCADE, related_name='game_sessions',
                              null=True, blank=True)
    game = models.CharField(max_length=10, choices=GAME_CHOICES)
    score = models.IntegerField(default=0)
    correct_verdicts = models.IntegerField(default=0)
    total_scenarios  = models.IntegerField(default=0)
    flags_found      = models.IntegerField(default=0)
    flags_total      = models.IntegerField(default=0)
    completed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-completed_at']
        indexes = [
            models.Index(fields=['game', '-score']),
            models.Index(fields=['-completed_at']),
        ]

    def __str__(self):
        who = self.user.username if self.user else (self.guest.display_name if self.guest else '?')
        return f'{who} · {self.get_game_display()} · {self.score}'

    @property
    def player_name(self):
        if self.user_id: return self.user.username
        if self.guest_id: return self.guest.display_name
        return 'Unknown'

    @property
    def is_guest(self):
        return self.guest_id is not None


class QuestionResult(models.Model):
    session = models.ForeignKey(GameSession, on_delete=models.CASCADE, related_name='results')
    scenario_id = models.CharField(max_length=20)
    verdict_correct = models.BooleanField(default=False)
    flags_found = models.IntegerField(default=0)
    flags_total = models.IntegerField(default=0)
    points = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [models.Index(fields=['session', 'scenario_id'])]


class FeatureResult(models.Model):
    session  = models.ForeignKey(GameSession, on_delete=models.CASCADE, related_name='features')
    game = models.CharField(max_length=10, choices=GAME_CHOICES)
    scenario_id = models.CharField(max_length=20)
    segment_id  = models.CharField(max_length=20)
    segment_text = models.CharField(max_length=255)
    identified = models.BooleanField(default=False)

    class Meta:
        indexes = [models.Index(fields=['game', 'scenario_id', 'segment_id'])]


# ════════════════════════════════════════════════════════════════
# BADGES
# ════════════════════════════════════════════════════════════════
class Badge(models.Model):
    code = models.SlugField(unique=True)
    name = models.CharField(max_length=64)
    description = models.CharField(max_length=200)
    icon = models.CharField(max_length=8, default='🏅')
    tier = models.CharField(
        max_length=8,
        choices=[('bronze', 'Bronze'), ('silver', 'Silver'), ('gold', 'Gold'), ('special', 'Special')],
        default='bronze',
    )

    def __str__(self):
        return self.name


class UserBadge(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='badges')
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)
    earned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'badge')
        ordering = ['-earned_at']


# ════════════════════════════════════════════════════════════════
# BADGE CODES (constants — used by the awarding logic)
# ════════════════════════════════════════════════════════════════
RANK_BADGE_CODES = {
    'overall': ['rank1_overall', 'rank2_overall', 'rank3_overall'],
    'email':   ['rank1_email',   'rank2_email',   'rank3_email'],
    'url':     ['rank1_url',     'rank2_url',     'rank3_url'],
    'ai':      ['rank1_ai',      'rank2_ai',      'rank3_ai'],
}
ALL_RANK_CODES = [c for codes in RANK_BADGE_CODES.values() for c in codes]


# ════════════════════════════════════════════════════════════════
# BADGE AWARDING — called after each result submission
# ════════════════════════════════════════════════════════════════
def award_badges_for_session(session: GameSession):
    """
    Called after a user completes a session. Awards the two non-rank
    badges (Triple Threat, Flawless Defender). Rank badges are handled
    separately by reassign_leaderboard_badges().

    Returns the list of newly awarded Badge objects.
    """
    if not session.user_id:
        return []

    user = session.user
    new_badges = []

    def grant(code):
        try:
            badge = Badge.objects.get(code=code)
        except Badge.DoesNotExist:
            return
        ub, created = UserBadge.objects.get_or_create(user=user, badge=badge)
        if created:
            new_badges.append(badge)

    # ── Triple Threat: played all 3 games ─────────────────────
    games_played = set(user.game_sessions.values_list('game', flat=True))
    if {'email', 'url', 'ai'}.issubset(games_played):
        grant('triple_threat')

    # ── Flawless Defender: no wrong verdicts in their best run
    #    of EACH game (i.e. they have a perfect playthrough of all 3) ──
    if {'email', 'url', 'ai'}.issubset(games_played):
        all_perfect = True
        for g in ('email', 'url', 'ai'):
            best = (
                user.game_sessions
                .filter(game=g, total_scenarios__gt=0)
                .order_by('-correct_verdicts', '-score')
                .first()
            )
            if not best or best.correct_verdicts < best.total_scenarios:
                all_perfect = False
                break
        if all_perfect:
            grant('flawless_defender')

    return new_badges


def reassign_leaderboard_badges():
    """
    Recompute who currently holds the top-3 rank badges in each
    leaderboard (overall + 3 individual games). Called after every
    new result submission so badges move dynamically.

    Only awarded to logged-in users (guest scores are still on the
    leaderboard but can't earn badges — they have no User record).
    """
    from django.db.models import Max

    # Build {user_id: best_score} for each leaderboard
    boards = {}

    # Per-game best scores
    for game_code in ('email', 'url', 'ai'):
        rows = (
            GameSession.objects
            .filter(game=game_code, user__isnull=False)
            .values('user_id')
            .annotate(best=Max('score'))
            .order_by('-best')
        )
        boards[game_code] = [(r['user_id'], r['best']) for r in rows]

    # Overall = sum of best score per game per user
    user_totals = {}
    for game_code in ('email', 'url', 'ai'):
        for uid, best in boards[game_code]:
            user_totals[uid] = user_totals.get(uid, 0) + (best or 0)
    boards['overall'] = sorted(user_totals.items(), key=lambda x: -x[1])

    # For each leaderboard, take the top 3 user_ids and reassign badges
    for board_key, ranked in boards.items():
        codes = RANK_BADGE_CODES[board_key]
        top3 = ranked[:3]

        # Make sure each top-N user has the correct rank badge,
        # and revoke that same rank from any user who isn't holding it now.
        for rank_index, code in enumerate(codes):
            try:
                badge = Badge.objects.get(code=code)
            except Badge.DoesNotExist:
                continue

            target_user_id = top3[rank_index][0] if rank_index < len(top3) else None

            # Remove the badge from anyone who currently has it but shouldn't
            UserBadge.objects.filter(badge=badge).exclude(user_id=target_user_id).delete()

            # Grant it to the rightful holder (if there is one)
            if target_user_id is not None:
                UserBadge.objects.get_or_create(user_id=target_user_id, badge=badge)


# ════════════════════════════════════════════════════════════════
# SEED — populates the Badge table
# ════════════════════════════════════════════════════════════════
def seed_badges():
    """
    Idempotent — safe to run repeatedly. Creates only the badges we want
    and removes any old ones from previous versions.
    """
    desired = [
        # ── Overall top 3 ──
        ('rank1_overall', '#1 Overall',         'Highest combined score across all three games',  'gold',   '🥇'),
        ('rank2_overall', '#2 Overall',         'Second highest combined score across all games', 'silver', '🥈'),
        ('rank3_overall', '#3 Overall',         'Third highest combined score across all games',  'bronze', '🥉'),

        # ── Phishing Ninja top 3 ──
        ('rank1_email',   '#1 Phishing Ninja',  'Highest score in Phishing Ninja',                'gold',   '🥇'),
        ('rank2_email',   '#2 Phishing Ninja',  'Second highest score in Phishing Ninja',         'silver', '🥈'),
        ('rank3_email',   '#3 Phishing Ninja',  'Third highest score in Phishing Ninja',          'bronze', '🥉'),

        # ── URL Slayer top 3 ──
        ('rank1_url',     '#1 URL Slayer',      'Highest score in URL Slayer',                    'gold',   '🥇'),
        ('rank2_url',     '#2 URL Slayer',      'Second highest score in URL Slayer',             'silver', '🥈'),
        ('rank3_url',     '#3 URL Slayer',      'Third highest score in URL Slayer',              'bronze', '🥉'),

        # ── Deepfake Detector top 3 ──
        ('rank1_ai',      '#1 Deepfake Detector', 'Highest score in Deepfake Detector',           'gold',   '🥇'),
        ('rank2_ai',      '#2 Deepfake Detector', 'Second highest score in Deepfake Detector',    'silver', '🥈'),
        ('rank3_ai',      '#3 Deepfake Detector', 'Third highest score in Deepfake Detector',     'bronze', '🥉'),

        # ── Special ──
        ('triple_threat',     'Triple Threat',     'Complete all three games at least once',       'special', '⭐'),
        ('flawless_defender', 'Flawless Defender', 'No wrong verdicts across all three games',     'special', '🛡'),
    ]

    desired_codes = {row[0] for row in desired}

    # Insert / update wanted badges
    for code, name, desc, tier, icon in desired:
        Badge.objects.update_or_create(
            code=code,
            defaults=dict(name=name, description=desc, tier=tier, icon=icon),
        )

    # Remove any old badges that aren't in the new list (clean migration
    # from earlier versions like 'rookie', 'phish_slayer', 'cyber_sentinel').
    Badge.objects.exclude(code__in=desired_codes).delete()