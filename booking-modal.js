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

  const BOOKING_URL = 'https://learn.almayaadmissions.com/book/free-consultation';

  let overlay = null, frame = null, closeBtn = null, lastFocus = null;

  const isTrigger = a => {
    if (!a) return false;
    if (a.hasAttribute('data-booking')) return true;
    // compare resolved absolute URLs so relative/absolute forms both match
    return a.href === BOOKING_URL || a.href === BOOKING_URL + '/';
  };

  const build = () => {
    if (overlay) return;

    overlay = document.createElement('div');
    overlay.className = 'am-booking';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Book your free consultation');
    overlay.style.cssText =
      'position:fixed;inset:0;z-index:2000;background:rgba(23,57,47,0.72);' +
      'display:none;align-items:center;justify-content:center;padding:32px';

    const panel = document.createElement('div');
    panel.style.cssText =
      'position:relative;width:100%;max-width:920px;height:min(88vh,900px);' +
      'background:var(--white);border-radius:8px;box-shadow:0 24px 60px rgba(0,0,0,0.35);' +
      'overflow:hidden;display:flex;flex-direction:column';

    const bar = document.createElement('div');
    bar.style.cssText =
      'display:flex;align-items:center;justify-content:space-between;gap:16px;' +
      'padding:14px 18px;border-bottom:1px solid var(--border-subtle);flex-shrink:0';

    const title = document.createElement('span');
    title.textContent = 'Book your free consultation';
    title.style.cssText =
      'font-family:var(--font-serif-display);font-size:18px;color:var(--forest-900)';

    closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText =
      'display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;' +
      'border-radius:4px;border:1px solid var(--border-subtle);background:transparent;' +
      'color:var(--forest-900);font-size:18px;line-height:1;cursor:pointer';

    frame = document.createElement('iframe');
    // src is set on first open so the booking app is not fetched on every page load
    frame.setAttribute('title', 'Free consultation booking');
    frame.setAttribute('allowfullscreen', '');
    frame.style.cssText = 'display:block;flex:1;width:100%;border:0';

    bar.appendChild(title);
    bar.appendChild(closeBtn);
    panel.appendChild(bar);
    panel.appendChild(frame);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', close);
    panel.addEventListener('click', e => e.stopPropagation());
    closeBtn.addEventListener('click', close);
  };

  const open = () => {
    build();
    if (!frame.src) frame.src = BOOKING_URL;
    lastFocus = document.activeElement;
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  };

  const close = () => {
    if (!overlay || overlay.style.display === 'none') return;
    overlay.style.display = 'none';
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
