// Almaya — shared page bottom: the "Book your free consultation" section + footer.
//
// Every page used to carry its own copy of both. Now each page ends with:
//   <x-import component-from-global-scope="SiteFooter" hint-size="100%,420px"></x-import>
//
// Attributes (all optional):
//   data-book="off"       hide the booking section (pages that are already a booking/thank-you page)
//   data-variant="dark"   dark forest footer with large headline (Get Started / Landing Page v2)
//   data-cta-label        override the footer link text
//
// Same pattern as site-header.js: a React function component on window, markup
// set once via innerHTML. Style strings use the spaced "prop: value" form because
// site-mobile.css matches inline styles by substring.
(() => {
  if (window.__amSiteFooter) return;
  window.__amSiteFooter = true;

  const BOOKING_URL = 'https://api.leadconnectorhq.com/widget/booking/waXfk5QQ8VhoYMOXXoRN';
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const settled = v => { const s = String(v || ''); return s.includes('{{') ? '' : s; };

  const BOOK_SECTION = `<section id="book" data-screen-label="Book a consultation" style="background: var(--ivory); padding: 88px 24px; scroll-margin-top: 72px">
  <div style="max-width: 880px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 14px; text-align: center">
    <div style="font-size: 12px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--copper)">Free · 30 minutes</div>
    <h2 style="font-family: var(--font-serif-display); font-weight: 500; font-size: clamp(34px, 5vw, 52px); line-height: 1.05; color: var(--forest-900); margin: 0; text-wrap: balance">Book your free <em>consultation</em></h2>
    <p style="font-size: 17px; line-height: 1.6; color: var(--text-muted); margin: 0; max-width: 540px; text-wrap: pretty">Talk with Razi or Eitan, our co-founders, about your student and goals. We'll personally match you with the right advisors.</p>
    <button type="button" data-am-reveal-booking="" class="am-btn am-btn--primary am-btn--lg" style="margin-top: 10px">Pick a time</button>
  </div>
</section>`;

  const FOOTER = ctaLabel => `<footer class="site-footer" style="background: var(--copper-100); padding: 14px 48px">
<div style="max-width: 1160px; margin: 0 auto">
<div class="footer-top" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; padding-bottom: 14px; border-bottom: 1px solid rgba(59,45,31,0.14)">
<div>
<img src="assets/almayya-mark.png" style="height: 22px; margin-bottom: 4px">
<div style="font-size: 13px; color: var(--text-muted)">Expert guidance. Personally matched.</div>
</div>
<div class="footer-stats" style="display: flex; gap: 32px; flex-wrap: wrap">
<div style="display: flex; gap: 8px; align-items: center"><img src="https://unpkg.com/lucide-static@0.462.0/icons/landmark.svg" style="width: 16px; height: 16px"><span style="color: var(--forest-900); font-size: 14px">100+ colleges represented</span></div>
<div style="display: flex; gap: 8px; align-items: center"><img src="https://unpkg.com/lucide-static@0.462.0/icons/users.svg" style="width: 16px; height: 16px"><span style="color: var(--forest-900); font-size: 14px">500+ families supported</span></div>
<div style="display: flex; gap: 8px; align-items: center"><img src="https://unpkg.com/lucide-static@0.462.0/icons/star.svg" style="width: 16px; height: 16px"><span style="color: var(--forest-900); font-size: 14px">5/5 average rating</span></div>
</div>
<a data-am-popup="" href="${BOOKING_URL}" style="color: var(--forest-900); font-size: 14px; font-weight: 600">${esc(ctaLabel || "Get Matched — It's Free →")}</a>
</div>
<div style="display: flex; justify-content: space-between; align-items: center; padding-top: 10px; flex-wrap: wrap; gap: 12px">
<div style="font-size: 12px; color: var(--text-muted)">© Almaya Admissions. All rights reserved.</div>
<div style="display: flex; gap: 16px">
<a href="https://www.instagram.com/almayaadmissions/" target="_blank" rel="noopener" aria-label="Almaya on Instagram" style="color: var(--forest-900)"><img src="https://unpkg.com/lucide-static@0.462.0/icons/instagram.svg" style="width: 18px; height: 18px"></a>
<a href="https://www.facebook.com/profile.php?id=61594546239186" target="_blank" rel="noopener" aria-label="Almaya on Facebook" style="color: var(--forest-900)"><img src="https://unpkg.com/lucide-static@0.462.0/icons/facebook.svg" style="width: 18px; height: 18px"></a>
<a href="https://www.linkedin.com/company/almaya-admissions/" target="_blank" rel="noopener" aria-label="Almaya on LinkedIn" style="color: var(--forest-900)"><img src="https://unpkg.com/lucide-static@0.462.0/icons/linkedin.svg" style="width: 18px; height: 18px"></a>
</div>
</div>
</div>
</footer>`;

  const FOOTER_DARK = ctaLabel => `<footer class="site-footer ft-compact" style="background: var(--forest-800); padding: 36px 48px 18px">
<div style="max-width: 1160px; margin: 0 auto; display: flex; flex-direction: column; gap: 22px">
<div class="ft-top" style="display: flex; justify-content: space-between; align-items: center; gap: 32px; flex-wrap: wrap">
<h2 style="flex: 1 1 520px; font-family: var(--font-serif-display); font-weight: 500; font-size: clamp(34px, 4vw, 52px); line-height: 1.05; color: var(--ivory); margin: 0; text-wrap: balance">Your dream college deserves <em style="color: #E07A4F">the right mentor.</em></h2>
<a data-am-popup="" href="${BOOKING_URL}" class="am-btn am-btn--primary am-btn--lg">${esc(ctaLabel || "Get matched today")}</a>
</div>
<div class="ft-bottom" style="display: flex; justify-content: space-between; align-items: center; gap: 20px; flex-wrap: wrap; padding-top: 18px; border-top: 1px solid var(--border-inverse); font-size: 13px; color: var(--text-muted-inverse)">
<div style="display: flex; align-items: center; gap: 12px"><img src="assets/almayya-mark-white.png" alt="Almaya" style="height: 22px" /><span>Expert guidance. Personally matched.</span></div>
<div style="display: flex; gap: 22px; flex-wrap: wrap"><span>100+ colleges represented</span><span>500+ families supported</span><span>5/5 average rating</span></div>
<div>© Almaya Admissions</div>
<div style="display: flex; gap: 16px">
<a href="https://www.instagram.com/almayaadmissions/" target="_blank" rel="noopener" aria-label="Almaya on Instagram" style="color: var(--ivory)"><img
src="https://unpkg.com/lucide-static@0.462.0/icons/instagram.svg"
style="width: 18px; height: 18px; filter: invert(1)"/></a>
<a href="https://www.facebook.com/profile.php?id=61594546239186" target="_blank" rel="noopener" aria-label="Almaya on Facebook" style="color: var(--ivory)"><img
src="https://unpkg.com/lucide-static@0.462.0/icons/facebook.svg"
style="width: 18px; height: 18px; filter: invert(1)"/></a>
<a href="https://www.linkedin.com/company/almaya-admissions/" target="_blank" rel="noopener" aria-label="Almaya on LinkedIn" style="color: var(--ivory)"><img
src="https://unpkg.com/lucide-static@0.462.0/icons/linkedin.svg"
style="width: 18px; height: 18px; filter: invert(1)"/></a>
</div>
</div>
</div>
</footer>`;

  function SiteFooter(props) {
    const showBook = settled(props['data-book']) !== 'off';
    const dark = settled(props['data-variant']) === 'dark';
    const label = settled(props['data-cta-label']);
    const html = (showBook ? BOOK_SECTION : '') + (dark ? FOOTER_DARK(label) : FOOTER(label));
    return React.createElement('div', { style: { display: 'contents' }, dangerouslySetInnerHTML: { __html: html } });
  }
  window.SiteFooter = SiteFooter;
})();
