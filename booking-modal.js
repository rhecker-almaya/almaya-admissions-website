// Some pages set html,body{height:100%} + overflow-x:hidden, which makes BODY the
// scroll container instead of the window. Always scroll whichever one is real.
window.__amScroller = () => {
  const bd = document.body;
  return (bd && bd.scrollHeight > bd.clientHeight + 1 && /auto|scroll/.test(getComputedStyle(bd).overflowY))
    ? bd : (document.scrollingElement || document.documentElement);
};
// Almaya — shared "Get Matched" booking modal.
//
// Replaces the old Free Consultation page. Any link pointing at the booking URL
// opens the consultation iframe in an overlay instead of navigating.
//
// Two deliberate choices:
//  * Triggers are matched by HREF, not by a class or data attribute, because
//    site-mobile-nav.js builds the drawer CTA by copying the header CTA's href
//    and nothing else. Matching on href means the mobile drawer works with no
//    changes to that file.
//  * The href is a real, working URL. If this script fails to load the links
//    still go somewhere useful, which the previous onClick bindings did not.
//
// The overlay is appended to <body>, outside <x-dc>, so a DC re-render cannot
// strip it — the same reason site-mobile-nav.js puts its drawer there.
(() => {
  // The helmet script can be evaluated more than once (DC re-render /
  // streaming remount), so idempotency has to live on a global, never on
  // closure state, which resets on every fresh evaluation.
  if (window.__amBookingModal) return;
  window.__amBookingModal = true;

  const BOOKING_URL = 'https://api.leadconnectorhq.com/widget/booking/waXfk5QQ8VhoYMOXXoRN';

  let overlay = null, frame = null, closeBtn = null, lastFocus = null;

  const isTrigger = a => {
    if (!a) return false;
    if (a.tagName === 'BUTTON') return a.hasAttribute('data-booking');
    if (a.hasAttribute('data-booking')) return true;
    const raw = a.getAttribute('href') || '';
    if (raw === '#book' || raw === '#booking' || raw === '#consultation') return true;
    if (/leadconnectorhq\.com\/widget\/booking\//.test(a.href) || /calendly\.com/.test(a.href)) return true;
    // text fallback: any "Get matched" / "free consultation" CTA opens the calendar
    if ((!raw || raw === '#') && /get matched|free consultation|book a time/i.test(a.textContent || '')) return true;
    // compare resolved absolute URLs so relative/absolute forms both match
    return a.href === BOOKING_URL || a.href === BOOKING_URL + '/' || a.href.indexOf('learn.almayaadmissions.com/book/free-consultation') !== -1;
  };

  const build = () => {
    if (overlay) return;

    overlay = document.createElement('div');
    overlay.className = 'am-booking';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Book your free consultation');
    overlay.style.cssText =
      'position:fixed;inset:0;z-index:2000;background:rgba(15,38,31,0.78);' +
      'display:none;align-items:center;justify-content:center;padding:24px;opacity:0;transition:opacity .25s ease;overscroll-behavior:contain;touch-action:none';

    const css = document.createElement('style');
    css.textContent =
      '@keyframes amBkSpin{to{transform:rotate(360deg)}}' +
      '.am-booking-panel{transform:translateY(14px);transition:transform .3s ease}' +
      '.am-booking.is-open .am-booking-panel{transform:none}' +
      '@media (min-width:909px){.am-booking-panel{min-width:860px}}' +
      '@media (max-width:640px){.am-booking{padding:0!important}.am-booking-panel{height:100%!important;max-width:none!important;border-radius:0!important}.am-bk-faces{display:none!important}.am-bk-head{padding:16px 16px 14px!important}.am-bk-title{font-size:24px!important}.am-bk-foot{display:none!important}}';
    document.head.appendChild(css);

    const panel = document.createElement('div');
    panel.className = 'am-booking-panel';
    panel.style.touchAction = 'auto';
    panel.style.cssText =
      'position:relative;width:100%;max-width:1040px;height:min(calc(100vh - 48px),920px);' +
      'background:var(--ivory,#F7F3EA);border-radius:10px;box-shadow:0 30px 80px rgba(0,0,0,0.4);' +
      'overflow:hidden;display:flex;flex-direction:column';

    const head = document.createElement('div');
    head.className = 'am-bk-head';
    head.style.cssText =
      'display:flex;align-items:center;gap:18px;padding:22px 26px 20px;flex-shrink:0;' +
      'background:var(--forest-900,#17392F);color:var(--ivory,#F7F3EA)';
    head.innerHTML =
      '<div class="am-bk-faces" style="display:flex;flex-shrink:0">' +
        '<img src="assets/experts/razi.png" alt="Razi Hecker" style="width:52px;height:52px;border-radius:50%;object-fit:cover;border:2px solid var(--forest-900,#17392F)">' +
        '<img src="assets/experts/eitan.png" alt="Eitan Ginsburg" style="width:52px;height:52px;border-radius:50%;object-fit:cover;border:2px solid var(--forest-900,#17392F);margin-left:-14px">' +
      '</div>' +
      '<div style="display:flex;flex-direction:column;gap:4px;min-width:0;flex:1">' +
        '<div style="font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:var(--sand,#D9C9A8)">Free · 30 minutes</div>' +
        '<div class="am-bk-title" style="font-family:var(--font-serif-display);font-weight:500;font-size:28px;line-height:1.05">Book your free <em style="color:#E07A4F">consultation</em></div>' +
        '<div style="font-size:14px;color:rgba(247,243,234,0.78)">With Razi or Eitan, our co-founders. Pick a time that works for you.</div>' +
      '</div>';

    closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    // class is the hook site-mobile.css uses to keep this square at the 44px mobile tap-target size
    closeBtn.className = 'am-booking-close';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText =
      'align-self:flex-start;display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;' +
      'flex-shrink:0;border-radius:50%;border:1px solid rgba(247,243,234,0.3);background:transparent;' +
      'color:var(--ivory,#F7F3EA);font-size:16px;line-height:1;cursor:pointer';
    closeBtn.onmouseenter = () => { closeBtn.style.background = 'rgba(247,243,234,0.12)'; };
    closeBtn.onmouseleave = () => { closeBtn.style.background = 'transparent'; };
    head.appendChild(closeBtn);

    const body = document.createElement('div');
    body.style.cssText = 'position:relative;flex:1;min-height:0;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;background:var(--ivory,#F7F3EA);padding:18px';
    const loader = document.createElement('div');
    loader.style.cssText =
      'position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;' +
      'font-family:Jost,var(--font-sans,sans-serif);font-size:14px;color:var(--forest-900,#17392F);background:#F7F3EA';
    loader.innerHTML =
      '<span style="width:28px;height:28px;border-radius:50%;border:2px solid rgba(23,57,47,0.15);border-top-color:#B85C3D;animation:amBkSpin .8s linear infinite"></span>' +
      'Loading available times…';

    frame = document.createElement('iframe');
    // src is set on first open so the booking app is not fetched on every page load
    frame.id = 'waXfk5QQ8VhoYMOXXoRN_' + Date.now();
    frame.setAttribute('title', 'Free consultation booking');
    frame.setAttribute('allowfullscreen', '');
    frame.setAttribute('allow', 'payment');
    frame.style.cssText = 'position:relative;display:block;width:100%;height:100%;min-height:100%;border:1px solid rgba(23,57,47,0.12);border-radius:8px;background:#fff;box-shadow:0 6px 24px rgba(23,57,47,0.08);opacity:0;transition:opacity .3s ease';
    frame.addEventListener('load', () => { loader.style.display = 'none'; frame.style.opacity = '1'; });

    body.appendChild(loader);
    body.appendChild(frame);
    const foot = document.createElement('div');
    foot.className = 'am-bk-foot';
    foot.style.cssText =
      'flex-shrink:0;display:flex;justify-content:center;flex-wrap:wrap;gap:8px 28px;padding:14px 20px;' +
      'border-top:1px solid rgba(23,57,47,0.1);background:var(--ivory,#F7F3EA);font-size:13px;color:var(--forest-900,#17392F)';
    foot.innerHTML = ['No cost, no obligation', 'Personally matched advisors', 'Confirmation sent by email']
      .map(t => '<span style="display:inline-flex;align-items:center;gap:8px"><span style="color:var(--copper,#B85C3D)">✓</span>' + t + '</span>').join('');
    panel.appendChild(head);
    panel.appendChild(body);
    panel.appendChild(foot);
    const fb = document.createElement('div');
    fb.style.cssText = 'flex-shrink:0;padding:0 20px 12px;text-align:center;font-size:12px;color:var(--text-muted,#6b6b6b);background:var(--ivory,#F7F3EA)';
    fb.innerHTML = 'Having trouble? <a href="' + BOOKING_URL + '" target="_blank" rel="noopener" style="color:var(--copper-600,#9E4A2F);text-decoration:underline">Open the booking page</a>';
    panel.appendChild(fb);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    overlay.addEventListener('wheel', e => { if (!body.contains(e.target)) e.preventDefault(); }, { passive: false });
    overlay.addEventListener('click', close);
    panel.addEventListener('click', e => e.stopPropagation());
    closeBtn.addEventListener('click', close);
  };

  // GHL's own embed helper (auto-height, in-frame redirects)
  const loadEmbedJs = () => {
    if (document.querySelector('script[src*="link.msgsndr.com/js/form_embed.js"]')) return;
    const s = document.createElement('script');
    s.src = 'https://link.msgsndr.com/js/form_embed.js';
    s.async = true;
    document.head.appendChild(s);
  };

  // A cross-origin iframe can't navigate the parent page on its own, so the
  // booking widget's redirect stalls on a spinner. GHL posts
  // ['msgsndr-booking-complete', {...}] when a booking is made — catch it here
  // and send the visitor to the thank-you page ourselves.
  const THANK_YOU = '/thank-you';
  let redirected = false;
  window.addEventListener('message', e => {
    if (redirected || !/leadconnectorhq\.com|msgsndr\.com|almayaadmissions\.com/.test(e.origin || '')) return;
    const d = e.data;
    const isDone = (Array.isArray(d) && d[0] === 'msgsndr-booking-complete') ||
      (typeof d === 'string' && d.indexOf('msgsndr-booking-complete') !== -1);
    if (!isDone) return;
    redirected = true;
    const info = (Array.isArray(d) && d[1] && typeof d[1] === 'object') ? d[1] : {};
    const q = new URLSearchParams();
    const pick = (k, ...src) => { for (const s of src) { const v = s.split('.').reduce((o, p) => o && o[p], info); if (v) { q.set(k, v); return; } } };
    pick('first_name', 'first_name', 'firstName', 'contact.first_name', 'contact.firstName', 'name');
    pick('appointment_start_time', 'startTime', 'start_time', 'appointment.startTime', 'selectedSlot', 'slot');
    pick('timezone', 'timezone', 'timeZone', 'selectedTimezone');
    pick('meeting_link', 'meetingLink', 'address', 'location', 'appointment.address');
    const qs = q.toString();
    setTimeout(() => { window.location.href = THANK_YOU + (qs ? '?' + qs : ''); }, 400);
  });

  // Pages with a booking section at the bottom: CTAs smooth-scroll there.
  // The iframe goes into the empty container (React renders no children
  // there, so re-renders leave it alone) the first time it nears view.
  const inlineHost = () => document.querySelector('[data-am-inline-booking], [data-am-reveal-booking]');
  const fillInline = host => {
    if (!host || host.querySelector('iframe')) return;
    loadEmbedJs();
    const f = document.createElement('iframe');
    f.src = BOOKING_URL;
    f.id = 'waXfk5QQ8VhoYMOXXoRN_inline_' + Date.now();
    f.title = 'Free consultation booking';
    f.setAttribute('allow', 'payment');
    f.style.cssText = 'display:block;width:100%;height:760px;border:0';
    host.appendChild(f);
  };
  // The calendar stays hidden until the visitor clicks "Pick a time" in the section.
  const revealInline = () => openModal();
  document.addEventListener('click', e => {
    const t = e.target.closest && e.target.closest('[data-am-reveal-booking]');
    if (!t) return;
    e.preventDefault();
    trigger = t;
    revealInline();
  });

  const scrollToInline = () => {
    const host = inlineHost();
    if (!host) return false;
    const sec = host.closest('section') || host;
    const s = window.__amScroller();
    s.scrollTo({ top: s.scrollTop + sec.getBoundingClientRect().top - 72, behavior: 'smooth' });
    return true;
  };

  const open = () => { if (!scrollToInline()) openModal(); };
  let trigger = null;
  const openModal = () => {
    loadEmbedJs();
    build();
    if (!frame.src) frame.src = BOOKING_URL;
    lastFocus = trigger || document.activeElement;
    trigger = null;
    overlay.style.display = 'flex';
    requestAnimationFrame(() => { overlay.style.opacity = '1'; overlay.classList.add('is-open'); });
    document.documentElement.style.setProperty('overflow', 'hidden', 'important');
    document.body.style.setProperty('overflow', 'hidden', 'important');
    closeBtn.focus();
  };

  const close = () => {
    if (!overlay || overlay.style.display === 'none') return;
    overlay.style.display = 'none';
    overlay.style.opacity = '0';
    overlay.classList.remove('is-open');
    document.documentElement.style.removeProperty('overflow');
    document.body.style.removeProperty('overflow');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  };

  document.addEventListener('click', e => {
    // let ctrl/cmd/middle-click keep their native "open in new tab" behavior
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest && (e.target.closest('a') || e.target.closest('button[data-booking]'));
    if (!isTrigger(a)) return;
    e.preventDefault();
    // data-am-popup: open the calendar pop-up directly instead of scrolling to the bottom section
    trigger = a;
    if (a.hasAttribute('data-am-popup')) openModal(); else open();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
    if (e.key === 'Tab' && overlay && overlay.style.display !== 'none') {
      const els = [...overlay.querySelectorAll('button, a[href], iframe')].filter(el => el.offsetParent !== null);
      if (!els.length) return;
      const first = els[0], last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // exposed so page scripts can trigger it directly if ever needed
  window.openBookingModal = open;
})();


// Back-to-top button (every page that loads this file, desktop + mobile)
(() => {
  if (window.__amTopBtn) return; window.__amTopBtn = true;
  const mount = () => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'am-top-btn';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg>';
    btn.style.cssText =
      'position:fixed;right:24px;bottom:24px;z-index:1500;width:48px;height:48px;border-radius:50%;' +
      'display:flex;align-items:center;justify-content:center;cursor:pointer;' +
      'background:var(--forest-900,#17392F);color:var(--ivory,#F7F3EA);border:1px solid rgba(247,243,234,0.25);' +
      'box-shadow:0 8px 24px rgba(15,38,31,0.25);opacity:0;transform:translateY(10px);pointer-events:none;' +
      'transition:opacity .25s ease,transform .25s ease,background .2s ease';
    btn.onmouseenter = () => { btn.style.background = 'var(--copper,#B85C3D)'; };
    btn.onmouseleave = () => { btn.style.background = 'var(--forest-900,#17392F)'; };
    btn.addEventListener('click', () => window.__amScroller().scrollTo({ top: 0, behavior: 'smooth' }));
    const css = document.createElement('style');
    css.textContent = '@media (min-width:909px){.am-booking-panel{min-width:860px}}' +
      '@media (max-width:640px){.am-top-btn{right:16px!important;bottom:16px!important;width:44px!important;height:44px!important}}';
    document.head.appendChild(css);
    document.body.appendChild(btn);
    const update = () => {
      const show = window.__amScroller().scrollTop > window.innerHeight * 0.8 && !document.querySelector('.am-booking.is-open');
      btn.style.opacity = show ? '1' : '0';
      btn.style.transform = show ? 'none' : 'translateY(10px)';
      btn.style.pointerEvents = show ? 'auto' : 'none';
    };
    document.addEventListener('scroll', update, { capture: true, passive: true });
    update();
  };
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
})();
