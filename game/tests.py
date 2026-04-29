import json

from django.contrib.auth.models import User
from django.test import TestCase, Client

from .forms import CustomUserCreationForm
from .models import (
    Badge, UserBadge, GameSession, QuestionResult, FeatureResult,
    award_badges_for_session, reassign_leaderboard_badges, seed_badges,
)


# ════════════════════════════════════════════════════════════════════
# 1. FORM VALIDATION
# ════════════════════════════════════════════════════════════════════
class CustomUserCreationFormTests(TestCase):
    """
    Confirms the registration form enforces our username and password rules:
      • Username: letters, digits, and @ . _ only. No spaces. No "guest..."
      • Password: ≥ 8 characters, must include letters + digits + special chars
    """

    # ── Helper ────────────────────────────────────────────────────
    def _form(self, username, password):
        """Build a form instance with the given credentials."""
        return CustomUserCreationForm(data={
            'username':  username,
            'password1': password,
            'password2': password,
        })

    # ── Username ──────────────────────────────────────────────────
    def test_valid_username_and_password_passes(self):
        """A clean username and a strong password should validate."""
        form = self._form('cody.dev_2025', 'Strong#Pass1')
        self.assertTrue(form.is_valid(), msg=form.errors)

    def test_username_with_space_is_rejected(self):
        """Spaces are explicitly disallowed in usernames."""
        form = self._form('cody dev', 'Strong#Pass1')
        self.assertFalse(form.is_valid())
        self.assertIn('username', form.errors)

    def test_username_with_disallowed_character_is_rejected(self):
        """+ is not in the allowed character set (letters, digits, @ . _)."""
        form = self._form('cody+dev', 'Strong#Pass1')
        self.assertFalse(form.is_valid())
        self.assertIn('username', form.errors)

    def test_username_starting_with_guest_is_reserved(self):
        """'guest...' usernames are reserved for the guest player system."""
        form = self._form('guest123', 'Strong#Pass1')
        self.assertFalse(form.is_valid())
        self.assertIn('username', form.errors)

    def test_duplicate_username_is_rejected_case_insensitive(self):
        """An existing 'cody' should block 'CODY' from being registered."""
        User.objects.create_user(username='cody', password='Strong#Pass1')
        form = self._form('CODY', 'Strong#Pass1')
        self.assertFalse(form.is_valid())
        self.assertIn('username', form.errors)

    # ── Password ──────────────────────────────────────────────────
    def test_password_too_short_is_rejected(self):
        """A 7-character password should fail (the rule is ≥ 8)."""
        form = self._form('cody', 'Ab1!xyz')   # 7 chars
        self.assertFalse(form.is_valid())
        self.assertIn('password1', form.errors)

    def test_password_without_special_character_is_rejected(self):
        """Letters + digits alone, no symbol — should fail."""
        form = self._form('cody', 'Abcdefg1')
        self.assertFalse(form.is_valid())
        self.assertIn('password1', form.errors)


# ════════════════════════════════════════════════════════════════════
# 2. SUBMIT RESULT ENDPOINT
# ════════════════════════════════════════════════════════════════════
class SubmitResultViewTests(TestCase):
    """
    Confirms /api/submit-result/ correctly:
      • Accepts a valid payload from a logged-in user → creates a
        GameSession owned by that user
      • Accepts a valid payload from an anonymous visitor → creates a
        GuestPlayer + GameSession owned by the guest
      • Persists the questions[] and features[] arrays as
        QuestionResult and FeatureResult rows
      • Rejects invalid game codes and malformed JSON
    """

    URL = '/api/submit-result/'

    def setUp(self):
        # Rank-badge logic looks up Badge rows by code, so make sure
        # the badge table is populated before each test runs.
        seed_badges()
        self.client = Client()

    # ── Helper ────────────────────────────────────────────────────
    def _payload(self, **overrides):
        """Build a sensible default payload, overriding any fields as needed."""
        base = {
            'game': 'email',
            'score': 200,
            'correct_verdicts': 2,
            'total_scenarios':  3,
            'flags_found':      4,
            'flags_total':      6,
            'questions': [
                {'id': '1', 'verdict_correct': True,  'flags_found': 3, 'flags_total': 4, 'points': 130},
                {'id': '2', 'verdict_correct': False, 'flags_found': 1, 'flags_total': 2, 'points': 10},
            ],
            'features': [
                {'scenario': '1', 'segment': 's4', 'text': 'unusual activity', 'identified': True},
                {'scenario': '1', 'segment': 's8', 'text': 'suspended within 24 hours', 'identified': False},
            ],
        }
        base.update(overrides)
        return base

    def _post(self, payload):
        return self.client.post(
            self.URL,
            data=json.dumps(payload),
            content_type='application/json',
        )

    # ── Tests ─────────────────────────────────────────────────────
    def test_logged_in_user_submission_creates_session(self):
        """A logged-in user's submission should create a GameSession owned by them."""
        user = User.objects.create_user(username='cody', password='Strong#Pass1')
        self.client.login(username='cody', password='Strong#Pass1')

        response = self._post(self._payload(score=320))

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['ok'])

        # Exactly one session was created, owned by the user, with the right score
        self.assertEqual(GameSession.objects.count(), 1)
        session = GameSession.objects.first()
        self.assertEqual(session.user, user)
        self.assertIsNone(session.guest)
        self.assertEqual(session.score, 320)

    def test_anonymous_submission_creates_guest_session(self):
        """An anonymous submission should create a GuestPlayer and attach the session to it."""
        response = self._post(self._payload())

        self.assertEqual(response.status_code, 200)
        self.assertEqual(GameSession.objects.count(), 1)

        session = GameSession.objects.first()
        self.assertIsNone(session.user)
        self.assertIsNotNone(session.guest)
        self.assertTrue(session.is_guest)

    def test_question_and_feature_rows_are_created(self):
        """Each item in questions[] and features[] should become a database row."""
        self._post(self._payload())
        session = GameSession.objects.first()

        self.assertEqual(QuestionResult.objects.filter(session=session).count(), 2)
        self.assertEqual(FeatureResult.objects.filter(session=session).count(), 2)

        # Spot-check a single feature row to confirm the data round-tripped correctly
        feature = FeatureResult.objects.get(scenario_id='1', segment_id='s4')
        self.assertEqual(feature.segment_text, 'unusual activity')
        self.assertTrue(feature.identified)

    def test_invalid_game_code_returns_400(self):
        """An unknown game code should be rejected before any DB write happens."""
        response = self._post(self._payload(game='not_a_game'))
        self.assertEqual(response.status_code, 400)
        self.assertEqual(GameSession.objects.count(), 0)

    def test_malformed_json_returns_400(self):
        """A non-JSON body should be rejected gracefully, not crash the server."""
        response = self.client.post(
            self.URL, data='this is not json',
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 400)


# ════════════════════════════════════════════════════════════════════
# 3. BADGE AWARDING
# ════════════════════════════════════════════════════════════════════
class BadgeAwardingTests(TestCase):
    """
    Confirms the two automatic badge categories work as designed.

    Personal badges (award_badges_for_session):
      • Triple Threat       — earned after playing all three games once
      • Flawless Defender   — earned when correct_verdicts == total_scenarios
                              for the user's best run of every game

    Rank badges (reassign_leaderboard_badges):
      • #1 / #2 / #3 in each leaderboard, recomputed on every submission
    """

    def setUp(self):
        seed_badges()
        self.user = User.objects.create_user(
            username='cody', password='Strong#Pass1',
        )

    def _play(self, game, score, correct=1, total=1):
        """Helper: create a GameSession for self.user."""
        return GameSession.objects.create(
            user=self.user, game=game, score=score,
            correct_verdicts=correct, total_scenarios=total,
        )

    # ── seed_badges ───────────────────────────────────────────────
    def test_seed_badges_creates_all_expected_badges(self):
        """seed_badges() should leave exactly the 14 BotBusters badges."""
        self.assertEqual(Badge.objects.count(), 14)
        self.assertTrue(Badge.objects.filter(code='triple_threat').exists())
        self.assertTrue(Badge.objects.filter(code='flawless_defender').exists())
        self.assertTrue(Badge.objects.filter(code='rank1_overall').exists())

    # ── Triple Threat ─────────────────────────────────────────────
    def test_triple_threat_awarded_after_playing_all_three_games(self):
        """Playing email + url + ai once each should grant Triple Threat."""
        self._play('email', 100)
        self._play('url',   100)
        last = self._play('ai', 100)

        award_badges_for_session(last)

        self.assertTrue(
            UserBadge.objects.filter(user=self.user, badge__code='triple_threat').exists()
        )

    def test_triple_threat_not_awarded_with_only_two_games(self):
        """Two of three games played → no Triple Threat yet."""
        self._play('email', 100)
        last = self._play('url', 100)

        award_badges_for_session(last)

        self.assertFalse(
            UserBadge.objects.filter(user=self.user, badge__code='triple_threat').exists()
        )

    # ── Flawless Defender ─────────────────────────────────────────
    def test_flawless_defender_awarded_for_perfect_runs_in_all_games(self):
        """Perfect verdicts across all three games → Flawless Defender."""
        self._play('email', 100, correct=7, total=7)
        self._play('url',   100, correct=5, total=5)
        last = self._play('ai', 100, correct=7, total=7)

        award_badges_for_session(last)

        self.assertTrue(
            UserBadge.objects.filter(user=self.user, badge__code='flawless_defender').exists()
        )

    def test_flawless_defender_not_awarded_with_a_single_wrong_verdict(self):
        """One wrong verdict in any game → no Flawless Defender."""
        self._play('email', 100, correct=7, total=7)
        self._play('url',   100, correct=4, total=5)   # one missed
        last = self._play('ai', 100, correct=7, total=7)

        award_badges_for_session(last)

        self.assertFalse(
            UserBadge.objects.filter(user=self.user, badge__code='flawless_defender').exists()
        )

    # ── Rank badges ───────────────────────────────────────────────
    def test_rank_badges_assigned_to_top_three_in_a_game(self):
        """Three users with descending scores should each get the matching rank badge."""
        gold   = self.user
        silver = User.objects.create_user(username='ada',   password='Strong#Pass1')
        bronze = User.objects.create_user(username='alan',  password='Strong#Pass1')
        nope   = User.objects.create_user(username='other', password='Strong#Pass1')

        GameSession.objects.create(user=gold,   game='email', score=300)
        GameSession.objects.create(user=silver, game='email', score=200)
        GameSession.objects.create(user=bronze, game='email', score=100)
        GameSession.objects.create(user=nope,   game='email', score=50)

        reassign_leaderboard_badges()

        self.assertTrue(UserBadge.objects.filter(user=gold,   badge__code='rank1_email').exists())
        self.assertTrue(UserBadge.objects.filter(user=silver, badge__code='rank2_email').exists())
        self.assertTrue(UserBadge.objects.filter(user=bronze, badge__code='rank3_email').exists())
        # The 4th-place player should not hold any rank badge
        self.assertFalse(UserBadge.objects.filter(user=nope, badge__code__startswith='rank').exists())


# ════════════════════════════════════════════════════════════════════
# 4. LEADERBOARD
# ════════════════════════════════════════════════════════════════════
class LeaderboardViewTests(TestCase):
    """
    Confirms the public leaderboard sorts players by their best score
    (not their average, not their latest, not the sum of all runs).
    """

    # NOTE: if your urls.py uses a different path for the leaderboard,
    # update this URL constant accordingly.
    URL = '/leaderboard/'

    def test_leaderboard_orders_by_best_score(self):
        """A user's best run is the only one that should appear, and the order should be descending."""
        cody = User.objects.create_user(username='cody', password='Strong#Pass1')
        ada  = User.objects.create_user(username='ada',  password='Strong#Pass1')

        # Cody plays twice — best run is 500
        GameSession.objects.create(user=cody, game='email', score=200)
        GameSession.objects.create(user=cody, game='email', score=500)
        # Ada plays once at 300
        GameSession.objects.create(user=ada,  game='email', score=300)

        response = self.client.get(f'{self.URL}?game=email')

        self.assertEqual(response.status_code, 200)
        rows = response.context['rows']
        self.assertEqual(len(rows), 2)              # one row per player, not per session
        self.assertEqual(rows[0]['name'],  'cody')   # highest best-score first
        self.assertEqual(rows[0]['score'], 500)
        self.assertEqual(rows[1]['name'],  'ada')


# ════════════════════════════════════════════════════════════════════
# 5. DEV DASHBOARD ACCESS CONTROL
# ════════════════════════════════════════════════════════════════════
class DevDashboardAccessTests(TestCase):
    """
    Confirms /dev/dashboard/ is locked down to staff users.
    Anyone else should be redirected away.
    """

    URL = '/dev/dashboard/'

    def test_anonymous_user_is_redirected(self):
        """No login → redirect (302), not page render."""
        response = self.client.get(self.URL)
        self.assertEqual(response.status_code, 302)

    def test_regular_user_is_redirected(self):
        """Logged in but not staff → redirect."""
        User.objects.create_user(username='cody', password='Strong#Pass1')
        self.client.login(username='cody', password='Strong#Pass1')
        response = self.client.get(self.URL)
        self.assertEqual(response.status_code, 302)

    def test_staff_user_can_access_dashboard(self):
        """is_staff=True → page renders normally (200)."""
        User.objects.create_user(
            username='admin', password='Strong#Pass1', is_staff=True,
        )
        self.client.login(username='admin', password='Strong#Pass1')
        response = self.client.get(self.URL)
        self.assertEqual(response.status_code, 200)