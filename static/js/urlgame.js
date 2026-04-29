/* ============================================================
   URL Slayer — Game logic
   ============================================================ */

/* ═══════════════════════════════════════════════════
   URL DATA
═══════════════════════════════════════════════════ */
const URL_POOL = [
  // ─── SUSPICIOUS (9) ─────────────────────────────
  {
    id:'u1', display:'https://hsbc-secure-verify.com/login',
    verdict:'suspicious', icon:'🔒',
    parts:[
      {id:'u1a',text:'https://',   label:'Protocol', sus:false, reason:'HTTPS is present — but alone doesn\'t guarantee a site is legitimate. Attackers obtain HTTPS certificates for fake sites.'},
      {id:'u1b',text:'hsbc-secure-verify', label:'Domain', sus:true,  reason:'🚨 FAKE DOMAIN. HSBC\'s real domain is hsbc.com. Hyphens and extra words in a bank\'s domain name are a major phishing red flag.'},
      {id:'u1c',text:'.com',       label:'TLD',      sus:false, reason:'.com is HSBC\'s correct TLD — but the fraudulent domain above makes the entire URL fake.'},
      {id:'u1d',text:'/login',     label:'Path',     sus:false, reason:'Login paths appear on legitimate banking sites too. The problem is the fake domain, not the path.'},
    ],
    lesson:'Banks use their official domain only. hsbc-secure-verify.com has nothing to do with HSBC.',
  },
  {
    id:'u2', display:'http://arnazon.com/deals',
    verdict:'suspicious', icon:'🔓',
    parts:[
      {id:'u2a',text:'http://',    label:'Protocol', sus:true,  reason:'🚨 NO HTTPS. Amazon always uses HTTPS (encrypted). An HTTP shopping link is always suspicious — never enter payment details on HTTP pages.'},
      {id:'u2b',text:'arnazon',   label:'Domain',   sus:true,  reason:'🚨 TYPOSQUATTING. "arnazon" is NOT "amazon" — the letter m is replaced with rn, which looks nearly identical in most fonts. A classic lookalike attack.'},
      {id:'u2c',text:'.com',      label:'TLD',      sus:false, reason:'.com matches Amazon\'s real TLD — but the typo domain means this site has nothing to do with Amazon.'},
      {id:'u2d',text:'/deals',    label:'Path',     sus:false, reason:'"/deals" is bait to lure you in. Always verify the domain name first before anything else.'},
    ],
    lesson:'Typosquatting substitutes look-alike characters. "rn" can look just like "m". Read every character of a domain carefully.',
  },
  {
    id:'u3', display:'https://paypal.com-account-restore.net/verify',
    verdict:'suspicious', icon:'🔒',
    parts:[
      {id:'u3a',text:'https://',          label:'Protocol',  sus:false, reason:'HTTPS is present — but attackers also obtain HTTPS certificates. Encryption alone does not make a site safe.'},
      {id:'u3b',text:'paypal.',           label:'Subdomain', sus:true,  reason:'🚨 SUBDOMAIN TRICK. "paypal" here is just a subdomain — controlled by whoever owns the real domain. paypal.evil.com would also show "paypal" before the dot.'},
      {id:'u3c',text:'com-account-restore', label:'Domain',  sus:true,  reason:'🚨 FAKE DOMAIN. The real domain is "com-account-restore.net" — nothing to do with PayPal. Always read what comes just before the TLD.'},
      {id:'u3d',text:'.net',              label:'TLD',       sus:true,  reason:'🚨 WRONG TLD. PayPal uses .com, not .net. The wrong TLD confirms this site is fraudulent.'},
      {id:'u3e',text:'/verify',           label:'Path',      sus:false, reason:'The path looks plausible but the entire URL is fraudulent regardless of the path.'},
    ],
    lesson:'The real domain is immediately before the TLD. In this URL, "paypal" is just a subdomain — the attacker owns com-account-restore.net.',
  },
  {
    id:'u4', display:'bit.ly/3kx9mF2',
    verdict:'suspicious', icon:'🔗',
    parts:[
      {id:'u4a',text:'bit.ly',    label:'Shortener', sus:true, reason:'🚨 SHORTENED URL. URL shorteners completely hide the real destination. You have no idea where this leads — it could be malware or a phishing page.'},
      {id:'u4b',text:'/3kx9mF2', label:'Opaque Path',sus:true, reason:'🚨 OPAQUE CODE. A random-looking path on a shortened URL is intentional obfuscation. It reveals nothing about the real destination.'},
    ],
    lesson:'Always expand shortened URLs before clicking. Use a service like checkshorturl.com to reveal where a link really goes.',
  },
  {
    id:'u5', display:'https://instagram-support-help.com/verify',
    verdict:'suspicious', icon:'🔒',
    parts:[
      {id:'u5a',text:'https://',            label:'Protocol', sus:false, reason:'HTTPS is present — but doesn\'t mean the site is legitimate. Always check the domain.'},
      {id:'u5b',text:'instagram-support-help', label:'Domain', sus:true, reason:'🚨 FAKE DOMAIN. Instagram\'s real domain is instagram.com. Multiple hyphens in a major platform\'s domain name are a strong phishing indicator.'},
      {id:'u5c',text:'.com',                label:'TLD',     sus:false, reason:'.com matches Instagram\'s real TLD — but the fake domain above is the problem.'},
      {id:'u5d',text:'/verify',             label:'Path',    sus:false, reason:'Paths like /verify appear on legitimate sites too. The domain is what matters.'},
    ],
    lesson:'Major platforms use simple domain names. instagram-support-help.com has multiple hyphens — a classic phishing pattern.',
  },
  {
    id:'u6', display:'http://micros0ft.com/security-update',
    verdict:'suspicious', icon:'🔓',
    parts:[
      {id:'u6a',text:'http://',         label:'Protocol', sus:true, reason:'🚨 NO HTTPS. Microsoft\'s genuine sites always use HTTPS. An unencrypted connection from a major tech company is always suspicious.'},
      {id:'u6b',text:'micros0ft',       label:'Domain',   sus:true, reason:'🚨 HOMOGRAPH ATTACK. The letter "o" in Microsoft is replaced with the digit "0". Extremely hard to spot — read every character of a domain.'},
      {id:'u6c',text:'.com',            label:'TLD',      sus:false, reason:'.com is Microsoft\'s correct TLD — the problem is the character substitution in the domain name itself.'},
      {id:'u6d',text:'/security-update',label:'Path',     sus:false, reason:'The path creates urgency — a social engineering tactic. Always verify the domain before reacting to urgency cues.'},
    ],
    lesson:'Homograph attacks substitute similar characters: 0 for o, 1 for l, rn for m. Read every character of a domain carefully.',
  },
  {
    id:'u7', display:'https://amazon.com.checkout-verify.cc/payment',
    verdict:'suspicious', icon:'🔒',
    parts:[
      {id:'u7a',text:'https://',         label:'Protocol',  sus:false, reason:'HTTPS is present — but this site is still fraudulent. Encryption ≠ legitimacy.'},
      {id:'u7b',text:'amazon.com.',      label:'Subdomain', sus:true,  reason:'🚨 SUBDOMAIN TRICK. "amazon.com" here is just a subdomain — the real domain is "checkout-verify.cc". Amazon has nothing to do with this site.'},
      {id:'u7c',text:'checkout-verify', label:'Domain',    sus:true,  reason:'🚨 FAKE DOMAIN. The real domain is "checkout-verify.cc" — not Amazon. This is the critical part to read.'},
      {id:'u7d',text:'.cc',             label:'TLD',       sus:true,  reason:'🚨 UNUSUAL TLD. Amazon uses .com or country TLDs. ".cc" is the Cocos Islands TLD — commonly used by phishers to avoid detection.'},
      {id:'u7e',text:'/payment',        label:'Path',      sus:false, reason:'The path creates urgency around a payment — a social engineering tactic. The domain reveals the deception.'},
    ],
    lesson:'Always identify the real domain: just before the TLD. "amazon.com.checkout-verify.cc" — amazon.com is just a subdomain here.',
  },
  {
    id:'u8', display:'https://bankofamerica-secure.net/login',
    verdict:'suspicious', icon:'🔒',
    parts:[
      {id:'u8a',text:'https://',            label:'Protocol', sus:false, reason:'HTTPS is present — but does not make the site trustworthy on its own.'},
      {id:'u8b',text:'bankofamerica-secure',label:'Domain',   sus:true,  reason:'🚨 FAKE DOMAIN. Bank of America\'s real domain is bankofamerica.com. Appending "-secure" or "-verify" to a bank name via hyphen is a classic phishing pattern.'},
      {id:'u8c',text:'.net',                label:'TLD',      sus:true,  reason:'🚨 WRONG TLD. Bank of America uses .com, not .net. The wrong TLD combined with the fake domain confirms this is fraudulent.'},
      {id:'u8d',text:'/login',              label:'Path',     sus:false, reason:'Login paths appear on real banking sites too. The domain and TLD are what you should verify first.'},
    ],
    lesson:'Phishing sites copy real brands with hyphens and extra words. Always check both the domain name AND the TLD against the real brand.',
  },
  {
    id:'u9', display:'https://support.paypai.com/account',
    verdict:'suspicious', icon:'🔒',
    parts:[
      {id:'u9a',text:'https://',  label:'Protocol',  sus:false, reason:'HTTPS is present — even fraudulent sites obtain HTTPS certificates today.'},
      {id:'u9b',text:'support.', label:'Subdomain',  sus:false, reason:'"support" is a legitimate subdomain that real companies use. The problem is elsewhere in this URL.'},
      {id:'u9c',text:'paypai',   label:'Domain',     sus:true,  reason:'🚨 TYPOSQUATTING. "paypai" is not "paypal" — the letter l is replaced with i. Extremely easy to miss at a glance, especially on mobile.'},
      {id:'u9d',text:'.com',     label:'TLD',        sus:false, reason:'.com matches PayPal\'s real TLD — but the typo in the domain name makes this site fraudulent.'},
      {id:'u9e',text:'/account', label:'Path',       sus:false, reason:'The path looks legitimate — but the domain reveals the deception.'},
    ],
    lesson:'Typosquatting replaces one letter with a look-alike. "paypai" instead of "paypal" — l replaced with i. Spell-check every domain.',
  },
  // ─── SAFE (4) ───────────────────────────────────
  {
    id:'s1', display:'https://www.bbc.co.uk/news',
    verdict:'safe', icon:'🔒', parts:[],
    lesson:'BBC uses its official domain with HTTPS and the correct .co.uk TLD. All parts check out.',
  },
  {
    id:'s2', display:'https://accounts.google.com/signin',
    verdict:'safe', icon:'🔒', parts:[],
    lesson:'Google\'s accounts subdomain on their real domain (google.com) with HTTPS — entirely legitimate.',
  },
  {
    id:'s3', display:'https://www.amazon.co.uk/orders',
    verdict:'safe', icon:'🔒', parts:[],
    lesson:'Amazon UK uses their official domain with HTTPS and the correct .co.uk TLD.',
  },
  {
    id:'s4', display:'https://www.gov.uk/pay-tax',
    verdict:'safe', icon:'🔒', parts:[],
    lesson:'UK government services use the official .gov.uk TLD — this is a legitimate HMRC-related URL.',
  },
];

/* ═══════════════════════════════════════════════════
   GAME STATE
═══════════════════════════════════════════════════ */
let score         = 0;
let timeLeft      = 120;
let activeUrls    = [];   // {data, el, x, y, vx, vy, wobble, identified, wronglyFlagged}
let poolQueue     = [];   // shuffled URL_POOL
let spawnIdx      = 0;
let phase         = 'idle';
let suspiciousTotal = 0;
let suspiciousFound = 0;
let modalOpen     = false;
let currentTarget = null; // URL object being analysed
let analysisFlags = {};   // partId -> true if flagged
let analysisSubmitted = false;
let raf           = null;
let countdownInt  = null;
let spawnInt      = null;

// Score tracking for breakdown
let bdBase        = 0;  // from initial clicks (+10 each)
let bdAnalysis    = 0;  // from analysis parts
let bdBonus       = 0;  // +50 if all found in time
let bdMissed      = 0;  // -20 per missed
let bdWrong       = 0;  // -30 per wrong safe click

const stage = document.getElementById('game-stage');

/* ═══════════════════════════════════════════════════
   START GAME
═══════════════════════════════════════════════════ */
function startGame() {
  showScreen('screen-game');
  score = 0; timeLeft = 120; activeUrls = []; spawnIdx = 0;
  suspiciousFound = 0; modalOpen = false; analysisFlags = {};
  bdBase = 0; bdAnalysis = 0; bdBonus = 0; bdMissed = 0; bdWrong = 0;
  phase = 'playing';

  // Clear stage
  stage.innerHTML = '';
  document.getElementById('found-count').textContent = '0';
  updateScoreDisplay();
  updateTimer();

  // Shuffle pool
  poolQueue = [...URL_POOL].sort(() => Math.random() - 0.5);
  suspiciousTotal = poolQueue.filter(u => u.verdict === 'suspicious').length;

  // Spawn initial 3
  for (let i = 0; i < 3 && i < poolQueue.length; i++) spawnNext();

  // Countdown
  countdownInt = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft <= 0) endGame();
  }, 1000);

  // Spawn new URL every 10 seconds
  spawnInt = setInterval(() => {
    if (spawnIdx < poolQueue.length) spawnNext();
  }, 10000);

  // Animation loop
  raf = requestAnimationFrame(gameLoop);
}

/* ═══════════════════════════════════════════════════
   SPAWN
═══════════════════════════════════════════════════ */
function spawnNext() {
  if (spawnIdx >= poolQueue.length) return;
  const data = poolQueue[spawnIdx++];
  spawnPill(data);
}

function spawnPill(data) {
  const el = document.createElement('div');
  el.className = 'url-pill';
  el.innerHTML = `<span class="pill-icon">${data.icon}</span><span class="pill-text">${escHtml(data.display)}</span>`;

  // Temporarily add off-screen to measure width
  el.style.visibility = 'hidden';
  el.style.transform = 'translate(-9999px, -9999px)';
  stage.appendChild(el);

  const pw = el.offsetWidth;
  const ph = el.offsetHeight;
  const sw = stage.clientWidth;
  const sh = stage.clientHeight;

  // Random x within bounds, start above stage
  const x = Math.max(10, Math.random() * (sw - pw - 10));
  const y = -ph - 10;

  // Velocity: slow downward + slight horizontal drift
  const vx = (Math.random() - 0.5) * 1.4;
  const vy = 0.9 + Math.random() * 0.7;

  const urlObj = { data, el, x, y, vx, vy, wobble: Math.random() * Math.PI * 2, identified: false, wronglyFlagged: false, slashing: false };
  activeUrls.push(urlObj);

  el.style.visibility = 'visible';
  el.style.transform = `translate(${x}px, ${y}px)`;
  el.addEventListener('click', () => onPillClick(urlObj));
}

/* ═══════════════════════════════════════════════════
   GAME LOOP
═══════════════════════════════════════════════════ */
function gameLoop() {
  if (phase !== 'playing') return;

  const sw = stage.clientWidth;
  const sh = stage.clientHeight;

  activeUrls.forEach(u => {
    if (u.slashing || u.identified || u.wronglyFlagged) return;

    const pw = u.el.offsetWidth;
    const ph = u.el.offsetHeight;

    u.x += u.vx;
    u.y += u.vy;
    u.wobble += 0.018;

    // Bounce off walls
    if (u.x < 0)       { u.x = 0;       u.vx =  Math.abs(u.vx); }
    if (u.x + pw > sw) { u.x = sw - pw; u.vx = -Math.abs(u.vx); }
    if (u.y < 0)       { u.y = 0;       u.vy =  Math.abs(u.vy); }
    if (u.y + ph > sh) { u.y = sh - ph; u.vy = -Math.abs(u.vy); }

    u.el.style.transform = `translate(${u.x}px,${u.y}px) rotate(${Math.sin(u.wobble) * 1.8}deg)`;
  });

  raf = requestAnimationFrame(gameLoop);
}

/* ═══════════════════════════════════════════════════
   PILL CLICK
═══════════════════════════════════════════════════ */
function onPillClick(urlObj) {
  if (phase !== 'playing' || urlObj.identified || urlObj.wronglyFlagged || urlObj.slashing || modalOpen) return;

  if (urlObj.data.verdict === 'suspicious') {
    // Correct — open analysis modal
    addScore(10, urlObj.el);
    bdBase += 10;
    showAnalysis(urlObj);
  } else {
    // Wrong — penalise immediately
    addScore(-30, urlObj.el);
    bdWrong -= 30;
    urlObj.wronglyFlagged = true;
    urlObj.el.classList.add('wrong-flash');
    showToast('❌ That URL was safe! −30 pts', 'bad');
    setTimeout(() => {
      urlObj.el.classList.remove('wrong-flash');
      urlObj.el.classList.add('flagged-safe');
      urlObj.el.querySelector('.pill-text').style.textDecoration = 'line-through';
      urlObj.el.querySelector('.pill-text').style.color = 'rgba(255,100,100,0.5)';
      // Remove after 2s
      setTimeout(() => {
        urlObj.el.remove();
        activeUrls = activeUrls.filter(u => u !== urlObj);
      }, 2000);
    }, 400);
  }
}

/* ═══════════════════════════════════════════════════
   ANALYSIS MODAL
═══════════════════════════════════════════════════ */
function showAnalysis(urlObj) {
  modalOpen = true;
  currentTarget = urlObj;
  analysisFlags = {};
  analysisSubmitted = false;

  document.getElementById('analysis-url-display').textContent = urlObj.data.display;

  const partsRow = document.getElementById('parts-row');
  partsRow.innerHTML = '';

  urlObj.data.parts.forEach(part => {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:3px;';

    const btn = document.createElement('button');
    btn.className = 'part-btn';
    btn.id = 'part-btn-' + part.id;
    btn.textContent = part.text;
    btn.addEventListener('click', () => onPartBtnClick(part, btn));

    const lbl = document.createElement('div');
    lbl.className = 'part-label';
    lbl.textContent = part.label;

    wrap.appendChild(btn);
    wrap.appendChild(lbl);
    partsRow.appendChild(wrap);
  });

  document.getElementById('feedback-panel').classList.remove('show');
  document.getElementById('feedback-panel').innerHTML = '';
  document.getElementById('score-breakdown').style.display = 'none';

  const btns = document.getElementById('modal-btns');
  btns.innerHTML = '<button class="btn-submit" id="btn-submit" onclick="submitAnalysis()">SUBMIT ANALYSIS</button>';

  document.getElementById('analysis-modal').classList.add('show');
}

function onPartBtnClick(part, btn) {
  if (analysisSubmitted) return;
  if (analysisFlags[part.id]) {
    delete analysisFlags[part.id];
    btn.classList.remove('flagged');
  } else {
    analysisFlags[part.id] = true;
    btn.classList.add('flagged');
  }
}

function submitAnalysis() {
  if (analysisSubmitted || !currentTarget) return;
  analysisSubmitted = true;

  const urlObj = currentTarget;
  const parts = urlObj.data.parts;

  let correct = 0, wrong = 0, missed = 0;

  parts.forEach(part => {
    const btn = document.getElementById('part-btn-' + part.id);
    btn.classList.remove('flagged');

    if (part.sus && analysisFlags[part.id]) {
      // Correct flag
      btn.classList.add('reveal-correct');
      correct++;
    } else if (!part.sus && analysisFlags[part.id]) {
      // Wrong flag
      btn.classList.add('reveal-wrong');
      wrong++;
    } else if (part.sus && !analysisFlags[part.id]) {
      // Missed
      btn.classList.add('reveal-missed');
      missed++;
    }
  });

  const partScore = correct * 10 - wrong * 5 - missed * 5;
  bdAnalysis += partScore;
  addScore(partScore, null);

  // Build feedback
  const fp = document.getElementById('feedback-panel');
  fp.innerHTML = '';
  const flaggedParts = parts.filter(p => analysisFlags[p.id] || p.sus);
  const uniqueParts = [...new Set([...parts.filter(p=>p.sus), ...parts.filter(p=>analysisFlags[p.id])])];

  uniqueParts.forEach(part => {
    const div = document.createElement('div');
    div.className = 'part-reason';
    const flagged = !!analysisFlags[part.id];
    const nameEl = document.createElement('span');
    nameEl.className = 'part-reason-name' + (part.sus ? ' sus' : '');
    nameEl.textContent = part.sus
      ? (flagged ? `✅ ${part.label} — correctly flagged` : `⚠️ ${part.label} — you missed this`)
      : `🟢 ${part.label} — this was safe`;
    div.appendChild(nameEl);
    div.appendChild(document.createTextNode(part.reason));
    fp.appendChild(div);
  });
  fp.classList.add('show');

  // Breakdown
  const bd = document.getElementById('score-breakdown');
  bd.style.display = 'block';
  bd.innerHTML = `
    <div class="sbd-row"><span>✅ Correct parts flagged (${correct} × 10)</span><span>+${correct*10}</span></div>
    ${wrong>0?`<div class="sbd-row"><span>❌ Wrong parts flagged (${wrong} × −5)</span><span style="color:var(--red)">−${wrong*5}</span></div>`:''}
    ${missed>0?`<div class="sbd-row"><span>⚠️ Parts missed (${missed})</span><span style="color:var(--amber)">—${missed*5}</span></div>`:''}
    <div class="sbd-row"><span style="font-weight:bold;">Part analysis total</span><span>${partScore>=0?'+':''}${partScore}</span></div>
  `;

  // Replace button
  document.getElementById('modal-btns').innerHTML = `<button class="btn-eliminate" onclick="confirmEliminate()">⚔ ELIMINATE URL</button>`;
}

function confirmEliminate() {
  document.getElementById('analysis-modal').classList.remove('show');
  modalOpen = false;

  const urlObj = currentTarget;
  urlObj.slashing = true;
  urlObj.identified = true;
  suspiciousFound++;
  document.getElementById('found-count').textContent = suspiciousFound;

  slashPill(urlObj);

  // Check if all suspicious found
  if (suspiciousFound >= suspiciousTotal) {
    setTimeout(() => {
      // Bonus: found all before timer
      bdBonus = 50;
      addScore(50, null);
      showToast('⚡ ALL THREATS ELIMINATED! +50 BONUS!', 'good');
      setTimeout(endGame, 1200);
    }, 700);
  }
}

/* ═══════════════════════════════════════════════════
   SLASH ANIMATION
═══════════════════════════════════════════════════ */
function slashPill(urlObj) {
  const el = urlObj.el;
  el.classList.add('slashing');
  el.style.transition = 'box-shadow .1s';

  const rect = el.getBoundingClientRect();
  const stageRect = stage.getBoundingClientRect();

  // Particle burst from pill center
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  spawnParticles(cx, cy);

  // Slash line across the pill
  const line = document.createElement('div');
  line.className = 'slash-line-el';
  line.style.top = (rect.height / 2 - 1.5) + 'px';
  el.style.position = 'absolute';
  el.style.overflow = 'visible';
  el.appendChild(line);

  // Split halves
  const clipY = rect.height / 2;
  const mkHalf = (clipT, clipB, anim) => {
    const h = el.cloneNode(true);
    h.removeAttribute('id');
    h.style.cssText = `
      position: absolute;
      left: ${urlObj.x}px; top: ${urlObj.y}px;
      clip-path: polygon(0 ${clipT}px, 100% ${clipT}px, 100% ${clipB}px, 0 ${clipB}px);
      pointer-events: none; z-index: 30; border: none;
      animation: ${anim} .6s ease-in forwards;
      width: ${el.offsetWidth}px;
    `;
    stage.appendChild(h);
    setTimeout(() => h.remove(), 700);
  };

  setTimeout(() => {
    mkHalf(0, clipY, 'pillSplitTop .6s ease-in forwards');
    mkHalf(clipY, rect.height + 4, 'pillSplitBot .6s ease-in forwards');
    el.style.opacity = '0';
    setTimeout(() => {
      el.remove();
      activeUrls = activeUrls.filter(u => u !== urlObj);
    }, 650);
  }, 230);
}

/* ═══════════════════════════════════════════════════
   PARTICLES
═══════════════════════════════════════════════════ */
function spawnParticles(cx, cy) {
  for (let i = 0; i < 16; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const a = Math.random() * Math.PI * 2;
    const d = 25 + Math.random() * 70;
    const sz = 3 + Math.random() * 5;
    const col = Math.random() > 0.5 ? '#ff4d6d' : '#ff9f43';
    p.style.cssText = `
      width:${sz}px; height:${sz}px;
      left:${cx}px; top:${cy}px;
      background:${col};
      --dx:${Math.cos(a)*d}px; --dy:${Math.sin(a)*d}px;
      animation-delay:${Math.random()*0.08}s;
    `;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 800);
  }
}

/* ═══════════════════════════════════════════════════
   TIMER & SCORE
═══════════════════════════════════════════════════ */
function updateTimer() {
  const m = Math.floor(timeLeft / 60);
  const s = timeLeft % 60;
  const el = document.getElementById('timer-val');
  el.textContent = `${m}:${s.toString().padStart(2,'0')}`;
  el.className = timeLeft <= 10 ? 'hud-value red' : timeLeft <= 30 ? 'hud-value amber' : 'hud-value';
}

function addScore(delta, anchorEl) {
  score = Math.max(0, score + delta);
  updateScoreDisplay(delta > 0);
  if (anchorEl) {
    const r = anchorEl.getBoundingClientRect();
    showScorePop(delta, r.left + r.width / 2, r.top);
  }
}

function updateScoreDisplay(positive = true) {
  const el = document.getElementById('hud-score');
  el.textContent = score;
  el.style.transform = 'scale(1.2)';
  el.style.color = positive ? '#a0ddd5' : '#ff8a80';
  setTimeout(() => { el.style.transform = 'scale(1)'; el.style.color = 'var(--green)'; }, 280);
}

function showScorePop(delta, x, y) {
  const p = document.createElement('div');
  p.className = 'score-pop';
  p.style.cssText = `left:${x-24}px; top:${y-10}px; color:${delta>=0?'#80e5d5':'#ff8a80'}`;
  p.textContent = delta >= 0 ? `+${delta}` : delta;
  document.body.appendChild(p);
  setTimeout(() => p.remove(), 1100);
}

function showToast(msg, type) {
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 950);
}

/* ═══════════════════════════════════════════════════
   END GAME
═══════════════════════════════════════════════════ */
function endGame() {
  if (phase !== 'playing') return;
  phase = 'ended';

  clearInterval(countdownInt);
  clearInterval(spawnInt);
  cancelAnimationFrame(raf);
  document.getElementById('analysis-modal').classList.remove('show');
  modalOpen = false;

  // Penalise missed suspicious URLs
  const missed = activeUrls.filter(u => u.data.verdict === 'suspicious' && !u.identified);
  const missedPenalty = missed.length * -20;
  bdMissed = missedPenalty;
  score = Math.max(0, score + missedPenalty);

  // Brief highlight missed pills in amber
  missed.forEach(u => {
    u.el.style.borderColor = 'var(--amber)';
    u.el.style.boxShadow = '0 0 20px rgba(255,193,7,0.5)';
  });

  setTimeout(() => showGameOver(), 1200);
}

function showGameOver() {
  const pct = Math.round((score / Math.max(1, suspiciousTotal * 10 + suspiciousTotal * 10 + 50)) * 100);
  const grade = score >= 120 ? 'S RANK 🌟' : score >= 90 ? 'A RANK ✅' : score >= 60 ? 'B RANK 👍' : score >= 30 ? 'C RANK ⚠️' : 'D RANK — Keep Practising';

  document.getElementById('go-score').textContent = score;
  document.getElementById('go-grade').textContent = grade;
  document.getElementById('go-grade').style.color = score >= 90 ? 'var(--green)' : score >= 60 ? 'var(--amber)' : 'var(--red)';

  const rows = document.getElementById('go-bd-rows');
  rows.innerHTML = '';
  const addRow = (label, val, penalty) => {
    const d = document.createElement('div');
    d.className = 'go-bd-row' + (penalty ? ' penalty' : '');
    d.innerHTML = `<span>${label}</span><span>${val >= 0 ? '+' : ''}${val}</span>`;
    rows.appendChild(d);
  };
  
  if (bdBase)     addRow(`✅ Threats correctly identified (${suspiciousFound} × 10)`, bdBase, false);
  if (bdAnalysis) addRow('🔍 Analysis part scores', bdAnalysis, bdAnalysis < 0);
  if (bdBonus)    addRow('⚡ All threats found in time (bonus)', bdBonus, false);
  if (bdWrong)    addRow('❌ Safe URLs incorrectly flagged', bdWrong, true);
  if (bdMissed)   addRow(`⏱ Missed threats (${Math.abs(bdMissed)/20} × −20)`, bdMissed, true);

  const total = document.createElement('div');
  total.className = 'go-bd-row';
  total.innerHTML = `<span>TOTAL</span><span>${score} pts</span>`;
  rows.appendChild(total);

  showScreen('screen-gameover');

  // ADDED: Submit the URL game score to the backend
  if (window.BotBusters) {
    BotBusters.submitResult({
      game: 'url',
      score: score,
      total_scenarios: suspiciousTotal
    }).then(r => console.log('[BotBusters] URL result submitted:', r));
  } else {
    console.warn('[BotBusters] tracker not loaded — check script tag in urlgame.html');
  }
}

function restartGame() {
  // Clear all active pills
  activeUrls.forEach(u => u.el.remove());
  activeUrls = [];
  startGame();
}

/* ═══════════════════════════════════════════════════
   SCREEN MANAGEMENT
═══════════════════════════════════════════════════ */
function showScreen(id) {
  ['screen-intro','screen-game','screen-gameover'].forEach(s => {
    document.getElementById(s).className = 'screen ' + (s === id ? 'visible' : 'hidden');
  });
}

/* ═══════════════════════════════════════════════════
   UTILS
═══════════════════════════════════════════════════ */
function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}