# Almaya site — working rules

Root folder is the source of truth and the deploy copy. No other copies.

Shared pieces — edit these, not individual pages:
- `site-tracking.js` — Meta + OpenAI + Reddit pixels. Conversion: `amTrack.booking()` on Booking Confirmed.
- `site-header.js` — header/nav (`SiteHeader`).
- `site-footer.js` — booking section + footer (`SiteFooter`; `data-book="off"`, `data-variant="dark"`, `data-cta-label`).
- `booking-modal.js` — booking pop-up (all Get Matched / booking links).
- `tutors.js` — all advisor data + profile layout. One page renders every advisor: `Profile.dc.html?a=<slug>`.
- `site.css` — mobile + button styles.

Pages: index.html (main), Landing Page v2 (/get-started), Tutors, Profile, About Us, Why Almaya, How It Works, Institutions, Essay Workshop (v1 + v2), Booking Confirmed, Workshop Confirmed.
Advisor names: first name + last initial (e.g. Benji R.).

Delivery: give the user a zip of ONLY the changed files (an `update-YYYY-MM-DD/` folder), plus a list of files to delete if any.
