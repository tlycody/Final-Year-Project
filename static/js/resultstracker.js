/* BotBusters — Game Result Tracker */

(function () {
  'use strict';

  // Read CSRF token from cookie (Django default)
  function getCookie(name) {
    const m = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return m ? decodeURIComponent(m.pop()) : '';
  }

  async function submitResult(payload) {
    try {
      const res = await fetch('/api/submit-result/', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify(payload || {}),
      });

      if (!res.ok) {
        console.warn('[BotBusters] submit-result HTTP', res.status);
        return { ok: false };
      }
      return await res.json();
    } catch (err) {
      console.warn('[BotBusters] submit-result failed:', err);
      return { ok: false, error: String(err) };
    }
  }

  // Tiny on-screen toast for newly-earned badges
  function showBadgeToast(badge) {
    const t = document.createElement('div');
    t.style.cssText = `
      position:fixed; bottom:24px; right:24px;
      background:linear-gradient(135deg, #00c9a7, #009e84);
      color:#003c3c; padding:14px 18px; border-radius:8px;
      font-family:'Inter',sans-serif; font-weight:700; font-size:14px;
      letter-spacing:0.05em; box-shadow:0 0 30px rgba(0,201,167,0.6);
      z-index:99999; display:flex; align-items:center; gap:10px;
      transform:translateX(120%); transition:transform 0.4s ease;
    `;
    t.innerHTML = `<span style="font-size:24px;">${badge.icon || '🏅'}</span>
                   <span>Badge earned: <strong>${badge.name}</strong></span>`;
    document.body.appendChild(t);
    requestAnimationFrame(() => { t.style.transform = 'translateX(0)'; });
    setTimeout(() => {
      t.style.transform = 'translateX(120%)';
      setTimeout(() => t.remove(), 500);
    }, 4000);
  }

  // Public API
  window.BotBusters = {
    submitResult: async function (payload) {
      const result = await submitResult(payload);
      if (result.ok && Array.isArray(result.new_badges)) {
        result.new_badges.forEach((b, i) => setTimeout(() => showBadgeToast(b), i * 600));
      }
      return result;
    },
  };
})();