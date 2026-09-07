# Almaya Admissions Website — Fix List

Derived from [[Almaya Admissions Website Feedback]], ordered by **impact per minute**.
Copy rewrites are excluded per scope; items blocked on Eitan/Razi are parked at the bottom.

Estimates assume familiarity with the codebase after the first two items. Running total
in the right column — Block A + B is roughly a 3-hour session.

**Key architectural facts that drive this ordering:**

- Colors and fonts are **centralized tokens** (`_ds/almayya-design-system-fd8d1095-.../tokens/`). A palette or font change is a one-file edit that propagates site-wide.
- Font *sizes* are **not** tokenized — 30 distinct hardcoded px values across the pages.
- `site-mobile.css` is loaded by every page and already overrides inline styles via `[style*="font-size: 13px"] { … !important }`. **This is the main lever**: it turns "edit 20 files" into "edit 1 file" for anything expressible in CSS.
- Header and footer markup is duplicated in all 20 pages. Style changes → 1 file. Markup changes → 20 files.
- No build step, no templating. Netlify, publish dir `/`.

---

## Block A — Broken behavior (~2 hrs)

These are things a visitor actually hits. Almost all are minutes each.

### A1. De-duplicate the homepage · 10 min · *do first*

`index.html` and `LandingPage.dc.html` are **byte-identical** (65,266 bytes each). All 20 logo
links point at `LandingPage.dc.html`; nothing links to `/`. So a visitor lands on `/`, clicks
the logo, and gets moved to `almayaadmissions.com/LandingPage.dc.html` — a scruffy URL serving
duplicate content Google will index twice.

More practically: **every homepage item below is currently two edits instead of one.** Fixing
this first halves the cost of A2, A7, A9, B1, C1, C2 and C3.

- Point the 20 logo `href`s at `/`
- Add `/LandingPage.dc.html  /  301!` to `_redirects`
- Delete `LandingPage.dc.html`

*(Cheap alternative if you'd rather not touch 20 files: just `sed` every homepage change into
both files. Zero cost, but leaves the duplicate URL live.)*

### A2. "Get Matched" should open the booking modal · 30 min

Your #1 note. **The modal already exists and works** — `index.html:502`, a `<sc-if
value="{{ bookingOpen }}">` overlay wrapping an iframe to
`learn.almayaadmissions.com/book/free-consultation`, with backdrop-click and Escape handling
already wired (`onOpenBooking` / `onCloseBooking`, `index.html:594-597`). Only the "Book a Time
Here" button inside `#get-started` calls it.

Every "Get Matched" button is a dumb anchor:

| Page | Lines | Currently does |
|---|---|---|
| `index.html` | 140, 151, 207, 319, 393 | `href="#get-started"` — scrolls |
| `Why Almaya.dc.html` | 64, 76, 164, 181 | → `Free Consultation.dc.html` |
| `How It Works.dc.html` | 84, 95, 117, 155, 198 | → `Free Consultation.dc.html` |
| Tutors, About Us, profiles | — | → `Free Consultation.dc.html` |

- **Homepage: free.** Swap `href="#get-started"` → `onClick="{{ onOpenBooking }}"` on all five.
- **Why Almaya + How It Works:** copy the ~20-line `<sc-if>` block and the three handlers into
  each page's component class. This also resolves your Why Almaya note — the buttons stop
  behaving differently from page to page.

> `wise-booking.js` is *not* the right tool here — it's a Wise-API `<wise-booking>` custom element
> used inline on advisor profiles, with no open function. Don't touch it (see `BOOKING.md`).

### A3. Header active-link contrast · 10 min

Worse than "not enough contrast" — the indicator is **inverted**:

| State | Color | Contrast on header `#2D5C49` |
|---|---|---|
| **Current page** | `--copper` `#B85C3D` | **1.7 : 1** |
| Other pages | `--text-muted-inverse` `#B8C6BE` | 4.3 : 1 |

The "you are here" link is 2.5× *less* legible than the ones that aren't selected. Needs a light
copper tint, which doesn't exist yet — `--copper` only has darker variants (`--copper-600`).

- Add `--copper-300` (something around `#E0A183`) to `tokens/colors.css`
- Set the 5 active links to it: `Why Almaya:57`, `How It Works:78`, `Tutors:72`, `About Us:75`, `Institutions:109`
- Better: one shared `.nav-links a[aria-current="page"]` rule in `site-mobile.css` and mark the links — kills the hand-maintained-per-page problem permanently

Also worth fixing while you're here: the header background `#2D5C49` is **hardcoded in 9 pages and
matches no token** (`--forest-800` is `#1E4A3B`).

### A4. Mobile header CTA wraps to two lines · 5 min

Root cause is a selector that JS silently invalidates. `site-mobile.css:94-96` protects the CTA via
`header > div:last-child { flex-shrink: 0 }`, but `site-mobile-nav.js:79` appends the hamburger to
the header — so `div.am-navtoggle` *becomes* `:last-child` and the CTA wrapper loses both
`flex-shrink:0` and `white-space:nowrap`.

One selector change (`:not(.am-navtoggle)`, or target the CTA wrapper by class). Fixes all 20 pages.

### A5. Advisors page: 5-across grid on mobile · 5 min

`Tutors.dc.html:152` — the "How We Vet" grid is `repeat(5,1fr)` and **never collapses on mobile**.
`index.html:100` has the `.vet-grid{grid-template-columns:1fr!important}` rule; `Tutors.dc.html`
is missing it, and `site-mobile.css`'s generic collapse list covers `repeat(2/3/4` but not
`repeat(5`. Add the rule (or add `repeat(5` to the shared list).

*Not in your notes — found while looking at the repeated process sections. It's outright broken.*

### A6. Institutions: sticky card overlaps the header on mobile · 5 min

Your "a) broken b) unnecessary" card. `Institutions.dc.html:177` is
`position:sticky; top:32px; height:260px`, and `.sticky-panel` has **no mobile rule at all** —
the page's 860px block (`:85-99`) lists a dozen selectors but omits `.hiw-grid` and
`.sticky-panel`. Once the grid collapses, a 260px card pins at `top:32px` *underneath* a 72px
sticky header, then floats over ~2,240px of content below.

Add `.sticky-panel{position:static;height:auto}` and `.hiw-grid{grid-template-columns:1fr}` to
that block. (If you agree it's unnecessary, deleting it outright is the same 5 minutes.)

### A7. Institutions: header CTA overflows the screen · 5 min

`Institutions.dc.html:111-113` — "Talk to Us About Our Workshop" with `flex-shrink:0` +
`white-space:nowrap` (`:54-55`), no mobile rule shortening it. At 375px the label + 44px hamburger
+ logo simply don't fit.

Cheapest fix: **drop the header CTA below 900px** — the mobile drawer already carries a copy
(`site-mobile-nav.js:41-48`), so nothing is lost. Shortening the label is a copy change; flag it.

### A8. Button height/width mismatch · 15 min

Affects Why Almaya (`:76/77`, `:164/165`), How It Works (`:95/96`, `:155`), and index (`:281`, `:320`).

Cause: "Get Matched" is a design-system `<button>` with **no height** — `padding:16px 32px` +
18px font ≈ **53.6px**. "Browse Advisors" is a hand-rolled `<a>` with a hard `height:52px` *plus* a
`1.5px` border the button doesn't have. Three different hardcoded heights are in play site-wide
(47px, 52px, and the button's implicit ~44/54px).

On mobile the widths diverge for the same reason: `site-mobile.css:61` forces
`a[style*="height: 52px"]` to `width:100%`, but the DS button has no inline height to match on.

Fix once in `site-mobile.css` — normalize both to a shared height and make both full-width on
mobile. `hint-size="220px,52px"` is a design-tool placeholder and does nothing at runtime, so
don't trust it.

### A9. Marquee seam jump + blank top row · 20 min

Diagnosed exactly. `.marquee-track` is `display:flex; gap:44px` and the animation runs
`translateX(0 → -50%)`. Track width is `26·item + 25·gap`, but 50% of that moves
`13·item + 12.5·gap` — **22px short every cycle**. That's the jolt.

- Fix: `gap:0` + `margin-right:44px` on the spans (then `-50%` is exact). CSS at `index.html:36-42`.
- **Blank space in the top row:** rows are only duplicated 2×. If one copy is narrower than the
  viewport, 2× can't fill the screen. Duplicate the short rows 3–4×.
- **Testimonials are worse:** `index.html:336-344` has **9 cards for 6 unique testimonials**, so
  `-50%` lands mid-card and snaps every 70s. Needs a full 12.

### A10. Hover-expand descriptions · 10 min

Your "distracting, not helpful" note — and there's a second problem you couldn't see on mobile:
**the text is permanently invisible on touch devices**, because it's pure CSS `:hover` with no
touch equivalent.

- `index.html:55` — `.svc-card:hover .svc-desc{max-height:120px}` ("Support for Every Stage")
- `About Us.dc.html:54-55` — same pattern on `.au-crit-desc` (the 4-item section)

Make them always-visible (or delete the descriptions). Note the `style-hover="…"` attributes on
those cards are **dead code** — nothing in any JS implements them.

### A11. Testimonials: swap desktop and mobile behavior · 10 min

Nice accident here — **both components you asked for already exist, just on the wrong breakpoints.**

- `.testi-desktop` (`index.html:335`) is the auto-scrolling marquee you want gone on PC
- `.testi-mobile` (`index.html:327`) is a 6-slide component you want *more* of on desktop

Flipping the `max-width:860px` rule at `index.html:92-93` gets you most of the way in ~10 minutes.
Adding real prev/next arrows on desktop (it currently cross-fades on a timer rather than on click)
is another ~30 min — worth it, since click-through was the actual ask.

---

## Block B — Global polish (~1 hr 40)

Cheap because of the token system. Each of these changes the whole site at once.

### B1. Bump the desktop type scale · 20 min

"Text seems small" is correct and measurable — body copy clusters at **13/14/15px**, and there are
30 distinct hardcoded sizes site-wide (188× `15px`, 150× `13px`, 145× `14px`, 107× `12px`).

Sizes are inline, so they can't be re-tokenized cheaply — but `site-mobile.css` already proves the
pattern. Add a `@media (min-width: 901px)` block using the same attribute selectors:
`12px→13.5`, `13→14.5`, `14→15.5`, `15→16.5`, `16→17`. One block, ~670 elements, then an eyeball pass.

> Watch the file's own warning (lines 1-4): React serializes styles *with* a space, so selectors
> must be `[style*="font-size: 15px"]`, not `font-size:15px`.

### B2. Delete `image-slot.js` · 5 min

65KB loaded by 9 pages and instantiated by **zero** — I grepped, there is not a single
`<image-slot>` element. It's a leftover authoring scaffold. Remove the 9 script tags and the file.
No behavior change.

*Not in your notes — free speed.*

### B3. Swap the orange · 40 min

Your instinct is right and the change is cheap: colors are tokenized, with only ~34 stray hexes
site-wide. Edit `tokens/colors.css:12-14` and it propagates everywhere.

- Replace `--copper` `#B85C3D` with something less playful — a deeper brick, burgundy, or a warm bronze
- **Add a light tint** for use on dark grounds (this is what A3 and the badges are missing)
- Clean up the stray hexes: `#2D5C49` (header, 9 pages), and 16 in `Why Almaya.dc.html`
  (`#173b2c`, `#8C2F1F`, `#96492f`, `#C9C2B6`, `#e8dcc8`, `#FBEDEB`)
- Note `Tutors.dc.html:224-229` uses `var(--copper-600, #96492f)` — the fallback disagrees with
  the actual token value `#A14E32`

### B4. Change the sans · 20 min

`tokens/fonts.css` is a single `@import` line and `typography.css:2-3` holds the stacks. Swapping
Jost is a two-line change.

While you're in there: the fonts are `@import`ed inside a stylesheet that is itself `@import`ed —
**three serialized round-trips before any text renders.** Moving to a `<link>` + `preconnect` in
the helmet is a real perf win for ~5 min.

### B5. Advisor tier badge contrast · 15 min

Single source at `Tutors.dc.html:224-229` (`tierMeta`). Senior Advisor is ivory on sage
(`#F7F3EA` on `#91A18F`) ≈ **2.2 : 1** — that's your "contrast isn't good" note.

Your point about Lead standing out more than Principal is a **hierarchy inversion**: Lead gets
copper (the loudest color on the site) while Principal — the top tier — gets forest green. If the
tiers are meant to read as a ladder, the accent belongs on Principal.

Note the badges are duplicated with *different* values at `index.html:254/263/272`, and profile
pages use a third style entirely. Worth unifying while the values are in front of you.

---

## Block C — Structural cuts (~1 hr 40)

You have authority here. These are the changes that most reduce the vibe-coded feel.

### C1. Delete the homepage "How It Works" section · 15 min

`index.html:179-209`, self-contained. Your call was right — the bottom-of-page section covers the
same ground more cleanly. Also orphans `stepGridRef` (415, 546, 588) and the `.step-box` CSS
(37-40, plus `.hiw-heading` at 128); clean those up or they're dead weight.

Bonus: `index.html:438-486` contains a full copy of the `playBubbleFlight` animation that has **no
markup left to act on** — it silently no-ops. Delete it too.

### C2. Merge "The Right Advisor" into "Support for Every Stage" · 20 min

`index.html:211-233` and `285-323`. Both are icon-card grids making adjacent arguments; keeping
both is what makes the page feel padded.

Careful with spacing (your note): `index.html:280` uses `margin-bottom:-16px` to pull the next
section up, and Services at `:285` has a matching `padding:16px 48px 52px`. They're a pair —
change one and the rhythm breaks. That negative margin is also the "spacing between Featured
Advisors and its neighbors" issue.

### C3. Institutions: delete the family testimonials · 5 min

`Institutions.dc.html:308-318`. You're right that they don't belong on a schools page. Straight
deletion. (Replacing them with a list of partner high schools is a content ask — parked below.)

### C4. Comparison table on mobile · 40 min

Only the Almaya column shows because `Why Almaya.dc.html:44-48` **deliberately hides columns 2
and 3** below 860px. That guts the entire point of a comparison table.

It's not a `<table>` — it's 7 sibling `.cmp-row` divs, each its own independent grid
(`:82-132`), so there's no free column-aware fallback. Cheapest real fix is a horizontally
scrollable wrapper with the label column sticky.

While in there: the checkmarks are plain `✓` characters at `color:var(--sage)` — grey-green and
subtle, exactly as you described. Making them big/bright means editing ~20 individual cells
inline, or adding one `.cmp-row > div` rule. Do the latter.

### C5. Institutions hero buttons won't stack cleanly · 5 min

`Institutions.dc.html:125-129` — nothing stacks them but `flex-wrap:wrap`, so below ~470px they
drop to two lines at natural width rather than going full-width. The generic mobile rule doesn't
catch them because the size lives in an `x-import hint-size` attribute, not an inline `height`.
Needs one explicit rule on that container.

### C6. Unify the repeated process sections · 30 min

Your "if it's going to repeat, at least use the same one" note. Confirmed: step/process explainers
appear on **5 pages** — `index.html`, `LandingPage`, `How It Works`, `Tutors`, `Institutions` —
in at least three different implementations (`.step-box`, `.vet-step`, `.hiw-step`). A5 above is a
direct symptom of that drift.

There's no templating layer, so unifying means a shared JS-injected block, following the pattern
`site-mobile-nav.js` already establishes.

### C7. How It Works: the card-flight animation · 30 min to remove

`How It Works.dc.html:236-275` — a hand-rolled FLIP animation that clones each `.bubble` to
`document.body` as `position:fixed` and interpolates position over 850ms with a 130ms stagger,
driven by a capture-phase scroll listener.

It's fragile by construction: clones read `getBoundingClientRect()` every frame, so scrolling
mid-flight makes them drift, and it still runs after the grid collapses to one column on mobile.
That's why cards "float into step 3 before you can see what was there" — the trigger is scroll
position, not visibility.

Removing it is straightforward. Making it *good* is a bigger job than your budget allows.

---

## Parked — needs Eitan/Razi, or is a copy change

- **Testimonial names.** The markup already carries attributions ("— Parent of a Brown '28 Admit",
  "— Student, on Neva"). Real names are a client ask, not a code fix — and probably needs consent.
- **Consolidating the four About-ish pages.** Structural, but it's fundamentally an editorial call
  about what each page is *for*. Worth a 15-minute conversation before any code.
- **About Us "Book Eitan Now" / "Book Razi Now"** (`:113`, `:131`) — both point at the same URL as
  the adjacent "View Profile" link, so "Book" doesn't book anything. Matches your note that this
  page shouldn't be selling their personal services. Confirm intent before deleting.
- **The logo.** Two problems: the lockup spacing/italic you flagged, and — separately — **the
  artwork reads "ALMAYYA" (two Ys) while all copy says "Almaya" (one Y)**. Needs new files from
  the client either way.
- **"Institutions" page name, "Part Two: The Matching", "Before you reach out", "Questions Schools
  Ask", "See the Workshop", em dashes** — all copy.
- **The Problem section: keep the calculator *or* the figures.** Both are present
  (`Institutions.dc.html:143-149` figures, `:152-166` calculator). Deleting one is 5 minutes;
  deciding which is the client's call.

## Also found, not in your notes

- **Third-party runtime dependencies, none vendored.** `support.js` fetches React 18.3.1 from
  `unpkg.com` on **every page load** — if unpkg is down or blocked, the site renders blank, not
  degraded. Icons are also hotlinked to `unpkg.com/lucide-static@0.462.0` across all 20 pages.
  Vendoring both is ~30 min and removes a single point of failure on a site that's about to launch.
- **Breakpoint dead zone.** Pages hide `.nav-links` at 860px; `site-mobile.css:109` shows the
  hamburger at 900px. Between 860–900px there is **no navigation at all**. ~2 min to align.
- **FAQ answers clip.** `Institutions.dc.html:78-81` — `.faq-a.open{max-height:240px}` will cut off
  longer answers on narrow screens.
- Pages load the design system two different ways; 17 of them fetch the token files twice.

---

## Change log

Appended as work lands. Line numbers elsewhere in this doc are from the original
audit and are **not** updated as files shift — see the drift note under A2.

### A1 — De-duplicate the homepage ✅ *(committed)*

- Repointed the logo `href` in all 19 remaining pages from `LandingPage.dc.html` → `/`
- Deleted `LandingPage.dc.html` (byte-identical to `index.html`, md5-verified)
- `_redirects`: added `/LandingPage.dc.html  /  301!`
- `README.md`: dropped the now-false "index.html is a duplicate" quirk and the deleted page's row

### A2 — "Get Matched" opens the booking modal ✅ *(uncommitted)*

Done with **one shared `booking-modal.js`** rather than 18 per-page copies. Triggers are
matched by `href`, not a class or data attribute, because `site-mobile-nav.js:44` builds the
mobile drawer CTA by copying the header CTA's href and nothing else — so the drawer works with
zero changes to that file. The links keep a real working `href`, so they still go somewhere if
JS fails. The overlay is appended to `<body>`, outside `<x-dc>`, so a DC re-render can't strip it.

- New `booking-modal.js` — overlay, delegated click handler, Escape / backdrop / ✕ to close,
  scroll lock, focus restore. Modified clicks (⌘/ctrl/middle) pass through.
- Deleted `Free Consultation.dc.html`; repointed its ~48 inbound links across 18 pages
- All 18 pages load the script in their helmet
- `index.html`: the 5 `href="#get-started"` buttons now open the modal instead of scrolling.
  Its bespoke `<sc-if>` modal, `bookingOpen` state, Escape listener and 3 handlers removed —
  one implementation site-wide, not two.
- `_redirects`: added `/Free%20Consultation.dc.html  /  301!`
- `README.md`: documented `booking-modal.js`, removed the deleted page

Side wins: the booking iframe is now fetched on first open rather than on every page load, and
the close control is a real `<button>` (keyboard + screen-reader reachable) instead of an `<a>`.

**Verified:** no dead references; every `{{ binding }}` on every page still resolves; all
`data-dc-script` blocks pass `node --check`; pages serve 200 locally.
**Not verified at the time:** no browser was available — the modal had not been clicked
through. This has since been done; see A2.1, which found two real bugs the static check missed.

**Known drift from A2** — removing the 11-line `<sc-if>` block shifted `index.html`. Anything
cited above line 379 in this doc is still correct; these three are stale:

| This doc says | Actually at |
|---|---|
| `index.html:411` — state | 400 |
| `index.html:438-486` — orphaned `playBubbleFlight` | ~423 |
| `index.html:415, 546, 588` — `stepGridRef` | 402, ~510, ~577 |

#### A2.1 — Close button not square on mobile ✅ *(uncommitted)*

Follow-up on the modal A2 introduced, found by finally clicking it through in a browser.
(Not to be confused with audit item **A3, header active-link contrast**, which is still open.)

The blanket `site-mobile.css:62` `button { min-height: 44px }` overrides the close button's
inline `height:34px` but not its `width`, leaving it **34w × 44h** on mobile.

A first pass fixed this by adding an `am-booking-close` class in the JS and a matching
`width/height: 44px !important` rule in the CSS. Correct in a clean browser, but it did not
appear to fix anything in practice — because it splits one visual property across two files
that cache independently, and **neither asset is cache-busted** (`<script src="booking-modal.js">`
and `<link href="site-mobile.css">` carry no `?v=`). Measured in Chromium:

| `booking-modal.js` | `site-mobile.css` | renders |
|---|---|---|
| fresh | fresh | 44 × 44 ✅ |
| **cached (old)** | fresh | **34 × 44** ❌ — the original bug, unchanged |
| fresh | cached (old) | 34 × 34 ✅ (small, but square) |

A browser holding the old JS never gets the class, so the new rule matches nothing while the
generic `button` rule still stretches the height. The fix reproduced the bug it was fixing.

- `site-mobile.css` — selector widened to `.am-booking button, .am-booking-close`. The
  `.am-booking` overlay class predates this rule, so it bites even against a cached JS.
- `booking-modal.js` — added `flex-shrink: 0`. Separate bug: at 320px the header title squeezed
  the button to **43.14 × 44**. Invisible at 390px (iPhone), which is why it went unnoticed.

**Verified in a real browser** (headless Chromium, `python3 -m http.server`): clicked an actual
"Get Matched" link on `index.html`, `How It Works`, `Arianna Zarka Profile`, `Tutors` and
`Jon Booking` — 44 × 44 on all five, at 320 / 360 / 390 / 430px. Both stale-asset cases
re-measured and now render square.

**Caveat:** the cache diagnosis is inference from an exact symptom match, not observed on the
reporter's machine. In a clean browser the first fix already worked.

**General lesson for this repo:** the helmet assets are unversioned, so any change needing two
files to land together is a latent bug. Prefer a selector that degrades to the old markup, or
add cache-busting.

### Open cleanup

- **The 12 profile pages still have their own booking modal** — `"Work With <name>"` →
  `{{ onOpenBooking }}` → a bespoke `<sc-if>` overlay, whose close control is an `<a>` at
  34 × 34. Square, so not the A2.1 bug, but it is below the 44px tap target and is a second modal
  implementation. A2's "one implementation site-wide" claim covers the *Get Matched* path only;
  these are triggered by a course URL, which `booking-modal.js` does not intercept.
- `uploads/Depositphotos_702896334_XL.jpg` — **8 MB, now referenced by zero pages** (it was only
  used by the deleted Free Consultation page). Tracked in git, so deleting is recoverable.
  Left in place: it's licensed stock art that may be wanted elsewhere.
- `_redirects` sends the old consultation URL to `/`, not straight to the booking page.
- `index.html`'s `id="get-started"` section is intact but nothing links to it any more.

### Decisions taken along the way

- **Prettier: rejected.** `Tutors.dc.html` doesn't parse (`Unexpected closing tag "x-dc"`), and
  prettier rewrites the CSS *inside* `style=""` attributes (`#2D5C49` → `#2d5c49`,
  `padding:16px` → `padding: 16px`). The whole responsive layer is `[style*="…"]` substring
  matching against those exact strings, and `Tutors.dc.html:62` depends on the unspaced form.
  It also inflates files ~6× (197 → 1150 lines), invalidating every line number in this doc.
