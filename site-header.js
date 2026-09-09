// Almaya — the site header, as one shared component.
//
// Every page used to carry its own hand-written copy of this markup (18 of
// them), and they had drifted into two visibly different designs. Now each
// page mounts this instead:
//
//   <x-import component-from-global-scope="SiteHeader" data-active="advisors"></x-import>
//
// Attributes (all optional):
//   data-active        which nav item is highlighted: why | how | advisors | about | institutions
//   data-header-class  extra class on the <header> (Institutions uses this for its scroll-compact state)
//   data-cta-href      override the primary CTA link      (default: the free-consultation booking URL)
//   data-cta-label     override the primary CTA text      (default: "Get Matched")
//   data-cta-class     extra class on the CTA anchor      (e.g. "cta-lift")
//
// This is a plain React function component on `window`, which is how the DC
// runtime prefers to mount things — the same shape as the design-system
// components pages already use (`component-from-global-scope=
// "AlmayyaDesignSystem_fd8d10.Button"`). resolveGlobal() in support.js branches
// on the name: a *dashed* name is forced down the custom-element path, an
// undashed one is looked up on window and rendered as a React component. The
// only thing that ever made this a custom element was the hyphen in its name.
//
// The DOM this emits is deliberately identical in *shape* to the old inline
// markup — logo anchor first, <nav class="nav-links"> second, CTA wrapped in a
// trailing <div> — because site-mobile.css and site-mobile-nav.js both select
// against that structure (`header > a:first-child`, `nav.nav-links`).
//
// The CTA wrapper additionally carries `.am-hdr-cta-wrap`. site-mobile.css used
// to reach it as `header > div:last-child`, which breaks as soon as
// site-mobile-nav.js appends its toggle — the class is what makes those rules
// stop depending on sibling order. Do not remove it without updating the
// "keep the CTA on one line" block in site-mobile.css.
(() => {
  // The helmet script can be evaluated more than once (DC re-render /
  // streaming remount), so guard on a global rather than closure state.
  if (window.__amSiteHeader) return;
  window.__amSiteHeader = true;

  const NAV = [
    { key: "why", href: "Why Almaya.dc.html", label: "Why Almaya" },
    { key: "how", href: "How It Works.dc.html", label: "How It Works" },
    { key: "advisors", href: "Tutors.dc.html", label: "Our Advisors" },
    { key: "about", href: "About Us.dc.html", label: "About Us" },
    {
      key: "institutions",
      href: "Institutions.dc.html",
      label: "Institutions",
    },
  ];

  const BOOKING_URL =
    "https://learn.almayaadmissions.com/book/free-consultation";

  // Mirrors AlmayyaDesignSystem.Button {variant:'primary', size:'sm'} from the
  // design-system bundle. Inlined rather than x-import'd because the DC runtime
  // only mounts x-import tags it parsed from the page — it does not walk DOM
  // built by a custom element. Keep in sync with _ds/.../_ds_bundle.js Button.
  //
  // That constraint no longer applies to the React component below, which can
  // call AlmayyaDesignSystem_fd8d10.Button directly — but swapping it out
  // changes the emitted DOM, so it is deliberately left for a follow-up rather
  // than folded into a port that is meant to be behaviour-identical.
  const CSS = `
site-header{display:contents}
.am-hdr-cta{font-family:var(--font-sans-body);font-weight:500;letter-spacing:0.02em;border:none;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:var(--radius-md);transition:background 0.15s ease,color 0.15s ease,border-color 0.15s ease;padding:8px 16px;font-size:var(--text-small);background:var(--accent-cta);color:var(--ivory)}
.am-hdr-cta:hover{background:var(--accent-cta-hover)}
`;

  const injectCss = () => {
    if (document.getElementById("am-site-header-css")) return;
    const s = document.createElement("style");
    s.id = "am-site-header-css";
    s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  };

  const NAV_LINK =
    "color:var(--text-muted-inverse);font-size:15px;white-space:nowrap";
  const NAV_LINK_ACTIVE =
    "color:var(--copper);font-size:15px;font-weight:600;white-space:nowrap";

  // React wants a style object; the legacy element below wants a string. The
  // object is the source of truth and the string is derived, so the two forms
  // cannot drift apart.
  //
  // Note this changed the <header>'s own style *attribute* from the literal
  // string setAttribute() stored to the browser-normalised form React produces
  // (`top:0` -> `top: 0px`, box-shadow reordered, spaces after every colon).
  // site-mobile.css matches inline styles by substring — `[style*="padding:
  // 32px"]` and friends — so that form matters. Verified: no such rule keys on
  // anything in HEADER_STYLE, and the header's computed style is byte-identical
  // before and after at 390px and 1200px. The normalised form is also what the
  // rest of the DC-rendered page emits, so those selectors and this element now
  // agree. Only the <header> itself is affected — markup() below is still
  // literal HTML, so every child keeps the exact unspaced style string it had.
  const HEADER_STYLE = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "32px",
    padding: "12px 48px",
    background: "var(--bg-header,#2D5C49)",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
  };

  const styleString = (o) =>
    Object.entries(o)
      .map(
        ([k, v]) => `${k.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase())}:${v}`,
      )
      .join(";");

  const esc = (s) =>
    String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const markup = (active, ctaHref, ctaLabel, ctaClass) => `
<a href="/" style="display:flex;align-items:center;gap:4px;text-decoration:none"><div style="display:flex;align-items:center;justify-content:center;width:48px;height:48px;border-radius:50%;background:radial-gradient(circle,rgba(196,120,74,0.18),rgba(196,120,74,0) 70%)"><img src="assets/almayya-mark-white.png" style="height:36px"></div><span style="font-family:var(--font-serif-display);font-size:26px;letter-spacing:0.02em;color:var(--ivory);font-weight:600">Almaya <em style="font-style:italic;color:var(--ivory)">Admissions</em></span></a>
<nav class="nav-links" style="display:flex;gap:30px;align-items:center;flex:1;justify-content:center">
${NAV.map((n) => `<a href="${esc(n.href)}" style="${n.key === active ? NAV_LINK_ACTIVE : NAV_LINK}">${esc(n.label)}</a>`).join("\n")}
</nav>
<div class="am-hdr-cta-wrap" style="display:flex;gap:12px">
<a href="${esc(ctaHref)}"${ctaClass ? ` class="${esc(ctaClass)}"` : ""}><button class="am-hdr-cta">${esc(ctaLabel)}</button></a>
</div>`;

  // `{{ hole }}` values arrive verbatim if the page's Component has not
  // produced them yet — treat an unresolved hole as empty.
  const settled = (v) => {
    const s = String(v || "");
    return s.includes("{{") ? "" : s;
  };

  injectCss();

  // The React component. Pages pass their options as `data-*` attributes, and
  // collectProps() in support.js hands `data-*` / `aria-*` through to x-import
  // components verbatim instead of camel-casing them — so they are read here
  // exactly as they are written in the page.
  function SiteHeader(props) {
    const active = settled(props["data-active"]);
    const ctaHref = String(props["data-cta-href"] || "") || BOOKING_URL;
    const ctaLabel = String(props["data-cta-label"] || "") || "Get Matched";
    const ctaClass = settled(props["data-cta-class"]);
    const extra = settled(props["data-header-class"]);

    return React.createElement("header", {
      className: extra,
      style: HEADER_STYLE,
      // React writes innerHTML only when this string actually changes, so an
      // unrelated re-render leaves the subtree — including the .am-navtoggle
      // that site-mobile-nav.js appends — untouched. Institutions flips
      // data-header-class on every scroll tick, so this matters in practice.
      // It is the same guard the legacy element below implements by hand as
      // `_sig`; here the reconciler does it for us.
      dangerouslySetInnerHTML: {
        __html: markup(active, ctaHref, ctaLabel, ctaClass),
      },
    });
  }

  window.SiteHeader = SiteHeader;

  // --- transitional shim -------------------------------------------------
  // Neither this file nor the pages are versioned assets, so a browser can
  // hold cached HTML that still says component-from-global-scope="site-header"
  // while loading this newer script. Without the custom element still
  // registered, resolveGlobal() would poll, warn, and render nothing — a page
  // with no header at all. Keep this until the renamed pages have been live
  // long enough to age out of caches, then delete this block and the
  // `site-header{display:contents}` rule in CSS above.
  class SiteHeaderElement extends HTMLElement {
    static get observedAttributes() {
      return [
        "data-active",
        "data-header-class",
        "data-cta-href",
        "data-cta-label",
        "data-cta-class",
      ];
    }

    connectedCallback() {
      injectCss();
      this.render();
    }

    attributeChangedCallback() {
      if (this.isConnected) this.render();
    }

    render() {
      const active = this.getAttribute("data-active") || "";
      const ctaHref = this.getAttribute("data-cta-href") || BOOKING_URL;
      const ctaLabel = this.getAttribute("data-cta-label") || "Get Matched";
      const ctaClass = this.getAttribute("data-cta-class") || "";
      const extra = settled(this.getAttribute("data-header-class"));

      let header = this._header;
      if (!header || !header.isConnected || header.parentNode !== this) {
        header = this._header = document.createElement("header");
        header.setAttribute("style", styleString(HEADER_STYLE));
        this.textContent = "";
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

  if (!customElements.get("site-header"))
    customElements.define("site-header", SiteHeaderElement);
})();
