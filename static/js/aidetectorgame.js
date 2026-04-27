/* ============================================================
   Deepfake Detector — Game logic
   ============================================================ */

/* ═══════════════════════════════════════════════════════════════
   SCENARIO DATA
═══════════════════════════════════════════════════════════════ */
const SCENARIOS = [

  // ── 1. AI VOICE CLONE — CEO phone call ──────────────────────────
  // Relates directly to pre-test Q11
  {
    id: 1,
    platform: 'phone',
    platformLabel: 'Phone Call Transcript',
    platformMeta: 'Received · Today 14:32',
    avatar: '👔', avatarBg: '#1565c0',
    senderName: 'James Whitfield (CEO)',
    senderSub: '+44 7700 900847 · Saved contact',
    mediaIcon: '🎤',
    mediaTitle: 'AI-reconstructed transcript · 0:54',
    mediaSub: 'Voice quality: normal · Caller ID matches saved contact',
    mediaWarning: '⚠ Caller ID CAN be spoofed',
    verdict: 'fake',
    suspiciousCount: 4,
    segments: [
      { id:'s1',  text:'"Hi, it\'s James.',                                         sus: false },
      { id:'s2',  text: ' Listen, I\'m stuck in an emergency board meeting and ',   sus: false },
      { id:'s3',  text: 'I can\'t access my laptop or company systems.',            sus: true,  reason: 'Conveniently removes all normal verification channels — you cannot email, Slack, or check the company portal to confirm the request.' },
      { id:'s4',  text: ' We need to urgently approve a supplier payment — ',       sus: false },
      { id:'s5',  text: 'can you transfer £10,000 to their account right now?',     sus: true,  reason: 'Unusually large transfer requested verbally over a phone call. Company policy requires dual director approval for any payment over £5,000.' },
      { id:'s6',  text: ' I\'ll text you the account details immediately.',         sus: false },
      { id:'s7',  text: ' This is completely confidential —',                       sus: true,  reason: 'Confidentiality demand prevents you from seeking a second opinion or following normal approval procedures — a key social engineering tactic.' },
      { id:'s8',  text: ' don\'t mention it to anyone else on the team.',           sus: true,  reason: 'Isolation tactic. Legitimate executives never instruct staff to bypass colleagues or internal approval chains for financial transactions.' },
      { id:'s9',  text: ' Time is critical. Just confirm once it\'s done."',        sus: false },
    ],
    cutReward: '⚔️ AI voice clone neutralised! Voice cloning technology can replicate anyone from just 3 seconds of audio found on social media or YouTube. Always verify payment requests through a separate, known channel — call the CEO\'s direct line from your contacts, not the number that just called you.',
    safeInfo: null,
  },

  // ── 2. DEEPFAKE VIDEO — Colleague requests credentials ───────────
  // Relates directly to pre-test Q12
  {
    id: 2,
    platform: 'whatsapp',
    platformLabel: 'WhatsApp · Video Message',
    platformMeta: 'Today · 11:24',
    avatar: '👩', avatarBg: '#005252',
    senderName: 'Sarah Jenkins',
    senderSub: '+44 7891 234567 · Marketing Team',
    mediaIcon: '🎬',
    mediaTitle: 'Video message · 0:42',
    mediaSub: 'Received over WhatsApp · Shows Sarah at home desk',
    mediaWarning: '⚠ Lip-sync delay ~0.2s detected',
    verdict: 'fake',
    suspiciousCount: 3,
    segments: [
      { id:'v1',  text:'"Hi! Thanks for watching this.',                           sus: false },
      { id:'v2',  text: ' I\'m working from home and my VPN stopped working.',     sus: false },
      { id:'v3',  text: ' Could you send me your login credentials',               sus: true,  reason: 'Credentials must NEVER be shared — not even with colleagues. This violates company security policy and creates personal liability for any misuse.' },
      { id:'v4',  text: ' so I can grab the files for the Morrison project?',      sus: false },
      { id:'v5',  text: ' Just reply with your username and password.',            sus: true,  reason: 'Any request for your password is an absolute red flag. Legitimate IT solutions involve the helpdesk resetting access — never borrowing another employee\'s credentials.' },
      { id:'v6',  text: ' I only need it for an hour or two,',                    sus: true,  reason: 'Downplaying the duration to reduce your concern. Credential access is not time-limited — anyone with your password has full, permanent access to your account.' },
      { id:'v7',  text: ' then you can change it.',                               sus: false },
      { id:'v8',  text: ' The client presentation is in 3 hours and I\'m panicking! Please help!"', sus: false },
    ],
    cutReward: '⚔️ Deepfake video threat destroyed! AI tools can clone a colleague\'s face and voice using LinkedIn photos and Zoom recordings. Never share credentials — even briefly. Contact Sarah directly on Teams or call her mobile to verify, using contact details you already have saved.',
    safeInfo: null,
  },

  // ── 3. REAL VIDEO INVITE — Legitimate Teams meeting ──────────────
  {
    id: 3,
    platform: 'teams',
    platformLabel: 'Microsoft Teams · Message',
    platformMeta: 'Today · 09:05',
    avatar: '👨', avatarBg: '#4527a0',
    senderName: 'David Chen · Project Manager',
    senderSub: 'david.chen@acmecorp.co.uk · Verified colleague',
    mediaIcon: '🎥',
    mediaTitle: 'Meeting invite · Q3 Project Review',
    mediaSub: 'Calendar link auto-populated · acmecorp.co.uk domain',
    mediaWarning: null,
    verdict: 'safe',
    suspiciousCount: 0,
    segments: [
      { id:'r1',  text:'Hi team,\n\n',                                             sus: false },
      { id:'r2',  text:'I\'ve set up our Q3 review meeting for tomorrow at 2pm.',  sus: false },
      { id:'r3',  text: ' You can join via the Teams link already on your calendar — no new link needed.', sus: false },
      { id:'r4',  text: '\n\nAgenda:\n1. Project milestones update\n2. Budget review\n3. Q4 planning\n\n', sus: false },
      { id:'r5',  text:'No preparation needed — just bring any blockers to discuss.', sus: false },
      { id:'r6',  text: '\n\nIf the time doesn\'t work, reply here and we\'ll reschedule.\n\nThanks — David', sus: false },
    ],
    cutReward: null,
    safeInfo: '🛡️ Correct — this is a legitimate Teams message. Legitimacy signals: verified company email domain (acmecorp.co.uk), uses the existing calendar link rather than sending a new one, standard agenda, no urgency, no request for credentials or money.',
  },

  // ── 4. CELEBRITY DEEPFAKE — Elon Musk Facebook Bitcoin scam ──────
  {
    id: 4,
    platform: 'facebook',
    platformLabel: 'Facebook · Sponsored Post',
    platformMeta: '6 hours ago · 👍 1.2M',
    avatar: '👤', avatarBg: '#01579b',
    senderName: 'Elon Musk · ✓ Verified',
    senderSub: 'Sponsored · Ad · 847K shares',
    mediaIcon: '🎬',
    mediaTitle: 'Video · 2:14 · AI-generated face detected',
    mediaSub: 'Subtle jawline blurring visible at 0:34 and 1:12',
    mediaWarning: '⚠ Verified ticks can be purchased or spoofed',
    verdict: 'fake',
    suspiciousCount: 4,
    segments: [
      { id:'e1',  text:'"I\'ve always believed in giving back to the people who made Tesla possible.', sus: false },
      { id:'e2',  text: ' That\'s why I\'m launching TeslaCoins —',                sus: true,  reason: 'No such product exists. Fabricated brand names are used to create false legitimacy for crypto scams.' },
      { id:'e3',  text: ' if you send any amount of Bitcoin to the address below,', sus: true,  reason: 'Legitimate investments never ask you to send cryptocurrency first. Once transferred, crypto is irreversible and immediately controlled by the scammer.' },
      { id:'e4',  text: ' I will personally double it and return it within 24 hours.', sus: true, reason: '"Doubling money" is the defining formula of crypto giveaway fraud. No one — including Elon Musk — doubles your money via social media.' },
      { id:'e5',  text: ' This is my personal guarantee.',                          sus: false },
      { id:'e6',  text: ' Offer closes at midnight tonight — limited spots only."', sus: true,  reason: 'Artificial deadline and scarcity. Pressure tactics prevent you from researching the offer or consulting others before acting.' },
    ],
    cutReward: '⚔️ Celebrity deepfake destroyed! AI deepfakes of Elon Musk have collectively stolen hundreds of millions. Verified ticks can be purchased. The FCA confirms: any investment asking you to "send crypto to receive more" is fraud. Report to Action Fraud: 0300 123 2040.',
    safeInfo: null,
  },

  // ── 5. CELEBRITY DEEPFAKE — Martin Lewis Instagram investment ─────
  {
    id: 5,
    platform: 'instagram',
    platformLabel: 'Instagram · Promoted Ad',
    platformMeta: '4.1M followers · Sponsored',
    avatar: '📺', avatarBg: '#6a1b9a',
    senderName: '@martinlewis_money · Promoted',
    senderSub: 'Sponsored advertisement · 2.3M views',
    mediaIcon: '📱',
    mediaTitle: 'Reel · 0:58 · Promoted to UK users',
    mediaSub: 'Facial inconsistencies detected at 0:11 and 0:44',
    mediaWarning: '⚠ Martin Lewis has publicly warned about fakes using his image',
    verdict: 'fake',
    suspiciousCount: 3,
    segments: [
      { id:'m1',  text:'"After 20 years in finance journalism,',                   sus: false },
      { id:'m2',  text: ' I\'ve finally found the ONE platform that\'s changed everything.', sus: false },
      { id:'m3',  text: ' ProfitAI has returned 340% in just 6 months.',           sus: true,  reason: 'The FCA states that any investment guaranteeing specific high returns is a scam. Legitimate FCA-regulated investments never promise fixed percentage returns.' },
      { id:'m4',  text: ' I\'m legally required to share this before it closes.',  sus: true,  reason: 'No such legal obligation exists. This fabricated phrase is designed to make the scammer sound reluctant and trustworthy, and to create false urgency.' },
      { id:'m5',  text: ' This opportunity closes tonight at midnight.',            sus: true,  reason: 'Artificial deadline. Countdown pressure is a core manipulation tactic to prevent you from researching the offer or consulting a financial advisor.' },
      { id:'m6',  text: ' Tap the link above to secure your position."',           sus: false },
    ],
    cutReward: '⚔️ Investment deepfake destroyed! Martin Lewis has issued multiple public warnings about AI ads misusing his likeness. Real investment opportunities have no countdown timers. If you see investment ads claiming celebrity endorsement, report them to the FCA at fca.org.uk/scamsmart.',
    safeInfo: null,
  },

  // ── 6. FAKE DISASTER PHOTO — Twitter AI flood scam ───────────────
  {
    id: 6,
    platform: 'twitter',
    platformLabel: 'X (Twitter)',
    platformMeta: '2 hours ago · 14.2K reposts',
    avatar: '📡', avatarBg: '#263238',
    senderName: '@BreakingUKNews247',
    senderSub: 'Account created 3 weeks ago · 412 followers',
    mediaIcon: '📷',
    mediaTitle: 'AI-generated image attached',
    mediaSub: 'Reverse image search: no results. Shadow angles inconsistent.',
    mediaWarning: '⚠ Image metadata shows AI generation tool signature',
    verdict: 'fake',
    suspiciousCount: 3,
    segments: [
      { id:'d1',  text:'🚨 BREAKING: Severe flooding hits Central London.',         sus: false },
      { id:'d2',  text: ' Thousands displaced.',                                    sus: false },
      { id:'d3',  text: ' The Government has COMPLETELY FAILED to respond.',        sus: false },
      { id:'d4',  text: ' Help victims NOW — every pound counts.',                  sus: false },
      { id:'d5',  text: ' Donate directly: send ETH to 0x7f4A3c9B...',            sus: true,  reason: 'Verified charities never solicit donations via a cryptocurrency wallet address. This is irreversible and untraceable by design.' },
      { id:'d6',  text: '\n\n[Account created 3 weeks ago,',                       sus: true,  reason: 'A brand new account breaking major national news with no prior history is a key red flag. Legitimate news outlets have years of posting history.' },
      { id:'d7',  text: ' 412 followers]',                                          sus: false },
      { id:'d8',  text: '\n\nPlease share — this needs to go viral before midnight.', sus: true, reason: 'Urgency to share before fact-checkers can respond is a deliberate tactic used in viral misinformation and disaster scam campaigns.' },
    ],
    cutReward: '⚔️ AI disaster scam destroyed! Image generators produce photorealistic scenes in seconds. Always verify through established outlets (BBC, Sky News) before sharing or donating. Only donate through registered charities (Red Cross, DEC) at their official websites — never to a crypto address in a tweet.',
    safeInfo: null,
  },

  // ── 7. REAL NEWS — BBC Valencia floods ───────────────────────────
  {
    id: 7,
    platform: 'bbc',
    platformLabel: 'BBC News · bbc.co.uk/news',
    platformMeta: 'Published: 2 Nov 2024',
    avatar: '📰', avatarBg: '#bb1919',
    senderName: 'BBC News',
    senderSub: 'Reporter: Tom Bateman · Europe Correspondent',
    mediaIcon: '📷',
    mediaTitle: 'Photo: Jorge Guerrero / AFP via Getty Images',
    mediaSub: 'Verified wire service image · Published on BBC.co.uk domain',
    mediaWarning: null,
    verdict: 'safe',
    suspiciousCount: 0,
    segments: [
      { id:'b1',  text:'Rescue teams continue searching for survivors',             sus: false },
      { id:'b2',  text: ' after flash floods devastated the Valencia region of Spain,', sus: false },
      { id:'b3',  text: ' killing over 200 people.',                               sus: false },
      { id:'b4',  text: ' The Spanish government has deployed 10,000 military personnel to assist recovery efforts.\n\n', sus: false },
      { id:'b5',  text:'The UK\'s Disasters Emergency Committee (DEC) has launched a humanitarian appeal.',              sus: false },
      { id:'b6',  text: ' To donate, visit the British Red Cross at redcross.org.uk/donate.',                            sus: false },
      { id:'b7',  text: '\n\nPhoto credit: Jorge Guerrero / AFP via Getty Images.\nCorroborated by: Reuters, Sky News, The Guardian, El País.', sus: false },
    ],
    cutReward: null,
    safeInfo: '🛡️ Correct — this is a genuine BBC News report. All verification signals present: named correspondent, named AFP wire photographer, published on bbc.co.uk, event independently verified by multiple major outlets, donation via registered charity website (not crypto). This is exactly what legitimate journalism looks like.',
  },

];

/* ═══════════════════════════════════════════════════════════════
   GAME STATE
═══════════════════════════════════════════════════════════════ */
let scenarioIndex  = 0;
let totalScore     = 0;
let highlighted    = {};
let wrongHighlights = 0;
let gamePhase      = 'reading';
let cardReady      = false;

/* ═══════════════════════════════════════════════════════════════
   START / RESTART
═══════════════════════════════════════════════════════════════ */
function startGame() {
  scenarioIndex  = 0;
  totalScore     = 0;
  show('screen-game');
  loadScenario(0);
}

function restartGame() {
  scenarioIndex  = 0;
  totalScore     = 0;
  document.getElementById('hud-score').textContent = '0';
  show('screen-gameover');
  show('screen-intro');
}

/* ═══════════════════════════════════════════════════════════════
   LOAD SCENARIO
═══════════════════════════════════════════════════════════════ */
function loadScenario(index) {
  highlighted     = {};
  wrongHighlights = 0;
  gamePhase       = 'reading';
  cardReady       = false;

  const sc = SCENARIOS[index];
  document.getElementById('hud-progress').textContent = (index + 1) + ' / ' + SCENARIOS.length;

  // Platform header
  const ph = document.getElementById('platform-header');
  ph.className = 'platform-header platform-' + sc.platform;
  ph.innerHTML = '<span class="ph-label">' + esc(sc.platformLabel) + '</span>'
               + '<span class="ph-meta">' + esc(sc.platformMeta) + '</span>';

  // Media note
  const mn = document.getElementById('media-note');
  if (sc.mediaIcon) {
    mn.style.display = 'flex';
    mn.innerHTML = '<span class="media-icon">' + sc.mediaIcon + '</span>'
      + '<div class="media-info">'
      +   '<div class="media-title">' + esc(sc.mediaTitle) + '</div>'
      + '</div>';
  } else {
    mn.style.display = 'none';
  }

  // Sender row
  const sr = document.getElementById('sender-row');
  sr.innerHTML = '<div class="s-avatar" style="background:' + sc.avatarBg + '">' + sc.avatar + '</div>'
    + '<div><div class="s-name">' + esc(sc.senderName) + '</div>'
    + '<div class="s-sub">' + esc(sc.senderSub) + '</div></div>';

  // Card body with segments
  const body = document.getElementById('card-body');
  body.innerHTML = '';
  sc.segments.forEach(function(seg) {
    const span = document.createElement('span');
    span.className = 'seg clickable';
    span.id = 'seg-' + seg.id;
    span.textContent = seg.text;
    span.onclick = function() { toggleHighlight(seg, span); };
    body.appendChild(span);
  });

  // Slash canvas + flash reset
  document.getElementById('slash-canvas').innerHTML = '';
  const flash = document.getElementById('flash-overlay');
  flash.style.animation = 'none';
  flash.style.opacity = '0';

  // Reset card visibility + restore action bar
  const card = document.getElementById('scenario-card');
  card.classList.remove('slash-mode');
  card.onclick = null;
  card.style.opacity = '1';
  card.style.transition = 'none';

  document.getElementById('action-bar').style.display = 'flex';
  document.getElementById('slash-hint').style.display  = 'none';
  hideFeedback();

  animateCardIn();
}

/* ─── SLIDE CARD UP FROM BOTTOM (mirrors emailgame animateEmailIn) ─── */
function animateCardIn() {
  var stage = document.getElementById('card-stage');
  var card  = document.getElementById('scenario-card');
  var stageH = stage.offsetHeight;
  card.style.transition = 'none';
  card.style.top = (stageH + 60) + 'px';
  // setTimeout guarantees browser has painted start position before transition fires
  setTimeout(function() {
    card.style.transition = 'top 3.8s cubic-bezier(0.22, 0.61, 0.36, 1)';
    card.style.top = '8px';
    cardReady = true;
  }, 60);
}

/* ═══════════════════════════════════════════════════════════════
   HIGHLIGHT SEGMENTS
═══════════════════════════════════════════════════════════════ */
function toggleHighlight(seg, span) {
  if (gamePhase !== 'reading') return;

  if (highlighted[seg.id]) {
    delete highlighted[seg.id];
    span.classList.remove('hit-correct', 'hit-wrong');
    if (!seg.sus) wrongHighlights = Math.max(0, wrongHighlights - 1);
    hideFeedback();
    return;
  }

  if (seg.sus) {
    highlighted[seg.id] = { correct: true };
    span.classList.add('hit-correct');
    addScore(30);
    showScorePopup('+30', span, var_green());
    showFeedback(true, 'RED FLAG FOUND!', seg.reason);
  } else {
    highlighted[seg.id] = { correct: false };
    span.classList.add('hit-wrong');
    wrongHighlights++;
    addScore(-10);
    showScorePopup('-10', span, '#ff6b35');
    showFeedback(false, 'NOT SUSPICIOUS', 'This text is legitimate — be precise with your highlights to avoid losing points.');
  }
}

/* ═══════════════════════════════════════════════════════════════
   VERDICT
═══════════════════════════════════════════════════════════════ */
function selectVerdict(v) {
  if (!cardReady) return;
  const sc = SCENARIOS[scenarioIndex];

  if (v === 'fake') {
    // Activate slash mode
    const card = document.getElementById('scenario-card');
    card.classList.add('slash-mode');
    document.getElementById('action-bar').style.display = 'none';
    document.getElementById('slash-hint').style.display  = 'block';
    hideFeedback();
    card.onclick = function(e) { doSlash(e); };
    gamePhase = 'slashing';
  } else {
    // Safe verdict
    gamePhase = 'done';
    if (sc.verdict === 'safe') {
      addScore(50);
      showResult(true, '🛡️', 'GENUINE CONTENT IDENTIFIED!', sc.safeInfo, 50, 0, 0, sc);
    } else {
      showResult(false, '❌', 'WRONG — THIS WAS AI-GENERATED!',
        'You let an AI fake pass. Check the red flags below to see what to look for next time.', 0, 0, 0, sc);
    }
  }
}

/* ═══════════════════════════════════════════════════════════════
   SLASH
═══════════════════════════════════════════════════════════════ */
function doSlash(e) {
  if (gamePhase !== 'slashing') return;
  gamePhase = 'done';

  const card = document.getElementById('scenario-card');
  const rect = card.getBoundingClientRect();
  const slashY = e.clientY - rect.top;

  card.onclick = null;
  card.classList.remove('slash-mode');
  document.getElementById('slash-hint').style.display = 'none';

  // Slash line
  const canvas = document.getElementById('slash-canvas');
  const line = document.createElement('div');
  line.className = 'slash-line';
  line.style.top = (slashY - 2) + 'px';
  canvas.appendChild(line);

  // Flash
  const flash = document.getElementById('flash-overlay');
  flash.style.animation = 'none';
  flash.offsetHeight;
  flash.style.opacity = '0.7';
  flash.style.animation = 'flashIn 0.5s ease-out forwards';

  spawnParticles(e.clientX, e.clientY);

  setTimeout(function() { splitCard(slashY); }, 260);

  const sc = SCENARIOS[scenarioIndex];
  addScore(10);
  const correctHighlights = Object.values(highlighted).filter(function(h) { return h.correct; }).length;
  const allFound = correctHighlights === sc.suspiciousCount;
  let bonus = 0;
  if (allFound && sc.suspiciousCount > 0) {
    bonus = 50;
    addScore(50);
  }

  setTimeout(function() {
    if (sc.verdict === 'fake') {
      showResult(true, '⚔️', 'AI FAKE DESTROYED!', sc.cutReward, 10, correctHighlights, bonus, sc);
    } else {
      showResult(false, '❌', 'WRONG — THIS WAS GENUINE!',
        'This was real content — you slashed a legitimate item. Check the legitimacy signals below.', 0, correctHighlights, 0, sc);
    }
  }, 900);
}

/* ═══════════════════════════════════════════════════════════════
   SPLIT ANIMATION
═══════════════════════════════════════════════════════════════ */
function splitCard(slashY) {
  const card    = document.getElementById('scenario-card');
  const stage   = document.getElementById('card-stage');
  const cardTop = parseFloat(card.style.top) || 0;

  var mkHalf = function(clipTop, clipBot, anim) {
    const h = card.cloneNode(true);
    h.style.cssText = '';
    h.style.position  = 'absolute';
    h.style.left      = card.offsetLeft + 'px';
    h.style.top       = cardTop + 'px';
    h.style.width     = card.offsetWidth + 'px';
    h.style.clipPath  = 'polygon(0 ' + clipTop + 'px, 100% ' + clipTop + 'px, 100% ' + clipBot + 'px, 0 ' + clipBot + 'px)';
    h.style.pointerEvents = 'none';
    h.style.zIndex    = '30';
    h.style.animation = anim;
    stage.appendChild(h);
    setTimeout(function() { h.remove(); }, 700);
  };

  mkHalf(0,      slashY,             'splitTop    0.6s ease-in forwards');
  mkHalf(slashY, card.offsetHeight + 4, 'splitBottom 0.6s ease-in forwards');
  card.style.opacity = '0';
  setTimeout(function() { card.style.opacity = '1'; }, 750);
}

/* ═══════════════════════════════════════════════════════════════
   PARTICLES
═══════════════════════════════════════════════════════════════ */
function spawnParticles(cx, cy) {
  for (var i = 0; i < 18; i++) {
    var p = document.createElement('div');
    p.className = 'particle';
    var angle = Math.random() * Math.PI * 2;
    var dist  = 30 + Math.random() * 80;
    var hue   = Math.random() > 0.5 ? '#ff4d6d' : '#ff9f43';
    p.style.cssText = 'left:' + cx + 'px;top:' + cy + 'px;background:' + hue
      + ';position:fixed;--dx:' + (Math.cos(angle)*dist) + 'px;--dy:' + (Math.sin(angle)*dist) + 'px'
      + ';animation:particleFly 0.7s ease-out forwards;animation-delay:' + (Math.random()*0.1) + 's'
      + ';width:' + (3+Math.random()*5) + 'px;height:' + (3+Math.random()*5) + 'px;border-radius:50%;pointer-events:none;z-index:999;';
    document.body.appendChild(p);
    setTimeout(function() { p.remove(); }, 900);
  }
}

/* ═══════════════════════════════════════════════════════════════
   RESULT OVERLAY
═══════════════════════════════════════════════════════════════ */
function showResult(success, icon, title, msg, basePoints, correctHighlights, bonus, sc) {
  const overlay = document.getElementById('result-overlay');
  document.getElementById('res-icon').textContent = icon;

  var titleEl = document.getElementById('res-title');
  titleEl.textContent = title;
  titleEl.className = 'result-title ' + (success ? 'good' : 'bad');

  document.getElementById('res-msg').textContent = msg || '';

  var roundScore = basePoints + (correctHighlights * 30) + bonus;
  document.getElementById('res-score-gained').textContent = '+' + roundScore;
  document.getElementById('res-score-label').textContent  = 'POINTS EARNED THIS ROUND';

  // Breakdown
  var breakdown = document.getElementById('res-breakdown');
  breakdown.innerHTML = '';
  if (sc && correctHighlights > 0) {
    addRow(breakdown, 'Red flags highlighted (' + correctHighlights + ' × 30)', '+' + (correctHighlights*30) + ' pts');
  }
  if (basePoints > 0) {
    var lbl = basePoints === 50 ? 'Genuine content — correct verdict' : 'AI fake cut — correct verdict';
    addRow(breakdown, lbl, '+' + basePoints + ' pts');
  }
  if (bonus > 0) {
    addRow(breakdown, '🌟 All red flags found! (bonus)', '+50 pts');
  }
  if (wrongHighlights > 0) {
    addRow(breakdown, 'Wrong highlights (' + wrongHighlights + ' × −10)', '−' + (wrongHighlights*10) + ' pts');
  }
  var tr = document.createElement('div');
  tr.className = 'breakdown-row breakdown-total';
  tr.innerHTML = '<span>Running total</span><span>' + totalScore + ' pts</span>';
  breakdown.appendChild(tr);

  // Missed red flags
  var missedDiv = document.getElementById('res-missed');
  if (sc && sc.suspiciousCount > 0) {
    var missed = sc.segments.filter(function(s) { return s.sus && !highlighted[s.id]; });
    if (missed.length > 0) {
      missedDiv.style.display = 'block';
      missedDiv.innerHTML = '<div class="missed-title">📍 Red flags you missed:</div>';
      missed.forEach(function(s) {
        var item = document.createElement('div');
        item.className = 'missed-item';
        item.innerHTML = '<span class="missed-text">"' + esc(s.text.trim()) + '"</span>'
                       + '<span class="missed-explain">' + esc(s.reason) + '</span>';
        missedDiv.appendChild(item);
      });
    } else { missedDiv.style.display = 'none'; }
  } else { missedDiv.style.display = 'none'; }

  var isLast = (scenarioIndex + 1 >= SCENARIOS.length);
  document.getElementById('btn-next').textContent = isLast ? '🏆 SEE FINAL SCORE' : 'NEXT SCENARIO →';

  overlay.classList.add('show');
}

function addRow(parent, label, value) {
  var row = document.createElement('div');
  row.className = 'breakdown-row';
  row.innerHTML = '<span>' + label + '</span><span>' + value + '</span>';
  parent.appendChild(row);
}

/* ═══════════════════════════════════════════════════════════════
   NEXT SCENARIO
═══════════════════════════════════════════════════════════════ */
function nextScenario() {
  document.getElementById('result-overlay').classList.remove('show');
  scenarioIndex++;
  if (scenarioIndex >= SCENARIOS.length) {
    document.getElementById('go-score').textContent = totalScore;
    show('screen-gameover');
  } else {
    var card = document.getElementById('scenario-card');
    card.style.opacity = '1';
    loadScenario(scenarioIndex);
  }
}

/* ═══════════════════════════════════════════════════════════════
   SCORE / FEEDBACK HELPERS
═══════════════════════════════════════════════════════════════ */
function addScore(pts) {
  totalScore = Math.max(0, totalScore + pts);
  var el = document.getElementById('hud-score');
  el.textContent = totalScore;
  el.style.transform = 'scale(1.2)';
  el.style.color = pts >= 0 ? '#80e5d5' : '#ff6b35';
  setTimeout(function() { el.style.transform = 'scale(1)'; el.style.color = 'var(--green)'; }, 300);
}

function showScorePopup(text, anchor, color) {
  var r = anchor.getBoundingClientRect();
  var popup = document.createElement('div');
  popup.className = 'score-popup';
  popup.textContent = text;
  popup.style.left = (r.left + r.width/2 - 20) + 'px';
  popup.style.top  = (r.top - 10) + 'px';
  popup.style.color = color || '#00c9a7';
  document.body.appendChild(popup);
  setTimeout(function() { popup.remove(); }, 1200);
}

function showFeedback(correct, title, body) {
  var bubble = document.getElementById('feedback-bubble');
  bubble.className = 'feedback-bubble show' + (correct ? '' : ' wrong-fb');
  document.getElementById('fb-icon').textContent = correct ? '🚨' : 'ℹ️';
  var t = document.getElementById('fb-title');
  t.className = 'fb-title ' + (correct ? 'good' : 'bad');
  t.textContent = title;
  document.getElementById('fb-body').textContent = body;
}

function hideFeedback() {
  document.getElementById('feedback-bubble').classList.remove('show');
}

/* ═══════════════════════════════════════════════════════════════
   SCREEN / UTILS
═══════════════════════════════════════════════════════════════ */
function show(id) {
  ['screen-intro','screen-game','screen-gameover'].forEach(function(s) {
    document.getElementById(s).className = 'screen ' + (s === id ? 'visible' : 'hidden');
  });
}

function esc(s) {
  if (!s) return '';
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function var_green() { return '#00c9a7'; }