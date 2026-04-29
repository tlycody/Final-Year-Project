/* Phishing Ninja - Game logic */

/* ─── EMAIL DATA ──────────────────────────────────────────── */
const EMAILS = [

  // ── 1. HSBC Bank ── PHISHING ────────────────────────────────
  {
    id: 1,
    from: "security@hsbc-verify-account.com",
    senderName: "HSBC Security",
    date: "13 May, 09:14",
    isSpam: false,
    fromSuspicious: true,
    subject: "URGENT: Suspicious Activity Detected on Your Account",
    segments: [
      { id:"s1",  text:"Dear Valued Customer,",                         sus: false },
      { id:"s2",  text:"\n\n",                                          sus: false },
      { id:"s3",  text:"We have detected ",                             sus: false },
      { id:"s4",  text:"unusual activity on your account",              sus: true,  reason:"Vague threat language — designed to trigger panic without any specific or verifiable detail, pressuring you to act immediately." },
      { id:"s5",  text:". Multiple failed login attempts have been recorded from ",  sus: false },
      { id:"s6",  text:"an unknown device in Egypt",                  sus: true,  reason:"Naming a specific foreign country is a social engineering tactic to amplify fear. Legitimate security alerts describe the device type, not a dramatic location." },
      { id:"s7",  text:". Your account will be ",                       sus: false },
      { id:"s8",  text:"suspended within 24 hours",                     sus: true,  reason:"Artificial urgency. Legitimate banks never issue 24-hour suspension threats via unsolicited email." },
      { id:"s9",  text:" unless you verify your identity immediately by clicking the link below:\n\n", sus: false },
      { id:"s10", text:"[Verify My Account Now]",                       sus: true,  reason:"No real URL is shown. Genuine bank emails always display the full destination link — a hidden button is a classic phishing tactic." },
      { id:"s11", text:"\n\nIf you do not complete verification, your account will be ", sus: false },
      { id:"s12", text:"permanently closed and all funds frozen",        sus: true,  reason:"Threatening to freeze funds is extreme pressure designed to override rational thinking. HSBC would never issue this ultimatum by email." },
      { id:"s13", text:".\n\nHSBC Security Team",                       sus: false },
    ],
    verdict: "phishing",
    suspiciousCount: 5,
    cutReward: "Phishing email destroyed! You protected your banking credentials. 🛡️",
  },

  // ── 2. Instagram Login Alert ── PHISHING ─────────────────────
  {
    id: 2,
    from: "security@instagram-account-verify.net",
    senderName: "Instagram",
    date: "26 March, 11:32",
    isSpam: true,
    fromSuspicious: true,
    subject: "Action Required: Suspicious Login Detected on Your Account",
    segments: [
      { id:"i1",  text:"Hi [username],",                                sus: false },
      { id:"i2",  text:"\n\n",                                          sus: false },
      { id:"i3",  text:"Someone tried to log in to your Instagram account from an unrecognised device in ",  sus: false },
      { id:"i4",  text:"Lagos, Nigeria",                                sus: true,  reason:"Naming a specific foreign location is a manipulation tactic to create fear. Legitimate Instagram login alerts describe the device type and browser — not a dramatic country." },
      { id:"i5",  text:". Your account will be ",                       sus: false },
      { id:"i6",  text:"temporarily disabled within 2 hours",           sus: true,  reason:"Artificial 2-hour countdown — Instagram never disables accounts on a tight email deadline. This pressure is designed to stop you thinking clearly." },
      { id:"i7",  text:" unless you verify your identity immediately.\n\nClick the link below to secure your account:\n\n", sus: false },
      { id:"i8",  text:"http://instagram-security-verify.net/login/confirm", sus: true, reason:"Fake domain. Instagram only ever sends links from instagram.com — 'instagram-security-verify.net' is a fraudulent site built to steal your credentials." },
      { id:"i9",  text:"\n\nYou will be asked to enter your ",          sus: false },
      { id:"i10", text:"username, password, and phone number",          sus: true,  reason:"Instagram never asks for your password by email. Requesting all three credentials at once is a credential-harvesting attack." },
      { id:"i11", text:" to complete verification.\n\nThe Instagram Team", sus: false },
    ],
    verdict: "phishing",
    suspiciousCount: 4,
    cutReward: "Fake Instagram alert destroyed! Your account credentials are safe. 📱",
  },

  // ── 3. Amazon Music Promotion ── SAFE ────────────────────────
  {
    id: 3,
    from: "no-reply@amazonmusic.com",
    senderName: "Amazon Music",
    date: "18 June, 08:47",
    isSpam: false,
    fromSuspicious: false,
    subject: "[Name], want £5 off your next Amazon purchase?",
    segments: [
      { id:"a1",  text:"Hi [Name],",                                    sus: false },
      { id:"a2",  text:"\n\n",                                          sus: false },
      { id:"a3",  text:"Get £5 off your next qualifying Amazon purchase of £20 by listening to music in the Amazon Music app. As a Prime member, you have access to all the music you love.\n\n", sus: false },
      { id:"a4",  text:"Here is how it works:\n\n",                     sus: false },
      { id:"a5",  text:"1. Listen to music: Open the Amazon Music app and listen to at least 1 song by 23:59 on 23 March 2026.\n", sus: false },
      { id:"a6",  text:"2. Receive your reward: You will receive your £5 promo code within 7 business days via email from Amazon Music.\n", sus: false },
      { id:"a7",  text:"3. Use your reward: Apply your code to a qualifying purchase of £20 or more at Amazon.co.uk within 30 days.\n\n", sus: false },
      { id:"a8",  text:"Terms and Conditions apply. View the full terms below.\n\nAmazon Music Team", sus: false },
    ],
    verdict: "safe",
    suspiciousCount: 0,
    cutReward: "",
  },

  // ── 4. Google Storage Warning ── PHISHING ────────────────────
  {
    id: 4,
    from: "storage-alert@google-accounts-support.com",
    senderName: "Google Account",
    date: "17 January, 14:05",
    isSpam: true,
    fromSuspicious: true,
    subject: "Your Google Account Storage is Almost Full — Action Required",
    segments: [
      { id:"gs1", text:"Dear Google Account User,",                     sus: false },
      { id:"gs2", text:"\n\n",                                          sus: false },
      { id:"gs3", text:"Your Google Account storage is currently at ",  sus: false },
      { id:"gs4", text:"4.8 GB out of 5 GB (96% full)",                 sus: true,  reason:"Fabricated specific figures designed to feel personally relevant. Real Google storage warnings are shown inside your account — not pushed as alarming email statistics." },
      { id:"gs5", text:". When your storage is full, you will no longer be able to send or receive Gmail, upload to Google Photos, or save files in Drive.\n\n", sus: false },
      { id:"gs6", text:"Your account and all associated files will be permanently deleted on 15 March 2026", sus: true,  reason:"Google never sets arbitrary account deletion deadlines via email. This is a fear tactic — real storage notices give you weeks of notice with no sudden deletion threat." },
      { id:"gs7", text:" unless storage is upgraded immediately.\n\nTo continue without interruption, upgrade your storage plan now:\n\n", sus: false },
      { id:"gs8", text:"http://google-storage-upgrade.accounts-verify.net/upgrade", sus: true, reason:"Fake domain. All genuine Google links use google.com — 'accounts-verify.net' is a fraudulent page designed to steal your Google login credentials." },
      { id:"gs9", text:"\n\nThis action must be completed before the deadline to avoid permanent data loss.\n\nGoogle Account Team", sus: false },
    ],
    verdict: "phishing",
    suspiciousCount: 3,
    cutReward: "Fake Google alert destroyed! Your account and files are safe. ☁️",
  },

  // ── 5. Disney+ Prize ── PHISHING ─────────────────────────────
  {
  id: 5,
  from: "info8m3wkol7.8m3wkol7@mail.itunisk7zrmrstk.fr",
  senderName: "Disney+",
  date: "17 April, 22:11",
  isSpam: true,
  fromSuspicious: true,
  subject: "Congratulations! Your Disney+ Loyalty Reward is Ready to Claim",
  segments: [
    { id:"d1",  text:"Dear Disney+ Member,",                          sus: false },
    { id:"d2",  text:"\n\n",                                          sus: false },
    { id:"d3",  text:"Congratulations! As a valued subscriber, you have been ",   sus: false },
    { id:"d4",  text:"randomly selected as this month's loyalty reward winner",   sus: true,  reason:"Unsolicited prize notifications are a hallmark of phishing. Legitimate companies do not randomly select winners and notify them by email without any prior programme entry." },
    { id:"d5",  text:".\n\nYour prize: ",                             sus: false },
    { id:"d6",  text:"a Lenovo IdeaPad Tablet with Keyboard (worth £349.99)",     sus: true,  reason:"Offering a high-value hardware prize out of nowhere is a classic lure tactic. Streaming services do not give away physical devices as surprise email rewards." },
    { id:"d7",  text:" has been reserved under your account.\n\n",    sus: false },
    { id:"d8",  text:"Winning Reference: #8392-LNV-DSNY",             sus: true,  reason:"Fake reference numbers are used to manufacture a sense of legitimacy and officialdom. Scammers fabricate codes like this to make the email feel authentic and trick recipients into trusting the message." },
    { id:"d9",  text:"\n\n",                                          sus: false },
    { id:"d10", text:"To claim, please confirm your shipping address and pay a small handling and delivery fee of £2.99", sus: true,  reason:"This sentence combines two major red flags: a request for personal information (your address) and an advance fee to release a prize. Genuine prizes never require payment to claim — this is classic advance-fee fraud designed to harvest your card details." },
    { id:"d11", text:":\n\n",                                         sus: false },
    { id:"d12", text:"http://disneyplus-loyalty-rewards.claim-prize.net/verify",  sus: true,  reason:"Fake domain. Disney+ only communicates via disneyplus.com — 'claim-prize.net' is a fraudulent payment page." },
    { id:"d13", text:"\n\nClaim within 24 hours or your prize will be reassigned.\n\nDisney+ Rewards Team", sus: false },
  ],
  verdict: "phishing",
  suspiciousCount: 5,
  cutReward: "Prize scam destroyed! Legitimate prizes never require a fee to claim. 🏆",
},

  // ── 6. Grant Thornton Work Experience ── SAFE (harder) ───────
  {
    id: 6,
    from: "ukgrantt@myworkday.com",
    senderName: "Ravi Kim",
    date: "15 Mar, 17:45",
    isSpam: false,
    fromSuspicious: false,
    subject: "Grant Thornton Work Experience — Offer Confirmation",
    segments: [
      { id:"gt1", text:"Hi,",                                           sus: false },
      { id:"gt2", text:"\n\n",                                          sus: false },
      { id:"gt3", text:"Thank you for taking the time to complete our application process. We hope you enjoyed the experience!\n\n", sus: false },
      { id:"gt4", text:"Congratulations! You have successfully secured a place on our Work Experience programme.", sus: false },
      { id:"gt5", text:" Further details will be sent to you in the coming weeks.\n\n", sus: false },
      { id:"gt6", text:"If you have any questions, please reply to ",    sus: false },
      { id:"gt7", text:"traineerecruitment@uk.gt.com",                  sus: false },
      { id:"gt8",text:" with your query.\n\nKind regards,\nThe Trainee Recruitment Team\nGrant Thornton UK LLP", sus: false },
    ],
    verdict: "safe",
    suspiciousCount: 0,
    cutReward: "",
  },

  // ── 7. University of Exeter IT ── PHISHING ───────────────────
  {
    id: 7,
    from: "it-support@universty-exeter.helpdesk.net",
    senderName: "IT Support",
    date: "Today, 07:58",
    isSpam: false,
    fromSuspicious: true,
    subject: "Password Expiry Notice — Action Required",
    segments: [
      { id:"u1",  text:"Dear Student,",                                 sus: false },
      { id:"u2",  text:"\n\n",                                          sus: false },
      { id:"u3",  text:"This is a message from ",                       sus: false },
      { id:"u4",  text:"universty-exeter.helpdesk.net",                 sus: true,  reason:"Typosquatting — 'universty' is deliberately misspelled, and the genuine Exeter domain is exeter.ac.uk, not a commercial .net address." },
      { id:"u5",  text:". Your university password ",                   sus: false },
      { id:"u6",  text:"expires today at midnight",                     sus: true,  reason:"Fabricated deadline designed to trigger a panicked, rushed response without time to verify the request — a textbook social engineering technique." },
      { id:"u7",  text:".\n\nTo avoid losing access, please ",          sus: false },
      { id:"u8",  text:"reply to this email with your current password", sus: true,  reason:"IT departments never ask for your password via email. A legitimate password reset never requires you to share your existing password." },
      { id:"u9",  text:" so our team can process the reset.\n\nFailure to comply will result in ", sus: false },
      { id:"u10", text:"immediate account suspension and loss of ELE access", sus: true, reason:"Targeting the ELE (VLE) is deliberate — threatening to remove coursework access during term time is fear-based manipulation aimed specifically at students." },
      { id:"u11", text:".\n\nIT Support Team\nUniversity of Exeter",    sus: false },
    ],
    verdict: "phishing",
    suspiciousCount: 4,
    cutReward: "Fake IT email destroyed! Your university account is safe. 🎓",
  },

];

/* ─── STATE ───────────────────────────────────────────────── */

let emailIndex   = 0;
let totalScore        = 0;
let correctVerdictsCount = 0;
let flagsFoundTotal      = 0;
let flagsTotalTotal      = 0;
let questionResults      = [];
let featureResults       = [];
let highlighted  = {};   // id → { correct: bool }
let wrongHighlights = 0;
let gamePhase    = "reading";  // reading | slashing | done
let floatAnim    = null;
let emailReady   = false;

/* Breakdown accumulators (reset in restartGame) */
let bdPhishingCaught   = 0;   // phishing emails correctly slashed
let bdSafeIdentified   = 0;   // safe emails correctly identified
let bdWrongVerdicts    = 0;   // wrong verdicts (no points either way)
let bdFlagsCorrect     = 0;   // total correct red flags found across all emails
let bdFlagsBonusCount  = 0;   // number of "all flags found" bonuses earned
let bdWrongFlagsTotal  = 0;   // total wrong highlights across all emails

/* ─── BOOT ────────────────────────────────────────────────── */
function startGame() {
  show("screen-game");
  loadEmail(0);
}

function restartGame() {
  emailIndex = 0; totalScore = 0;
  correctVerdictsCount = 0;
  flagsFoundTotal = 0;
  flagsTotalTotal = 0;
  questionResults = [];
  featureResults  = [];
  highlighted = {}; wrongHighlights = 0;
  bdPhishingCaught = 0;
  bdSafeIdentified = 0;
  bdWrongVerdicts  = 0;
  bdFlagsCorrect   = 0;
  bdFlagsBonusCount = 0;
  bdWrongFlagsTotal = 0;
  gamePhase = "reading";
  show("screen-game");
  loadEmail(0);
}

function show(id) {
  ["screen-intro","screen-game","screen-gameover"].forEach(s => {
    const el = document.getElementById(s);
    el.classList.remove("visible","hidden");
    el.classList.add(s === id ? "visible" : "hidden");
  });
}

/* ─── LOAD EMAIL ──────────────────────────────────────────── */
function loadEmail(idx) {
  const email = EMAILS[idx];
  highlighted = {}; wrongHighlights = 0;
  gamePhase = "reading";
  emailReady = false;

  document.getElementById("hud-progress").textContent = (idx+1) + " / " + EMAILS.length;
  document.getElementById("hud-score").textContent = totalScore;
  document.getElementById("ticker").textContent = "👆 CLICK SUSPICIOUS TEXT TO HIGHLIGHT · THEN DELIVER YOUR VERDICT";

  hideFeedback();
  document.getElementById("action-bar").style.display = "flex";
  document.getElementById("slash-hint").style.display = "none";

  // Subject bar
  const subjectBar = document.getElementById("email-subject-bar");
  const spamBadge = email.isSpam ? `<span class="email-label-spam">Spam ×</span>` : "";
  subjectBar.innerHTML = `<div class="email-subject-text">${escHtml(email.subject)}${spamBadge}</div>`;

  // Sender avatar colour — deterministic from first char
  const avatarColors = ["#1a73e8","#e53935","#43a047","#fb8c00","#8e24aa","#00897b","#c62828","#5e35b1"];
  const initial = (email.senderName || email.from).charAt(0).toUpperCase();
  const colorIdx = initial.charCodeAt(0) % avatarColors.length;
  const avatarBg  = avatarColors[colorIdx];

  const fromCls = email.fromSuspicious ? "sender-email suspicious" : "sender-email";

  // Header
  const header = document.getElementById("email-header");
  header.innerHTML = `
    <div class="sender-avatar" style="background:${avatarBg}">${escHtml(initial)}</div>
    <div class="sender-info">
      <div class="sender-name-row">
        <span class="sender-name">${escHtml(email.senderName || email.from)}</span>
        <span class="${fromCls}">&lt;${escHtml(email.from)}&gt;</span>
      </div>
      <div class="sender-to">to me</div>
    </div>
    <div class="sender-date">${escHtml(email.date || "")}</div>`;

  // Body segments — attach click to ALL segments
  const body = document.getElementById("email-body");
  body.innerHTML = "";
  email.segments.forEach(seg => {
    if (seg.text === "\n\n") { body.appendChild(document.createElement("br")); return; }
    const span = document.createElement("span");
    span.className = "seg clickable";
    span.id = "seg-" + seg.id;
    span.textContent = seg.text;
    span.addEventListener("click", (e) => {
      e.stopPropagation();
      onSegmentClick(seg, span);
    });
    body.appendChild(span);
  });

  // Card setup
  const card = document.getElementById("email-card");
  card.classList.remove("slash-mode");
  card.onclick = null;
  document.getElementById("slash-canvas").innerHTML = "";
  document.getElementById("flash-overlay").style.opacity = "0";
  card.style.opacity = "1";
  card.style.transform = "translateX(-50%)";

  // Animate up from bottom
  animateEmailIn();
}

/* ─── EMAIL SLIDE-IN ANIMATION ────────────────────────────── */
function animateEmailIn() {
  const stage = document.getElementById("email-stage");
  const card  = document.getElementById("email-card");

  const stageH = stage.offsetHeight;
  // Always land at top with small margin so player can see full email by scrolling
  const endTop = 8;

  // Place card fully below the stage using pixels
  card.style.transition = "none";
  card.style.top = (stageH + 60) + "px";

  // setTimeout guarantees browser has painted start position before transition
  setTimeout(() => {
    card.style.transition = "top 3.8s cubic-bezier(0.22, 0.61, 0.36, 1)";
    card.style.top = endTop + "px";
  }, 60);
}

/* ─── SEGMENT CLICK ───────────────────────────────────────── */
function onSegmentClick(seg, span) {
  if (gamePhase !== "reading") return;
  if (highlighted[seg.id]) return;   // already clicked — lock it, do nothing

  if (seg.sus) {
    highlighted[seg.id] = { correct: true };
    span.classList.add("hit-correct");
    addScore(30);
    showScorePopup("+30", span);
    showFeedback(true, "🚨 Red Flag Spotted!", seg.reason);
  } else {
    // Wrong highlight — penalise
    highlighted[seg.id] = { correct: false };
    span.classList.add("hit-wrong");
    wrongHighlights++;
    addScore(-10);
    showScorePopup("−10", span, "#ff4d6d");
    showFeedback(false, "ℹ️ That looks legitimate.", "Keep looking — there " + (EMAILS[emailIndex].suspiciousCount === 1 ? "is 1 suspicious element" : "are " + EMAILS[emailIndex].suspiciousCount + " suspicious elements") + " in this email.");
  }
}

/* ─── VERDICT SELECTION ───────────────────────────────────── */
function selectVerdict(verdict) {
  if (gamePhase !== "reading") return;
  const email = EMAILS[emailIndex];

  if (verdict === email.verdict) {
    if (verdict === "phishing") {
      // Enter slash mode
      gamePhase = "slashing";
      hideFeedback();
      document.getElementById("action-bar").style.display = "none";
      document.getElementById("slash-hint").style.display = "block";
      document.getElementById("ticker").textContent = "⚔ SLASH MODE ACTIVE — CLICK THE EMAIL TO DESTROY IT";

      const card = document.getElementById("email-card");
      card.classList.add("slash-mode");
      card.onclick = onSlashEmail;
    } else {
      // Safe — correct
      gamePhase = "done";
      addScore(50);
      bdSafeIdentified++;
      bdWrongFlagsTotal += wrongHighlights;
      showResult(true, "🛡️", "CORRECT — EMAIL IS SAFE", "You correctly identified this as a legitimate email. No threats found.", 50);
    }
  } else {
    // Wrong verdict
    gamePhase = "done";
    bdWrongVerdicts++;
    bdWrongFlagsTotal += wrongHighlights;
    const msg = verdict === "phishing"
      ? "This was actually a legitimate email! Cutting a safe email undermines trust. Stay precise."
      : "This was a phishing email — you should have cut it! Look for the red flags next time.";
    showResult(false, "💀", "WRONG VERDICT", msg, 0);
  }
}

/* ─── SLASH EMAIL ─────────────────────────────────────────── */
function onSlashEmail(e) {
  if (gamePhase !== "slashing") return;
  gamePhase = "done";

  const card   = document.getElementById("email-card");
  const rect   = card.getBoundingClientRect();
  const slashY = e.clientY - rect.top;

  card.onclick = null;
  card.classList.remove("slash-mode");
  document.getElementById("slash-hint").style.display = "none";

  // Draw slash line
  const canvas = document.getElementById("slash-canvas");
  const line = document.createElement("div");
  line.className = "slash-line";
  line.style.top = (slashY - 2) + "px";
  canvas.appendChild(line);

  // Flash
  const flash = document.getElementById("flash-overlay");
  flash.style.animation = "none";
  flash.offsetHeight; // reflow
  flash.style.opacity = "0.7";
  flash.style.animation = "flashIn 0.5s ease-out forwards";

  // Particles
  spawnParticles(e.clientX, e.clientY);

  // Split email
  setTimeout(() => {
    splitEmailCard(slashY);
  }, 260);

  // Score & result
  addScore(10);
  const email = EMAILS[emailIndex];
  const correctHighlights = Object.values(highlighted).filter(h => h.correct).length;
  const allFound = correctHighlights === email.suspiciousCount;
  let bonus = 0;
  if (allFound && email.suspiciousCount > 0) {
    bonus = 50;
    addScore(50);
    bdFlagsBonusCount++;
  }

  // Track end-of-game breakdown stats
  bdPhishingCaught++;
  bdFlagsCorrect    += correctHighlights;
  bdWrongFlagsTotal += wrongHighlights;

  setTimeout(() => {
    showResult(true, "⚔️", "THREAT ELIMINATED!", email.cutReward, 10, correctHighlights, bonus, email);
  }, 900);
}

/* ─── SPLIT ANIMATION ─────────────────────────────────────── */
function splitEmailCard(slashY) {
  const card    = document.getElementById("email-card");
  const stage   = document.getElementById("email-stage");
  const cardTop = parseFloat(card.style.top) || 0;

  // Clone card for top half
  const topHalf = card.cloneNode(true);
  topHalf.style.cssText = "";
  topHalf.style.position = "absolute";
  topHalf.style.left = card.offsetLeft + "px";
  topHalf.style.top = cardTop + "px";
  topHalf.style.width = card.offsetWidth + "px";
  topHalf.style.clipPath = `polygon(0 0, 100% 0, 100% ${slashY}px, 0 ${slashY}px)`;
  topHalf.style.pointerEvents = "none";
  topHalf.style.zIndex = "30";
  topHalf.style.animation = "splitTop 0.6s ease-in forwards";

  // Clone for bottom half
  const botHalf = card.cloneNode(true);
  botHalf.style.cssText = "";
  botHalf.style.position = "absolute";
  botHalf.style.left = card.offsetLeft + "px";
  botHalf.style.top = cardTop + "px";
  botHalf.style.width = card.offsetWidth + "px";
  botHalf.style.clipPath = `polygon(0 ${slashY}px, 100% ${slashY}px, 100% 100%, 0 100%)`;
  botHalf.style.pointerEvents = "none";
  botHalf.style.zIndex = "29";
  botHalf.style.animation = "splitBottom 0.6s ease-in forwards";

  card.style.opacity = "0";
  stage.appendChild(topHalf);
  stage.appendChild(botHalf);

  // Clean up halves after animation
  setTimeout(() => {
    topHalf.remove();
    botHalf.remove();
  }, 700);
}

/* ─── PARTICLES ───────────────────────────────────────────── */
function spawnParticles(cx, cy) {
  for (let i = 0; i < 18; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    const angle = (Math.random() * Math.PI * 2);
    const dist  = 30 + Math.random() * 80;
    const dx    = Math.cos(angle) * dist;
    const dy    = Math.sin(angle) * dist;
    const hue   = Math.random() > 0.5 ? "#ff4d6d" : "#ff9f43";
    p.style.cssText = `
      left: ${cx}px; top: ${cy}px;
      background: ${hue};
      position: fixed;
      --dx: ${dx}px; --dy: ${dy}px;
      animation: particleFly 0.7s ease-out forwards;
      animation-delay: ${Math.random()*0.1}s;
      width: ${3+Math.random()*5}px;
      height: ${3+Math.random()*5}px;
    `;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 900);
  }
}

/* ─── SHOW RESULT ─────────────────────────────────────────── */
  function showResult(success, icon, title, msg, basePoints, correctHighlights=0, bonus=0, email=null) {
  // ─── NEW: record this email's result for backend submission ───
  const currentEmail   = email || EMAILS[emailIndex];
  const verdictCorrect = success;
  const correctHL      = correctHighlights;
  const roundPoints    = basePoints + (correctHL * 30) + bonus;

  if (verdictCorrect) correctVerdictsCount++;
  flagsFoundTotal += correctHL;
  flagsTotalTotal += currentEmail.suspiciousCount;

  questionResults.push({
    id: String(currentEmail.id),
    verdict_correct: verdictCorrect,
    flags_found: correctHL,
    flags_total: currentEmail.suspiciousCount,
    points: roundPoints,
  });

  currentEmail.segments.filter(s => s.sus).forEach(seg => {
    featureResults.push({
      scenario:   String(currentEmail.id),
      segment:    seg.id,
      text:       seg.text,
      identified: !!(highlighted[seg.id] && highlighted[seg.id].correct),
    });
  });
  const overlay = document.getElementById("result-overlay");
  document.getElementById("res-icon").textContent = icon;

  const titleEl = document.getElementById("res-title");
  titleEl.textContent = title;
  titleEl.className = "result-title " + (success ? "good" : "bad");

  document.getElementById("res-msg").textContent = msg;

  // Score gained this round
  const roundScore = basePoints + (correctHighlights * 30) + bonus;
  document.getElementById("res-score-gained").textContent = "+" + roundScore;
  document.getElementById("res-score-label").textContent = "POINTS EARNED THIS ROUND";

  // Breakdown
  const breakdown = document.getElementById("res-breakdown");
  breakdown.innerHTML = "";
  if (email && correctHighlights > 0) {
    addRow(breakdown, `Red flags highlighted (${correctHighlights} × 30)`, "+" + (correctHighlights*30) + " pts");
  }
  if (basePoints > 0) {
    const lbl = basePoints === 50 ? "Safe email — correct verdict" : "Phishing cut — correct verdict";
    addRow(breakdown, lbl, "+" + basePoints + " pts");
  }
  if (bonus > 0) {
    addRow(breakdown, "🌟 All red flags found! (bonus)", "+50 pts");
  }
  if (wrongHighlights > 0) {
    addRow(breakdown, `Wrong highlights (${wrongHighlights} × −10)`, "−" + (wrongHighlights*10) + " pts");
  }
  // Total row
  const tr = document.createElement("div");
  tr.className = "breakdown-row breakdown-total";
  tr.innerHTML = `<span>Running total</span><span>${totalScore} pts</span>`;
  breakdown.appendChild(tr);

  // Missed suspicious items
  const missedDiv = document.getElementById("res-missed");
  if (email && email.suspiciousCount > 0) {
    const missed = email.segments.filter(s => s.sus && !highlighted[s.id]);
    if (missed.length > 0) {
      missedDiv.style.display = "block";
      missedDiv.innerHTML = `<div class="missed-title">📍 Red flags you missed:</div>`;
      missed.forEach(s => {
        const item = document.createElement("div");
        item.className = "missed-item";
        item.innerHTML = `<span class="missed-text">"${escHtml(s.text)}"</span><span class="missed-explain">${escHtml(s.reason)}</span>`;
        missedDiv.appendChild(item);
      });
    } else {
      missedDiv.style.display = "none";
    }
  } else {
    missedDiv.style.display = "none";
  }

  const btnNext = document.getElementById("btn-next");
  btnNext.textContent = (emailIndex + 1 >= EMAILS.length) ? "🏆 SEE FINAL SCORE" : "NEXT EMAIL →";

  overlay.classList.add("show");
}

function addRow(parent, label, value) {
  const row = document.createElement("div");
  row.className = "breakdown-row";
  row.innerHTML = `<span>${label}</span><span>${value}</span>`;
  parent.appendChild(row);
}

/* ─── NEXT EMAIL ──────────────────────────────────────────── */
function nextEmail() {
  document.getElementById("result-overlay").classList.remove("show");
  emailIndex++;

  if (emailIndex >= EMAILS.length) {
    document.getElementById("go-score").textContent = totalScore;
    populateGameOverScreen();
    show("screen-gameover");

    if (window.BotBusters) {
      BotBusters.submitResult({
        game: 'email',
        score:            totalScore,
        correct_verdicts: correctVerdictsCount,
        total_scenarios:  EMAILS.length,
        flags_found:      flagsFoundTotal,
        flags_total:      flagsTotalTotal,
        questions:        questionResults,
        features:         featureResults,
      }).then(r => console.log('[BotBusters] submit result:', r));
    } else {
      console.warn('[BotBusters] tracker not loaded — check script tag in emailgame.html');
    }
  } else {
    // Reset card visibility
    const card = document.getElementById("email-card");
    card.style.opacity = "1";
    loadEmail(emailIndex);
  }
}

/* ─── POPULATE GAME OVER (grade + breakdown + rank table) ─── */
const RANK_TABLE = [
  { name: "S RANK 🌟",  label: "Master Detective",  min: 850, max: 1000, color: "var(--green)" },
  { name: "A RANK ✅",  label: "Skilled",    min: 700, max: 849,  color: "var(--green)" },
  { name: "B RANK 👍",  label: "Capable",           min: 550, max: 699,  color: "var(--amber, #ffc107)" },
  { name: "C RANK ⚠️",  label: "Learning",          min: 350, max: 549,  color: "var(--amber, #ffc107)" },
  { name: "D RANK",     label: "Keep Practising",   min: 0,   max: 349,  color: "var(--red)" },
];

function getRankFor(score) {
  return RANK_TABLE.find(r => score >= r.min && score <= r.max) || RANK_TABLE[RANK_TABLE.length - 1];
}

function populateGameOverScreen() {
  // ── Grade ──
  const rank = getRankFor(totalScore);
  const gradeEl = document.getElementById("go-grade");
  gradeEl.textContent = rank.name + " — " + rank.label;
  gradeEl.style.color = rank.color;

  // ── Breakdown ──
  const rows = document.getElementById("go-bd-rows");
  rows.innerHTML = "";

  const totalEmails    = EMAILS.length;
  const phishingTotal  = EMAILS.filter(e => e.verdict === "phishing").length;
  const safeTotal      = EMAILS.filter(e => e.verdict === "safe").length;

  const phishingPts    = bdPhishingCaught   * 10;
  const safePts        = bdSafeIdentified   * 50;
  const flagPts        = bdFlagsCorrect     * 30;
  const bonusPts       = bdFlagsBonusCount  * 50;
  const wrongFlagPen   = bdWrongFlagsTotal  * -10;

  if (phishingPts) {
    addBdRow(rows, `📧 Phishing emails caught (${bdPhishingCaught}/${phishingTotal} × 10)`, "+" + phishingPts, false);
  }
  if (safePts) {
    addBdRow(rows, `🛡️ Safe emails identified (${bdSafeIdentified}/${safeTotal} × 50)`, "+" + safePts, false);
  }
  if (flagPts) {
    addBdRow(rows, `🚩 Red flags spotted (${bdFlagsCorrect} × 30)`, "+" + flagPts, false);
  }
  if (bonusPts) {
    addBdRow(rows, `🌟 All-flags bonuses (${bdFlagsBonusCount} × 50)`, "+" + bonusPts, false);
  }
  if (wrongFlagPen < 0) {
    addBdRow(rows, `❌ Wrong highlights (${bdWrongFlagsTotal} × −10)`, wrongFlagPen.toString(), true);
  }
  if (bdWrongVerdicts > 0) {
    addBdRow(rows, `💀 Wrong verdicts (${bdWrongVerdicts})`, "0", false, true);
  }

  // Total row
  const total = document.createElement("div");
  total.className = "go-bd-row";
  total.innerHTML = `<span>TOTAL</span><span>${totalScore} pts</span>`;
  rows.appendChild(total);

  // ── Rank table ──
  const rankRows = document.getElementById("go-rank-rows");
  rankRows.innerHTML = "";
  RANK_TABLE.forEach(r => {
    const row = document.createElement("div");
    const isCurrent = (totalScore >= r.min && totalScore <= r.max);
    row.className = "go-rank-row" + (isCurrent ? " current" : "");
    row.innerHTML = `
      <span class="rank-name" style="${isCurrent ? '' : 'color:' + r.color + ';'}">${r.name} <span class="rank-sub">${r.label}</span></span>
      <span class="rank-range">${r.min} – ${r.max}</span>
    `;
    rankRows.appendChild(row);
  });
}

function addBdRow(parent, label, value, penalty, info) {
  const row = document.createElement("div");
  row.className = "go-bd-row" + (penalty ? " penalty" : "") + (info ? " info" : "");
  row.innerHTML = `<span>${label}</span><span>${value}</span>`;
  parent.appendChild(row);
}

/* ─── SCORE HELPERS ───────────────────────────────────────── */
function addScore(pts) {
  totalScore = Math.max(0, totalScore + pts);
  const el = document.getElementById("hud-score");
  el.textContent = totalScore;
  el.style.transform = "scale(1.2)";
  el.style.color = pts >= 0 ? "#80e5d5" : "#ff6b35";
  setTimeout(() => { el.style.transform = "scale(1)"; el.style.color = "var(--green)"; }, 300);
}

function showScorePopup(text, anchor, color="#00c9a7") {
  const r = anchor.getBoundingClientRect();
  const popup = document.createElement("div");
  popup.className = "score-popup";
  popup.textContent = text;
  popup.style.left = (r.left + r.width/2 - 20) + "px";
  popup.style.top  = (r.top - 10) + "px";
  popup.style.color = color;
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 1200);
}

/* ─── FEEDBACK ────────────────────────────────────────────── */
function showFeedback(correct, title, body) {
  const bubble = document.getElementById("feedback-bubble");
  bubble.className = "feedback-bubble show" + (correct ? "" : " wrong-fb");
  document.getElementById("fb-icon").textContent = correct ? "🚨" : "ℹ️";
  const t = document.getElementById("fb-title");
  t.className = "fb-title " + (correct ? "good" : "bad");
  t.textContent = title;
  document.getElementById("fb-body").textContent = body;
}

function hideFeedback() {
  document.getElementById("feedback-bubble").classList.remove("show");
}

/* ─── UTILS ───────────────────────────────────────────────── */
function escHtml(str) {
  return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}