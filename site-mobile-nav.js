// Almaya — injects a mobile nav toggle + drawer into the sticky site header.
// Reads the existing desktop nav links so pages stay the single source of truth.
(() => {
  // The helmet script can be evaluated more than once (DC re-render /
  // streaming remount), so idempotency has to live on the DOM and a global —
  // never on closure state, which resets on every fresh evaluation.
  if (window.__amMobileNav) return;
  window.__amMobileNav = true;

  let drawer = null, wired = false;

  const findCta = (header, nav) => {
    // Primary CTA = last header anchor that is not the logo and not a nav link.
    // Resolved before the toggle is appended, and never positionally.
    const logo = header.querySelector('a');
    const anchors = [...header.querySelectorAll('a')].filter(
      a => a !== logo && !nav.contains(a) && !a.classList.contains('am-navtoggle')
    );
    return anchors[anchors.length - 1] || null;
  };

  const attach = () => {
    const header = document.querySelector('header');
    const nav = header && header.querySelector('nav.nav-links');
    if (!nav) return;
    if (header.querySelector('.am-navtoggle') && drawer && drawer.isConnected) return;

    const cta = findCta(header, nav);

    // clear any prior injection so a re-entry can never stack toggles
    document.querySelectorAll('.am-navtoggle').forEach(el => el.remove());
    document.querySelectorAll('.am-drawer').forEach(el => el.remove());
    drawer = document.createElement('div');
    drawer.className = 'am-drawer';
    nav.querySelectorAll('a').forEach(a => {
      const link = document.createElement('a');
      link.href = a.getAttribute('href');
      link.textContent = a.textContent.trim();
      drawer.appendChild(link);
    });
    if (cta) {
      const c = document.createElement('a');
      c.className = 'am-cta';
      c.href = cta.getAttribute('href') || '#';
      if (cta.getAttribute('target')) c.target = cta.getAttribute('target');
      c.textContent = (cta.textContent || '').trim() || 'Get Matched';
      drawer.appendChild(c);
    }

    const toggle = document.createElement('div');
    toggle.className = 'am-navtoggle';
    toggle.setAttribute('role', 'button');
    toggle.setAttribute('aria-label', 'Menu');
    toggle.appendChild(document.createElement('span'));

    const place = () => { drawer.style.top = header.getBoundingClientRect().bottom + 'px'; };
    toggle.addEventListener('click', e => {
      e.stopPropagation();
      place();
      drawer.classList.toggle('am-open');
    });
    drawer.addEventListener('click', e => {
      if (e.target.tagName === 'A') drawer.classList.remove('am-open');
    });

    if (!wired) {
      wired = true;
      document.addEventListener('click', e => {
        if (!drawer) return;
        const t = document.querySelector('.am-navtoggle');
        if (!drawer.contains(e.target) && !(t && t.contains(e.target))) drawer.classList.remove('am-open');
      });
      window.addEventListener('scroll', () => {
        const h = document.querySelector('header');
        if (drawer && h && drawer.classList.contains('am-open')) drawer.style.top = h.getBoundingClientRect().bottom + 'px';
      }, { passive: true });
    }

    header.appendChild(toggle);
    document.body.appendChild(drawer);
  };

  // The header streams in, so try a few times as the page settles.
  attach();
  [300, 900, 2000, 4000].forEach(t => setTimeout(attach, t));
  window.addEventListener('load', attach);
})();

