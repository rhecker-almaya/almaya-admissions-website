// Almaya — the site header, as one shared component.
//
// Every page used to carry its own hand-written copy of this markup (18 of
// them), and they had drifted into two visibly different designs. Now each
// page mounts this instead:
//
//   <x-import component-from-global-scope="site-header" data-active="advisors"></x-import>
//
// Attributes (all optional):
//   data-active        which nav item is highlighted: why | how | advisors | about | institutions
//   data-header-class  extra class on the <header> (Institutions uses this for its scroll-compact state)
//   data-cta-href      override the primary CTA link      (default: the free-consultation booking URL)
//   data-cta-label     override the primary CTA text      (default: "Get Matched")
//   data-cta-class     extra class on the CTA anchor      (e.g. "cta-lift")
//
// The DOM this emits is deliberately identical in *shape* to the old inline
// markup — logo anchor first, <nav class="nav-links"> second, CTA wrapped in a
// trailing <div> — because site-mobile.css and site-mobile-nav.js both select
// against that structure (`header > a:first-child`, `header > div:last-child`,
// `nav.nav-links`).
(() => {
  // The helmet script can be evaluated more than once (DC re-render /
  // streaming remount), so guard on a global rather than closure state.
  if (window.__amSiteHeader) return;
  window.__amSiteHeader = true;

  const NAV = [
    { key: 'why',          href: 'Why Almaya.dc.html',   label: 'Why Almaya' },
    { key: 'how',          href: 'How It Works.dc.html', label: 'How It Works' },
    { key: 'advisors',     href: 'Tutors.dc.html',       label: 'Our Advisors' },
    { key: 'about',        href: 'About Us.dc.html',     label: 'About Us' },
    { key: 'institutions', href: 'Institutions.dc.html', label: 'Institutions' },
  ];

  const BOOKING_URL = 'https://learn.almayaadmissions.com/book/free-consultation';

  // Mirrors AlmayyaDesignSystem.Button {variant:'primary', size:'sm'} from the
  // design-system bundle. Inlined rather than x-import'd because the DC runtime
  // only mounts x-import tags it parsed from the page — it does not walk DOM
  // built by a custom element. Keep in sync with _ds/.../_ds_bundle.js Button.
  const CSS = `
site-header{display:contents}
.am-hdr-cta{font-family:var(--font-sans-body);font-weight:500;letter-spacing:0.02em;border:none;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:var(--radius-md);transition:background 0.15s ease,color 0.15s ease,border-color 0.15s ease;padding:8px 16px;font-size:var(--text-small);background:var(--accent-cta);color:var(--ivory)}
.am-hdr-cta:hover{background:var(--accent-cta-hover)}
`;

  const injectCss = () => {
    if (document.getElementById('am-site-header-css')) return;
    const s = document.createElement('style');
    s.id = 'am-site-header-css';
    s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  };

  const NAV_LINK = 'color:var(--text-muted-inverse);font-size:15px;white-space:nowrap';
  const NAV_LINK_ACTIVE = 'color:var(--copper);font-size:15px;font-weight:600;white-space:nowrap';

  const HEADER_STYLE = 'display:flex;align-items:center;justify-content:space-between;gap:32px;' +
    'padding:16px 48px;background:var(--bg-header,#2D5C49);position:sticky;top:0;z-index:100;' +
    'box-shadow:0 1px 3px rgba(0,0,0,0.12)';

  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const markup = (active, ctaHref, ctaLabel, ctaClass) => `
<a href="/" style="display:flex;align-items:center;gap:14px;text-decoration:none"><div style="display:flex;align-items:center;justify-content:center;width:48px;height:48px;border-radius:50%;background:radial-gradient(circle,rgba(196,120,74,0.18),rgba(196,120,74,0) 70%)"><img src="assets/almayya-mark-white.png" style="height:36px"></div><span style="font-family:var(--font-serif-display);font-size:26px;letter-spacing:0.02em;color:var(--ivory);font-weight:600">Almaya <em style="font-style:italic;color:var(--ivory)">Admissions</em></span></a>
<nav class="nav-links" style="display:flex;gap:30px;align-items:center;flex:1;justify-content:center">
${NAV.map(n => `<a href="${esc(n.href)}" style="${n.key === active ? NAV_LINK_ACTIVE : NAV_LINK}">${esc(n.label)}</a>`).join('\n')}
</nav>
<div style="display:flex;gap:12px">
<a href="${esc(ctaHref)}"${ctaClass ? ` class="${esc(ctaClass)}"` : ''}><button class="am-hdr-cta">${esc(ctaLabel)}</button></a>
</div>`;

  class SiteHeader extends HTMLElement {
    static get observedAttributes() {
      return ['data-active', 'data-header-class', 'data-cta-href', 'data-cta-label', 'data-cta-class'];
    }

    connectedCallback() {
      injectCss();
      this.render();
    }

    attributeChangedCallback() {
      if (this.isConnected) this.render();
    }

    render() {
      const active = this.getAttribute('data-active') || '';
      const ctaHref = this.getAttribute('data-cta-href') || BOOKING_URL;
      const ctaLabel = this.getAttribute('data-cta-label') || 'Get Matched';
      const ctaClass = this.getAttribute('data-cta-class') || '';
      // `{{ hole }}` values arrive verbatim if the page's Component has not
      // produced them yet — treat an unresolved hole as empty.
      const extra = (this.getAttribute('data-header-class') || '').includes('{{')
        ? '' : (this.getAttribute('data-header-class') || '');

      let header = this._header;
      if (!header || !header.isConnected || header.parentNode !== this) {
        header = this._header = document.createElement('header');
        header.setAttribute('style', HEADER_STYLE);
        this.textContent = '';
        this.appendChild(header);
        this._sig = null;
      }
      header.className = extra;

      // site-mobile-nav.js appends a toggle + reads these links, so only rebuild
      // when something actually changed — otherwise its injected toggle is lost
      // on every unrelated attribute flip (Institutions toggles one on scroll).
      const sig = JSON.stringify([active, ctaHref, ctaLabel, ctaClass]);
      if (sig === this._sig) return;
      this._sig = sig;
      header.innerHTML = markup(active, ctaHref, ctaLabel, ctaClass);
    }
  }

  if (!customElements.get('site-header')) customElements.define('site-header', SiteHeader);
})();
