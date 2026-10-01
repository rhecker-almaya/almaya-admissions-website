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
    if (a.hasAttribute('data-booking')) return true;
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
      'display:none;align-items:center;justify-content:center;padding:32px;opacity:0;transition:opacity .25s ease;overscroll-behavior:contain;touch-action:none';

    const css = document.createElement('style');
    css.textContent =
      '@keyframes amBkSpin{to{transform:rotate(360deg)}}' +
      '.am-booking-panel{transform:translateY(14px);transition:transform .3s ease}' +
      '.am-booking.is-open .am-booking-panel{transform:none}' +
      '@media (max-width:640px){.am-booking{padding:0!important}.am-booking-panel{height:100%!important;max-width:none!important;border-radius:0!important}.am-bk-faces{display:none!important}.am-bk-head{padding:16px 16px 14px!important}.am-bk-title{font-size:24px!important}}';
    document.head.appendChild(css);

    const panel = document.createElement('div');
    panel.className = 'am-booking-panel';
    panel.style.touchAction = 'auto';
    panel.style.cssText =
      'position:relative;width:100%;max-width:920px;height:min(90vh,920px);' +
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
        '<div style="font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:var(--sand,#D9C9A8)">Free · 20–30 minutes</div>' +
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
    body.style.cssText = 'position:relative;flex:1;min-height:0;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;background:var(--ivory,#F7F3EA)';
    const loader = document.createElement('div');
    loader.style.cssText =
      'position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;' +
      'font-size:14px;color:var(--text-muted,#6b6b6b)';
    loader.innerHTML =
      '<span style="width:28px;height:28px;border-radius:50%;border:2px solid rgba(23,57,47,0.15);border-top-color:var(--copper,#B85C3D);animation:amBkSpin .8s linear infinite"></span>' +
      'Loading available times…';

    frame = document.createElement('iframe');
    // src is set on first open so the booking app is not fetched on every page load
    frame.id = 'waXfk5QQ8VhoYMOXXoRN_' + Date.now();
    frame.setAttribute('title', 'Free consultation booking');
    frame.setAttribute('allowfullscreen', '');
    frame.setAttribute('allow', 'payment');
    frame.style.cssText = 'position:relative;display:block;width:100%;height:100%;min-height:100%;border:0;background:transparent';
    frame.addEventListener('load', () => { loader.style.display = 'none'; });

    body.appendChild(loader);
    body.appendChild(frame);
    panel.appendChild(head);
    panel.appendChild(body);
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

  const open = () => {
    loadEmbedJs();
    build();
    if (!frame.src) frame.src = BOOKING_URL;
    lastFocus = document.activeElement;
    overlay.style.display = 'flex';
    requestAnimationFrame(() => { overlay.style.opacity = '1'; overlay.classList.add('is-open'); });
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  };

  const close = () => {
    if (!overlay || overlay.style.display === 'none') return;
    overlay.style.display = 'none';
    overlay.style.opacity = '0';
    overlay.classList.remove('is-open');
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  };

  document.addEventListener('click', e => {
    // let ctrl/cmd/middle-click keep their native "open in new tab" behavior
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest && e.target.closest('a');
    if (!isTrigger(a)) return;
    e.preventDefault();
    open();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });

  // exposed so page scripts can trigger it directly if ever needed
  window.openBookingModal = open;
})();
