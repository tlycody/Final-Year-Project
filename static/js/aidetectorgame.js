/* Deepfake Detector — Game logic */

/* SCENARIO DATA */
const SCENARIOS = [

  // ── 1. AI VOICE CLONE — CEO phone call (audio playback) 

  {
    id: 1,
    platform: 'phone',
    platformLabel: 'Voicemail recording',
    platformMeta: 'Received · Today 14:32',
    avatar: '👩', avatarBg: '#F8C8DC',
    senderName: 'Sarah',
    senderSub: '+44 7700 900847 · Saved contact',
    mediaSub: 'Caller ID matches saved contact',
    mediaWarning: '⚠ Caller ID CAN be spoofed',
    verdict: 'fake',
    suspiciousCount: 0,
    mediaType: 'audio',
    segments: [],
    cutReward: 'AI voice clone neutralised! Voice cloning technology can replicate anyone from just 3 seconds of audio found on social media or YouTube. Listen for: unnatural pacing, missing breaths, flat emotion, requests for urgent payments, demands for secrecy. Always verify payment requests through a separate, known channel.',
    safeInfo: null,
  },

  // ── 2. DEEPFAKE VIDEO — Colleague requests credentials (video playback) 
  {
    id: 2,
    platform: 'whatsapp',
    platformLabel: 'Video message',
    platformMeta: 'Today · 11:27',
    avatar: '👨', avatarBg: '#005252',
    senderName: 'James',
    senderSub: '+44 7891 234567 · Marketing Team',
    mediaSub: 'Received over WhatsApp',
    mediaWarning: '⚠ Watch closely — could this be a deepfake?',
    verdict: 'fake',
    suspiciousCount: 0,
    mediaType: 'video',
    segments: [],
    cutReward: 'Deepfake video threat destroyed! AI tools can clone a colleague\'s face and voice using LinkedIn photos and Zoom recordings. Watch for: lip-sync delays, unnatural blinking, inconsistent lighting on the face, requests to share credentials. Never share passwords, even briefly! Contact James directly on Teams or call her mobile to verify, using contact details you already have saved.',
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
    mediaSub: 'Subtle jawline blurring visible at 0:34 and 1:12',
    mediaWarning: '⚠ Verified ticks can be purchased or spoofed',
    verdict: 'fake',
    suspiciousCount: 4,
    segments: [
      { id:'e1',  text:'I\'ve always believed in giving back to the people who made Tesla possible.', sus: false },
      { id:'e2',  text: ' That\'s why I\'m launching TeslaCoins. ',                sus: true,  reason: 'No such product exists. Fabricated brand names are used to create false legitimacy for crypto scams.' },
      { id:'e3',  text: ' If you send any amount of Bitcoin to the address below,', sus: true,  reason: 'Legitimate investments never ask you to send cryptocurrency first. Once transferred, crypto is irreversible and immediately controlled by the scammer.' },
      { id:'e4',  text: ' I will personally double it and return it within 24 hours.', sus: true, reason: '"Doubling money" is the defining formula of crypto giveaway fraud. No one — including Elon Musk — doubles your money via social media.' },
      { id:'e5',  text: ' This is my personal guarantee.',                          sus: false },
      { id:'e6',  text: ' Offer closes at midnight tonight, limited spots only!', sus: true,  reason: 'Artificial deadline and scarcity. Pressure tactics prevent you from researching the offer or consulting others before acting.' },
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
    mediaSub: 'Facial inconsistencies detected at 0:11 and 0:44',
    mediaWarning: '⚠ Martin Lewis has publicly warned about fakes using his image',
    verdict: 'fake',
    suspiciousCount: 3,
    segments: [
      { id:'m1',  text:'After 20 years in finance journalism,',                   sus: false },
      { id:'m2',  text: ' I\'ve finally found the ONE platform that\'s changed everything.', sus: false },
      { id:'m3',  text: ' ProfitAI has returned 340% in just 6 months.',           sus: true,  reason: 'The FCA states that any investment guaranteeing specific high returns is a scam. Legitimate FCA-regulated investments never promise fixed percentage returns.' },
      { id:'m4',  text: ' I\'m legally required to share this before it closes.',  sus: true,  reason: 'No such legal obligation exists. This fabricated phrase is designed to make the scammer sound reluctant and trustworthy, and to create false urgency.' },
      { id:'m5',  text: ' This opportunity closes tonight at midnight.',            sus: true,  reason: 'Artificial deadline. Countdown pressure is a core manipulation tactic to prevent you from researching the offer or consulting a financial advisor.' },
      { id:'m6',  text: ' Tap the link above to secure your position.',           sus: false },
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
    mediaSub: 'Reverse image search: no results. Shadow angles inconsistent.',
    mediaWarning: '⚠ Image metadata shows AI generation tool signature',
    hasImage: true,
    imageKey: 'tweetImage',
    imageAlt: 'Tweeted flood photo (AI-generated)',
    verdict: 'fake',
    suspiciousCount: 3,
    segments: [
      { id:'d1',  text:'🚨 BREAKING: Severe flooding hits Central London.',         sus: false },
      { id:'d2',  text: ' Thousands displaced.',                                    sus: false },
      { id:'d3',  text: ' The Government has COMPLETELY FAILED to respond.',        sus: false },
      { id:'d4',  text: ' Help victims NOW! Every pound counts!',                  sus: false },
      { id:'d5',  text: ' Donate directly: send ETH to 0x7f4A3c9B',            sus: true,  reason: 'Verified charities never solicit donations via a cryptocurrency wallet address. This is irreversible and untraceable by design.' },
      { id:'d6',  text: ' \n\nPlease share — this needs to go viral before midnight.', sus: true, reason: 'Urgency to share before fact-checkers can respond is a deliberate tactic used in viral misinformation and disaster scam campaigns.' },
      { id:'d7',  text: '\n\n[Account created 3 weeks ago,',                       sus: true,  reason: 'A brand new account breaking major national news with no prior history is a key red flag. Legitimate news outlets have years of posting history.' },
      { id:'d8',  text: ' 412 followers]',                                          sus: false },
    ],
    cutReward: 'AI disaster scam destroyed! Image generators produce photorealistic scenes in seconds. Always verify through established outlets (BBC, Sky News) before sharing or donating. Only donate through registered charities (Red Cross, DEC) at their official websites — never to a crypto address in a tweet.',
    safeInfo: null,
  },

  // ── 7. REAL NEWS — BBC Valencia floods ───────────────────────────
  {
    id: 7,
    platform: 'bbc',
    platformLabel: 'BBC News · bbc.co.uk/news',
    platformMeta: '18 Nov 2024',
    avatar: '📰', avatarBg: '#bb1919',
    senderName: 'BBC News',
    senderSub: 'Reporter: Bea Swallow · BBC News, Somerset',
    mediaSub: 'Photo source named in caption · Published on bbc.co.uk',
    mediaWarning: null,
    hasImage: true,
    imageKey: 'bbcImage',
    imageAlt: 'Cars piled by Valencia flash floods — Photo: Zoe Wilkes',
    verdict: 'safe',
    suspiciousCount: 0,
    segments: [
      { id:'b1',  text:'A British woman living in Valencia',                                                  sus: false },
      { id:'b2',  text: ' has organised a team of around 60 volunteers',                                       sus: false },
      { id:'b3',  text: ' to help rebuild after October\'s devastating flash floods.\n\n',                     sus: false },
      { id:'b4',  text:'Zoe Wilkes, originally from Taunton in Somerset,',                                     sus: false },
      { id:'b5',  text: ' said meteorologists reported a year\'s worth of rain fell in eight hours in parts of the region.\n\n', sus: false },
      { id:'b6',  text:'The Guardia Civil has confirmed pver 200 people died in what authorities describe as the deadliest flooding in modern Spanish history.\n\n', sus: false },
    ],
    cutReward: null,
    safeInfo: 'This is a genuine BBC News report. Verification signals all present: named correspondent (Bea Swallow, BBC News Somerset), named photo source (Zoe Wilkes — the interviewee herself, transparently credited even though it is user-supplied imagery), published on the bbc.co.uk domain, authoritative figures cited (Aemet weather agency, Guardia Civil), and the underlying event is independently verified by multiple major outlets. Legitimate journalism names its sources and lets you trace them.',
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

// Backend tracking — sent to /api/submit-result/ on game over
let questionResults    = [];   // one row per scenario
let featureResults     = [];   // one row per suspicious segment
let correctVerdictsCnt = 0;
let flagsFoundTotal    = 0;
let flagsTotalTotal    = 0;

/* ═══════════════════════════════════════════════════════════════
   START / RESTART
═══════════════════════════════════════════════════════════════ */
function startGame() {
  scenarioIndex  = 0;
  totalScore     = 0;
  questionResults    = [];
  featureResults     = [];
  correctVerdictsCnt = 0;
  flagsFoundTotal    = 0;
  flagsTotalTotal    = 0;
  show('screen-game');
  loadScenario(0);
}

function restartGame() {
  scenarioIndex  = 0;
  totalScore     = 0;
  questionResults    = [];
  featureResults     = [];
  correctVerdictsCnt = 0;
  flagsFoundTotal    = 0;
  flagsTotalTotal    = 0;
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

  // Card body: media player OR clickable text segments
  const body = document.getElementById('card-body');
  body.innerHTML = '';

  if (sc.mediaType === 'audio' || sc.mediaType === 'video') {
    // ── Media playback scenario — no highlighting ──
    const wrap = document.createElement('div');
    wrap.className = 'media-player-wrap';

    if (sc.mediaPrompt) {
      const prompt = document.createElement('div');
      prompt.className = 'media-prompt';
      prompt.textContent = sc.mediaPrompt;
      wrap.appendChild(prompt);
    }

    const paths = window.MEDIA_PATHS || {};
    let player;

    if (sc.mediaType === 'audio') {
      player = document.createElement('audio');
      player.src = paths.voiceCall || '';
      player.controls = true;
      player.preload = 'metadata';
      player.className = 'media-audio';
    } else {
      player = document.createElement('video');
      player.src = paths.videoCall || '';
      player.controls = true;
      player.preload = 'metadata';
      player.playsInline = true;
      player.className = 'media-video';
    }
    // Stop clicks on player from triggering the slash
    player.onclick = function(e) { e.stopPropagation(); };
    wrap.appendChild(player);

    body.appendChild(wrap);
  } else {
    // ── Standard scenario — clickable text segments ──
    sc.segments.forEach(function(seg) {
      const span = document.createElement('span');
      span.className = 'seg clickable';
      span.id = 'seg-' + seg.id;
      span.textContent = seg.text;
      span.onclick = function() { toggleHighlight(seg, span); };
      body.appendChild(span);
    });

    // Optional attached image (e.g. tweet photo, news photo)
    if (sc.hasImage) {
      const paths = window.MEDIA_PATHS || {};
      const imgWrap = document.createElement('div');
      imgWrap.className = 'tweet-image-wrap';
      const img = document.createElement('img');
      img.className = 'tweet-image';
      img.src = paths[sc.imageKey] || '';
      img.alt = sc.imageAlt || 'Attached image';
      img.onclick = function(e) { e.stopPropagation(); };
      imgWrap.appendChild(img);
      body.appendChild(imgWrap);
    }
  }

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

  // Pause any media currently playing in the card
  const mediaEl = document.querySelector('#scenario-card audio, #scenario-card video');

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
    if (mediaEl) { try { mediaEl.pause(); } catch (e) {} }
    gamePhase = 'done';
    const isMediaScenario = !!sc.mediaType;
    if (sc.verdict === 'safe') {
      addScore(50);
      showResult(true, '🛡️', 'GENUINE CONTENT IDENTIFIED!', sc.safeInfo, 50, 0, 0, sc);
    } else {
      // Wrong — passed a fake as genuine
      const penalty = isMediaScenario ? -50 : 0;
      if (penalty !== 0) addScore(penalty);
      // For media scenarios there are no segment-level red flags shown below,
      // so use the educational cutReward as the explanation. Text scenarios
      // keep the generic message (their red flags are listed in the missed section).
      const wrongMsg = (isMediaScenario && sc.cutReward)
        ? sc.cutReward
        : 'You let an AI fake pass. Check the red flags below to see what to look for next time.';
      showResult(false, '❌', 'WRONG — THIS WAS AI-GENERATED!',
        wrongMsg, penalty, 0, 0, sc);
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

  // Pause any media playing inside the card before slashing
  const mediaEl = card.querySelector('audio, video');
  if (mediaEl) { try { mediaEl.pause(); } catch (e) {} }

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
  const isMediaScenario = !!sc.mediaType;
  const correctSlash = (sc.verdict === 'fake');
  const correctHighlights = Object.values(highlighted).filter(function(h) { return h.correct; }).length;
  const allFound = correctHighlights === sc.suspiciousCount;

  let basePoints = 0;
  let bonus = 0;
  if (correctSlash) {
    basePoints = isMediaScenario ? 50 : 10;
    if (allFound && sc.suspiciousCount > 0) bonus = 50;
  } else {
    basePoints = isMediaScenario ? -50 : 0;
  }
  addScore(basePoints + bonus);

  setTimeout(function() {
    if (correctSlash) {
      showResult(true, '⚔️', 'AI FAKE DESTROYED!', sc.cutReward, basePoints, correctHighlights, bonus, sc);
    } else {
      showResult(false, '❌', 'WRONG — THIS WAS GENUINE!',
        'This was real content! You slashed a legitimate item!', basePoints, correctHighlights, 0, sc);
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
  // ─── Backend tracking ─────────────────────────────────────────
  // Every scenario passes through here (both verdict='safe' and the
  // slash flow), so this is the single place to record results.
  const verdictCorrect = !!success;
  const roundPoints    = basePoints + (correctHighlights * 30) + bonus;

  if (verdictCorrect) correctVerdictsCnt++;
  flagsFoundTotal += correctHighlights;
  flagsTotalTotal += sc.suspiciousCount || 0;

  questionResults.push({
    id: String(sc.id),
    verdict_correct: verdictCorrect,
    flags_found: correctHighlights,
    flags_total: sc.suspiciousCount || 0,
    points: roundPoints,
  });

  // Only text scenarios have suspicious segments — audio/video clips
  // have no segment-level red flags, so featureResults stays empty for
  // those (which is correct: there's nothing to highlight on a clip).
  if (sc.segments && sc.segments.length) {
    sc.segments.filter(s => s.sus).forEach(seg => {
      featureResults.push({
        scenario:   String(sc.id),
        segment:    seg.id,
        text:       (seg.text || '').slice(0, 255),
        identified: !!(highlighted[seg.id] && highlighted[seg.id].correct),
      });
    });
  }
  // ──────────────────────────────────────────────────────────────

  const overlay = document.getElementById('result-overlay');
  document.getElementById('res-icon').textContent = icon;

  var titleEl = document.getElementById('res-title');
  titleEl.textContent = title;
  titleEl.className = 'result-title ' + (success ? 'good' : 'bad');

  document.getElementById('res-msg').textContent = msg || '';

  var roundScore = basePoints + (correctHighlights * 30) + bonus;
  var gainEl = document.getElementById('res-score-gained');
  gainEl.textContent = (roundScore >= 0 ? '+' : '') + roundScore;
  gainEl.style.color = roundScore < 0 ? '#ff6b35' : '';
  document.getElementById('res-score-label').textContent  = roundScore >= 0 ? 'POINTS EARNED THIS ROUND' : 'POINTS LOST THIS ROUND';

  // Breakdown
  var breakdown = document.getElementById('res-breakdown');
  breakdown.innerHTML = '';
  if (sc && correctHighlights > 0) {
    addRow(breakdown, 'Red flags highlighted (' + correctHighlights + ' × 30)', '+' + (correctHighlights*30) + ' pts');
  }
  if (basePoints > 0) {
    var lbl = sc.verdict === 'safe' ? 'Genuine content — correct verdict' : 'AI fake cut — correct verdict';
    addRow(breakdown, lbl, '+' + basePoints + ' pts');
  } else if (basePoints < 0) {
    addRow(breakdown, 'Incorrect judgement', basePoints + ' pts');
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

    // Submit the AI game result to the backend
    if (window.BotBusters) {
      BotBusters.submitResult({
        game: 'ai',
        score:            totalScore,
        correct_verdicts: correctVerdictsCnt,
        total_scenarios:  SCENARIOS.length,
        flags_found:      flagsFoundTotal,
        flags_total:      flagsTotalTotal,
        questions:        questionResults,
        features:         featureResults,
      }).then(r => console.log('[BotBusters] AI result submitted:', r));
    } else {
      console.warn('[BotBusters] tracker not loaded — check script tag in aidetectorgame.html');
    }

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