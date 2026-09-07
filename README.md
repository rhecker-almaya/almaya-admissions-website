# Almaya Admissions — website

Live site: https://almayaadmissions.com (hosted on Netlify)

## What this is

A **static site**. No build step, no npm install, no framework toolchain. Every
page is a self-contained HTML file that runs in the browser. You can open any
`.html` file directly, or serve the folder:

```bash
python3 -m http.server 8080
# then visit http://localhost:8080
```

To deploy: drag this folder into Netlify, or connect this repo to Netlify with
**build command: (none)** and **publish directory: `/`** (repo root).

## Pages

| File | URL / purpose |
| --- | --- |
| `index.html` | Homepage, served at `/`. Every logo links here |
| `Why Almaya.dc.html` | Why Almaya |
| `How It Works.dc.html` | How it works |
| `Tutors.dc.html` | Advisor directory |
| `About Us.dc.html` | About / founders |
| `Institutions.dc.html` | Schools & orgs |
| `Jon Booking.dc.html` | One-off booking page |
| `<Name> Profile.dc.html` | 11 advisor profile pages (Gabriel Nagel, Arjun Jaswal, Samantha Lofman, Neva Hidajat, Razi Hecker, Eitan Ginsburg, Joseph Schlesinger, Jacob Feit Mann, Arianna Zarka, Sarah Rosen, Jonathan Mizrahi) |

## Shared files

| File | What it does |
| --- | --- |
| `support.js` | Runtime that renders the `<x-dc>` markup in each page. **Required by every page. Do not delete or rename.** |
| `ds-base.js` | Loads the design-system stylesheets and component bundle from `_ds/` |
| `_ds/almayya-design-system-.../` | The Almaya design system: CSS custom-property tokens (`tokens/colors.css`, `typography.css`, `spacing.css`, `fonts.css`) plus a JS component bundle (`Button`, `Card`, `Tag`, etc.) |
| `site-mobile.css`, `site-mobile-nav.js` | Shared mobile nav + responsive overrides |
| `booking-modal.js` | Shared "Get Matched" consultation modal. Any link whose `href` is the booking URL opens it in an overlay instead of navigating |
| `wise-booking.js` | Custom booking widget on advisor profiles — talks to the Wise API. **See `BOOKING.md` before touching this.** |
| `image-slot.js` | Drag-and-drop image placeholder component |
| `assets/` | Logos, advisor headshots (`assets/experts/`), team photos, school logos, textures, OG preview image |
| `_redirects` | Netlify redirect rules |

## How a page is structured

Each page follows the same shape:

```html
<script src="./support.js"></script>   <!-- runtime -->
<x-dc>
  <helmet>  <!-- <link>/<script>/<style>/<meta> — loads ds-base.js, fonts, page CSS -->
  ...page markup, styled with inline styles + var(--token) values...
</x-dc>
<script type="text/x-dc" data-dc-script>
  class Component extends DCLogic { ... }   <!-- page JS: scroll reveals, modals, counters -->
</script>
```

Rules that matter if you edit these files:

- **Styling is inline `style="..."` attributes**, using design tokens
  (`var(--forest-900)`, `var(--copper)`, `var(--font-serif-display)`, etc.).
  There are no utility classes. Token values live in `_ds/.../tokens/colors.css`.
- `style-hover="..."` / `style-active="..."` are supported alongside `style`.
- `{{ someName }}` holes read values returned by `renderVals()` in the page's
  `Component` class. They are **dotted lookups only** — no expressions.
- `<x-import component-from-global-scope="AlmayyaDesignSystem_fd8d10.Button" ...>`
  mounts a design-system component.
- Only `<script>` tags inside `<helmet>` run reliably.

## Brand tokens (quick reference)

| Token | Value | Use |
| --- | --- | --- |
| `--forest-900` | `#17392F` | Dark sections: hero, footer bands |
| `--ivory` | `#F7F3EA` | Light sections, text on dark |
| `--copper` | `#B85C3D` | **Only** accent / primary CTA color |
| `--sage`, `--sand` | — | Secondary: tags, quiet bands |
| `--charcoal` | — | Body text on light backgrounds |
| `--font-serif-display` | Cormorant | Wordmark, display headlines |
| body sans | Jost | Everything else |

Radii 4px (buttons/inputs/cards) to 8–12px (image + feature cards). Section
padding 44–64px. Flat color fields — no gradients, no textures behind text.

## Booking

Advisor profile pages embed a custom booking widget (`wise-booking.js`) that
reads live session data from the Wise public API and books in Almaya's own UI.

**Read `BOOKING.md`.** It documents the required API headers, the slot-offset
decoding, why instructor id comes from the availability response and not the
course owner, and the `data-payments="on"` flag that switches the last step from
"email info@almayaadmissions.com" to real Stripe checkout. Online payments are
currently **off** in the Wise account, so the widget deliberately does not
create paid bookings yet.

## Known quirks / good first tasks

1. **Filenames contain spaces and a `.dc.html` extension**, so live URLs look
   like `/Neva%20Hidajat%20Profile.dc.html`. Recommended: rename to slugs
   (`advisors/neva-hidajat.html`) and add redirects from the old paths in
   `_redirects` so existing links keep working, e.g.

   ```
   /Neva%20Hidajat%20Profile.dc.html  /advisors/neva-hidajat  301
   ```

   If you rename files, update the `<a href>` links across all pages — they are
   plain relative links.
2. **Logo artwork reads "ALMAYYA" (two Ys); all copy says "Almaya" (one Y).**
   The image files in `assets/` are the client's supplied artwork. Needs updated
   logo files from the client.
3. **Icons are hotlinked to `unpkg.com/lucide-static@0.462.0`.** Should be
   vendored locally so the site does not depend on a third-party CDN.
4. **Fonts** (Cormorant, Jost) are Google Fonts substitutions, not licensed
   brand originals.
5. **Jonathan Mizrahi's profile has no booking course URL yet**, and Arianna
   Zarka's Wise course is missing a session duration, so her slot queries fail.
   Both are Wise-account config, not code.
6. **Two test bookings exist in the Wise account** ("Test Verifier" and
   "ZZ IGNORE Verifier Test") and should be deleted before real traffic.

## Rebuilding in a framework

If the plan is to move this into React/Next/Astro rather than maintain the
static files: treat these HTML pages as **high-fidelity design references**.
Colors, type, spacing, and copy are final. Recreate the layouts using the
target framework's patterns, port the tokens in `_ds/.../tokens/` to whatever
theming system it uses, and port `wise-booking.js` as a component using
`BOOKING.md` as the API spec.
