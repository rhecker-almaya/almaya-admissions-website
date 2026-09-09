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
- ~~Set the 5 active links to it~~ — superseded by R1; it is one constant in `site-header.js`
- ~~Better: one shared `.nav-links a[aria-current="page"]` rule~~ — the component *is* the shared rule

~~Also worth fixing while you're here: the header background `#2D5C49` is **hardcoded in 9 pages and
matches no token**~~ — **done, see A3.0 below.** The contrast ground is now `--bg-header`
(still `#2D5C49`, unchanged); define `--copper-300` against that token rather than the raw hex.

✅ **Done** — see **A3 — active-link contrast** in the change log. `#E0A183` as suggested above
measures 3.5:1 and would have failed AA; the shipped tint is `#F7C3A4`.

### A4. Mobile header CTA wraps to two lines · 5 min

Root cause is a selector that JS silently invalidates. `site-mobile.css:94-96` protects the CTA via
`header > div:last-child { flex-shrink: 0 }`, but `site-mobile-nav.js:79` appends the hamburger to
the header — so `div.am-navtoggle` *becomes* `:last-child` and the CTA wrapper loses both
`flex-shrink:0` and `white-space:nowrap`.

~~One selector change (`:not(.am-navtoggle)`, or target the CTA wrapper by class). Fixes all 20 pages.~~

> **This prescription is wrong.** `:not(.am-navtoggle)` makes the rule match *nothing*, and two
> further rules have the same defect. Tried on branch `mobile-cta` and it did not work — see
> **A4 — correction** in the change log below.
>
> ✅ **Fixed** via a `.am-hdr-cta-wrap` class on the CTA wrapper — see **A4 — fixed** in the
> change log. This also forced **A7** on Institutions; that page's header CTA is now dropped
> below 900px.

### A5. Advisors page: 5-across grid on mobile · 5 min

`Tutors.dc.html:152` — the "How We Vet" grid is `repeat(5,1fr)` and **never collapses on mobile**.
`index.html:100` has the `.vet-grid{grid-template-columns:1fr!important}` rule; `Tutors.dc.html`
is missing it, and `site-mobile.css`'s generic collapse list covers `repeat(2/3/4` but not
`repeat(5`. Add the rule (or add `repeat(5` to the shared list).

*Not in your notes — found while looking at the repeated process sections. It's outright broken.*

⏭ **Skipped**, at your instruction. Still open and still broken.

### A6. Institutions: sticky card overlaps the header on mobile · 5 min

Your "a) broken b) unnecessary" card. `Institutions.dc.html:177` is
`position:sticky; top:32px; height:260px`, and `.sticky-panel` has **no mobile rule at all** —
the page's 860px block (`:85-99`) lists a dozen selectors but omits `.hiw-grid` and
`.sticky-panel`. Once the grid collapses, a 260px card pins at `top:32px` *underneath* a 72px
sticky header, then floats over ~2,240px of content below.

Add `.sticky-panel{position:static;height:auto}` and `.hiw-grid{grid-template-columns:1fr}` to
that block. (If you agree it's unnecessary, deleting it outright is the same 5 minutes.)

✅ **Done — deleted**, per your call. See **A6 — Institutions sticky card deleted** in the change
log. `How It Works.dc.html` has its own copy of this component and is **untouched**.

### A7. Institutions: header CTA overflows the screen · 5 min

`Institutions.dc.html:111-113` — "Talk to Us About Our Workshop" with `flex-shrink:0` +
`white-space:nowrap` (`:54-55`), no mobile rule shortening it. At 375px the label + 44px hamburger
+ logo simply don't fit.

Cheapest fix: **drop the header CTA below 900px** — the mobile drawer already carries a copy
(`site-mobile-nav.js:41-48`), so nothing is lost. Shortening the label is a copy change; flag it.

✅ **Done** — that is exactly what shipped, forced by the A4 fix. Once the CTA became genuinely
`nowrap`, this label started clipping instead of wrapping, so it had to be resolved in the same
change. See **A4 — fixed** in the change log. Shortening the label is still a live copy question:
if it ever gets short enough to fit, delete the `:has(a.cta-lift)` rule and it comes back.

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
- Clean up the stray hexes: ~~`#2D5C49` (header)~~ done in A3.0 — the header is now one
  edit (`--forest-700-rgb`); and 16 in `Why Almaya.dc.html`
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
(Not to be confused with audit item **A3, header active-link contrast**, which was still open at
the time and has since landed.)

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

### A3.0 — Header background tokenized ✅ *(uncommitted)*

Sub-item of A3 only. ~~**The active-link contrast fix — the actual A3 — is still open**, as is
`--copper-300`.~~ Both have since landed — see **A3 — active-link contrast** below.

The audit said 9 pages; it's **18**, in two forms. A1/A2 deleted two of the 9, and the 11 profile
pages carry the same green as a translucent gradient (`rgba(45,92,73,.96)` *is* `#2D5C49`), which a
hex grep doesn't catch.

| Header | Pages | Now reads |
|---|---|---|
| flat | 7 | `background:var(--bg-header,#2D5C49)` |
| gradient over `backdrop-filter` | 11 | `background:var(--bg-header-gradient,linear-gradient(…))` |

`tokens/colors.css` gains `--forest-700-rgb` (the triple, not a hex — the profile headers need
alpha), `--forest-700:rgb(var(--forest-700-rgb))`, `--bg-header`, and `--bg-header-gradient`.
**One line — `--forest-700-rgb` — now drives all 18 headers**, flat and gradient together. Deriving
the hex *from* the triple is what keeps them from drifting apart in B3; two independent literals
would have let a palette swap change the 7 flat headers and silently leave the 11 gradients behind.

Every value is unchanged — this is a pure indirection, no visual diff. The gradient's lower stop
(`#234B3C`) stayed a literal: it's within 5/255 of `--forest-800` but not equal, and snapping it
would have been an (invisible) unrequested color change.

Per the A2.1 lesson, **every call site carries a literal fallback**. A stale `colors.css` against
fresh HTML would otherwise make `background` invalid at computed-value time and render the sticky
header *transparent* — a worse failure than the bug A2.1 fixed. Measured, not assumed (below).

**Verified in a real browser** (headless Chromium over `python3 -m http.server`, computed styles
read via CDP), 10 pages covering both header forms *and* both ways this repo loads the design
system — `<link>` (16 pages) and `ds-base.js` → `styles.css` → `@import` (`index`, `Institutions`):

| Scenario | Result |
|---|---|
| Fresh both | `rgb(45,92,73)` / correct gradient on all 10 — identical to pre-change |
| **Stale `colors.css`, fresh HTML** | identical again; tokens undefined, literal fallback took over |
| One-line palette change | all 18 headers moved together, flat and gradient |

Confirms in passing that the DC/React runtime re-serializes these inline styles *with* a space
(`background: var(--bg-header,#2D5C49);`) and handles nested-paren values fine. No `[style*="…"]`
selector in `site-mobile.css` keys off any header background, and `.header-compact`
(`Institutions.dc.html:58`) only touches padding — so nothing depended on the old substrings.

Left alone: `booking-modal.js:43` hardcodes `rgba(23,57,47,0.72)`, which is `--forest-900`. Same
class of stray, out of scope here.

### R1 — The site header is one shared component ✅ *(commit `3dd4635`, branch `shared-header`)*

Not an audit item — a structural fix for the "Header and footer markup is duplicated in all 20
pages" fact at the top of this doc. Markup changes to the header are now **1 file, not 18**.

The 18 copies had already drifted into two visibly different designs:

| | Pages | Logo mark | Wordmark | Bar | Active-page highlight |
|---|---|---|---|---|---|
| Main | 7 | 48px | 26px | solid `--bg-header` | yes |
| Profile | 11 | 36px | 18px | gradient + `backdrop-filter` | **none** |

`site-header.js` defines a `<site-header>` element that every page now mounts:

```html
<x-import component-from-global-scope="site-header" data-active="advisors"></x-import>
```

Attributes, all optional: `data-active` (`why|how|advisors|about|institutions`),
`data-header-class`, `data-cta-href`, `data-cta-label`, `data-cta-class`. Institutions is the only
page using the overrides — it keeps its workshop CTA and its `{{ headerClass }}` scroll-compact
hook (`Institutions.dc.html:104`).

The main-page design won: it is the one with the active-page highlight and the one
`site-mobile.css` was written against. So the 11 profile pages gain a highlight they never had,
and the gradient header form is gone.

**Three constraints shaped the implementation:**

- The emitted DOM keeps the old element *shape* — logo `<a>` first, `<nav class="nav-links">`
  second, CTA wrapped in a trailing `<div>` — because `site-mobile.css` and `site-mobile-nav.js`
  both select against exactly that structure. Both files were changed **zero** lines.
- The CTA is a plain styled `<button>` (`.am-hdr-cta`) mirroring
  `Button{variant:'primary',size:'sm'}` rather than an `x-import`, because the DC runtime only
  mounts `x-import` tags it parsed from the page source — it does not walk DOM built by a custom
  element. Keep it in sync with `_ds/.../_ds_bundle.js`.
- `render()` guards on a signature of the five attributes and only rewrites `innerHTML` when one
  actually changed. Without that, Institutions' scroll-driven `headerClass` flip would destroy the
  toggle `site-mobile-nav.js` appended, on every scroll tick.

Net **−46 lines** (166 added, 212 removed) across 20 files.

**Verified in Chrome across all 18 pages:** sticky positioning, logo sizing, 5 nav links, correct
active highlight, CTA label/colour, mobile drawer, no new console errors or failed requests versus
baseline. Header screenshots of `index.html` and `About Us.dc.html` are byte-identical to before.

**Knock-on effects on items still open in this doc:**

- **A3** (active-link contrast) is now a **two-line change** in `site-header.js` —
  `NAV_LINK_ACTIVE` — instead of five hand-maintained per-page edits. The "better: one shared
  rule" suggestion under A3 is superseded; the component *is* the shared rule.
- **A3.0**'s `--bg-header` is now referenced from one place (`HEADER_STYLE`) rather than 18, and
  **`--bg-header-gradient` is now orphaned** — still defined in `tokens/colors.css:29`, referenced
  by nothing. It was only ever used by the 11 profile headers. Safe to delete; left for B3.
- **A7** (Institutions header CTA overflows) is now one rule against `.am-hdr-cta` /
  `data-cta-class="cta-lift"`, not a per-page patch.
- **A4 is *not* fixed by this** — see the correction below.

#### A4 — correction: `:not(.am-navtoggle)` cannot work *(diagnosis; fixed in the next entry)*

A4 above proposes `header > div:last-child:not(.am-navtoggle)`. That advice is **wrong**, and the
attempt on branch `mobile-cta` (`b1408cd`, "didn't work") is why.

`:last-child` is **positional, not filtered**. It means "this element is the last child", full
stop. Adding `:not(.am-navtoggle)` cannot promote the CTA wrapper to last-child — it only adds a
second condition to an element that already fails the first. Once `site-mobile-nav.js:79` runs
`header.appendChild(toggle)`, the compound selector asks for an element that is simultaneously the
last child *and* not the toggle. No such element exists, so the rule matches **nothing**.

The pre-fix rule at least matched the toggle. The "fix" made it match zero elements — so the CTA
is exactly as broken as before, which is precisely the reported symptom.

Measured at 390px on `index.html`, both branches, after the toggle is injected:

| Selector | Matches |
|---|---|
| `header > div:last-child` | 1 — the `.am-navtoggle` |
| `header > div:last-child:not(.am-navtoggle)` | **0** |
| `header > div:nth-last-child(1 of :not(.am-navtoggle))` | 1 — the CTA wrapper ✅ |

CTA wrapper computed `flex-shrink: 1`, `white-space: normal`; the button renders 56px tall — two
lines.

Two things follow that A4 does not mention:

1. **Three rules are dead, not one.** `site-mobile.css:104`
   (`header > div:last-child a, header > div:last-child button { white-space: nowrap }`) and
   `:108` (the ≤1200px font-size/padding rule) have the same defect, and `mobile-cta` touched
   neither — only `:103`, the `flex-shrink` rule. `white-space: nowrap` is what actually stops
   the two-line wrap; `flex-shrink: 0` alone would not have fixed it even if it had landed.
   *(Line numbers are this branch's. `mobile-cta` also reformatted the whole file, so the same
   three rules sit at `:213`, `:216-218` and `:229` there.)*
2. **The refactor above does not change this.** `<site-header>` reproduces the old shape
   faithfully, so the CTA wrapper is still a `header > div` followed by an appended toggle.
   Verified identical on `shared-header`'s `index.html` and its profile pages.

Real fixes, in preference order:

- Give the wrapper a class in `site-header.js` (e.g. `.am-hdr-cta-wrap`) and select that — the
  refactor makes this a one-line change, and it is the only option that is not positional. Per
  the A2.1 cache lesson, pair it with a selector that still degrades on stale assets.
- Or `header > div:nth-last-child(1 of :not(.am-navtoggle))` — works today (Chrome 111+,
  Safari 9+, Firefox 113+), but it is still positional and silently no-ops on older browsers.
- Or have `site-mobile-nav.js` insert the toggle *before* the CTA wrapper rather than appending —
  fixes all three dead rules at once, but changes the visual order of the header.

#### A4 — fixed with a wrapper class ✅ *(also closes A7)*

Took the first option. `site-header.js` emits the CTA wrapper as
`<div class="am-hdr-cta-wrap" style="display:flex;gap:12px">`, and the three dead rules in
`site-mobile.css` now target that class instead of asking a positional question.

Each selector is its own rule rather than a comma-separated list. That is deliberate: in a
selector list **one unsupported selector invalidates the whole list**, and the fallback rules use
`:nth-last-child(… of …)`, which is only Chrome 111+ / Firefox 113+. Listed together, an older
browser would have dropped the `.am-hdr-cta-wrap` rule along with it.

Those fallback rules exist for the A2.1 hazard — neither asset is versioned, so a browser can hold
a cached `site-header.js` that predates the class while fetching fresh CSS. Measured, not assumed:

| `site-header.js` | `site-mobile.css` | CTA renders |
|---|---|---|
| fresh | fresh | **one line** ✅ |
| **cached (no class)** | fresh | **one line** ✅ — the `:nth-last-child` fallback carries it |
| fresh | **cached** | wraps — identical to pre-fix, no regression |
| cached | cached | wraps — unchanged baseline |

The third row is unavoidable: the CSS *is* the fix. It degrades to the old behavior rather than to
something worse, which is the bar A2.1 set.

**Making the rules live exposed A7 immediately.** A `nowrap` CTA cannot wrap out of trouble, so
every pixel it was short now clips instead. Measured across 7 pages × 9 widths:

| Page | Shortfall | Resolution |
|---|---|---|
| index, Tutors, About Us, Why Almaya, How It Works, profiles | fits at 375px+; **16px short at 320px** | tighter gutter below 360px |
| Institutions — "Talk to Us About Our Workshop" | **128px short at 320px** (217px of nowrap label) | header CTA dropped below 900px |

- **≤360px:** header padding 16→12px, gap 12→8px, CTA padding 14→10px. Recovers exactly the 16px
  the short label was missing, and touches nothing above 360px.
- **Institutions:** `.am-hdr-cta-wrap:has(a.cta-lift) { display: none !important }` below 900px.
  `!important` is load-bearing — the wrapper carries an inline `style="display:flex"` that outranks
  a plain class rule. Verified the drawer still carries the CTA: `site-mobile-nav.js` reads it out
  of the DOM, so hiding it visually does not remove it from the menu.

  **Reverted 2026-09-08 by request.** The hide rule is deleted; the Institutions CTA is now visible
  in the mobile header again. The 128px shortfall measured above is real and unaddressed, so the
  bar is expected to be tight or overflowing at narrow widths until the label is shortened. Do not
  re-add the rule without asking — shorten `data-cta-label` on
  `Institutions.dc.html:106` instead.

**Rejected: ellipsizing the logo.** The obvious alternative was to let the wordmark shrink, since
it is the only flexible item left once the CTA is `flex-shrink:0`. Implemented and measured, it
erases the brand: **100 of 143px** of "Almaya Admissions" hidden at 320px on `index`, and
**all 143px** on Institutions at 320–390px. A tighter gutter is a far cheaper trade. Recorded here
because the approach looks correct until it is measured.

**Verified in headless Chromium** over `python3 -m http.server`, 7 pages × 9 widths
(320/360/375/390/430/880/1000/1100/1400) = **63 combinations, all passing**: wrapper found,
`flex-shrink: 0`, `white-space: nowrap`, CTA on exactly one line box (measured via
`Range.getClientRects().length`, not height — the 44px tap target from A2.1 makes height a
misleading proxy), zero clipping past the header edge, zero horizontal document overflow, and the
wordmark never truncated. Institutions is the only page where the CTA is hidden, only below 900px.

Also updated the header comment in `site-header.js`, which still told the next reader that
`site-mobile.css` reaches the CTA via `header > div:last-child`.

#### Branches consolidated into `main` ✅

`main` was still sitting on the initial commit — none of the work above had ever been merged. The
four branches forked at `49ba1d0`:

```
926573f main
  └─ … ─ 49ba1d0 ─┬─ 3dd4635  jacob-fix, shared-header ─ 062789e  log-shared-header
                  └─ b1408cd  mobile-cta
```

`main` fast-forwarded to `log-shared-header`, then merged `mobile-cta` (no conflicts — the two
sides touched disjoint files). `mobile-cta`'s broken `:not(.am-navtoggle)` attempt is preserved in
history rather than rewritten, and superseded by the fix above. All four branches are now
ancestors of `main`.

Note `mobile-cta` also reformatted the whole of `site-mobile.css`, so the line numbers in the A4
correction above now refer to the reformatted file.

#### A4.2 — the mobile header gutters were never applied ✅ *(uncommitted)*

Follow-up on the header work above, found by asking a plain question about `site-mobile.css:19`:
is `header { padding: 12px 16px !important }` overridden by `site-header.js`?

**No — but it was dead anyway, and the file was overriding itself.** Two separate causes:

1. `site-mobile.css`'s own `@media (max-width: 1200px)` header block sat ~220 lines *below* the
   `@media (max-width: 900px)` block. A ≤900px viewport is also ≤1200px, so both matched `header`
   at equal specificity (0,0,1) with `!important` on both — and media queries contribute nothing
   to specificity, so **the later rule won**. The 900px block's `padding: 12px 16px` and
   `gap: 12px` never applied at any width.
2. `Institutions.dc.html:58` carried a **copy** of that same 1200px block in its page `<style>`,
   which loads *after* `site-mobile.css` (`:30` vs `:36`). That copy beat the shared file
   regardless of ordering within it — so on Institutions the `≤360px` block was dead too, not
   just the 900px one.

The JS is innocent: `HEADER_STYLE` emits `padding: 12px 48px` as a *plain* inline style, and an
`!important` author declaration outranks a non-important inline one. That is the one case where
inline styles lose, and it is why the CSS was always in control.

- `site-mobile.css` — moved the `@media (max-width: 1200px)` header block **above** the 900px
  block, with a comment stating the constraint. A "do not move it back" note is left where it
  used to sit, next to the other header rules.
- `Institutions.dc.html` — deleted the duplicated block. Every declaration it carried exists in
  `site-mobile.css`; its `.cta-lift button` rule is covered by `.am-hdr-cta-wrap button`, which is
  what `site-header.js` actually emits.

**Verified in Chrome**, computed styles read from sized iframes, measured before *and* after
(`padding-left/right` / `gap`):

| viewport | Why Almaya before | after | Institutions before | after |
|---|---|---|---|---|
| 320px | 12px / 8px | 12px / 8px | **24px / 16px** | 12px / 8px |
| 360px | 12px / 8px | 12px / 8px | **24px / 16px** | 12px / 8px |
| 700px | **24px / 16px** | 16px / 12px | **24px / 16px** | 16px / 12px |
| 900px | **24px / 16px** | 16px / 12px | **24px / 16px** | 16px / 12px |
| 1000px | 24px / 16px | 24px / 16px | 24px / 16px | 24px / 16px |
| 1400px | 48px / 32px | 48px / 32px | 48px / 32px | 48px / 32px |

901–1200px and ≥1201px are unchanged. Also checked across `index`, `Why Almaya`, `Tutors` and
`Institutions` at 320/360/390/860/900/1000px: the CTA button keeps `13px` / `0 14px` at ≤1200px on
Institutions after the deletion, the CTA never wraps to a second line, and no page overflows
horizontally.

**This weakens a claim in "A4 — fixed" above.** That entry says the ≤360px block "recovers exactly
the 16px the short label was missing" — but the 16px starting gutter it reasoned from was never in
effect; the real gutter at that point was 24px. The fix worked, for different arithmetic than
recorded. See the 320px item under **Open cleanup**.

**General lesson for this repo:** in a file this `!important`-heavy, specificity is nearly always
tied, so **source order is the cascade**. Narrower breakpoints must come last. A page-local copy of
a shared rule is worse than either — it wins everywhere and is invisible from the shared file.

### A3 — active-link contrast ✅ *(uncommitted)*

The audit item itself, finally. Two lines, because R1 had already collapsed five per-page edits
into one constant.

- `tokens/colors.css` — new `--copper-300: #f7c3a4`, placed between `--copper-600` and
  `--copper-100`, with a comment naming the constraint (≥4.5:1 on `--bg-header`) so B3 doesn't
  quietly break it during the palette swap.
- `site-header.js` — `NAV_LINK_ACTIVE` reads `var(--copper-300,#F7C3A4)` instead of `var(--copper)`.

**A3's own suggestion of `#E0A183` would not have worked.** Measured against `--bg-header`:

| Colour | Contrast on `#2D5C49` | |
|---|---|---|
| `--copper` `#B85C3D` (before) | **1.7 : 1** | the inversion this item is about |
| `--text-muted-inverse` `#B8C6BE` (inactive links) | 4.3 : 1 | the bar to beat |
| `#E0A183` (as proposed above) | **3.5 : 1** | still fails AA, and still dimmer than inactive |
| `#F7C3A4` (shipped) | **4.9 : 1** | passes AA, and now brighter than inactive |

The link is 15px/600 — that is not "large text" under WCAG (needs 18.66px bold), so 4.5:1 is the
real threshold, not 3:1. `#E0A183` clears neither that nor the more important informal bar: the
current-page link has to out-read the ones that aren't current, which is the whole complaint.

Per the A2.1 lesson the JS carries a literal fallback, and **the stale-asset case proved itself by
accident**: the first page load in the test browser held a cached `colors.css` where
`--copper-300` resolved to the empty string, and the link still rendered `rgb(247,195,164)` — the
fallback took over with no visual difference. After a hard reload the token itself resolved to
`#f7c3a4`. Both paths, same pixel.

| `site-header.js` | `colors.css` | active link renders |
|---|---|---|
| fresh | fresh | `rgb(247,195,164)` ✅ |
| fresh | **cached (no `--copper-300`)** | `rgb(247,195,164)` ✅ — literal fallback |
| cached | either | old copper — degrades to the pre-fix bug, not to something worse |

**Verified in Chrome** over `python3 -m http.server`, computed styles read from sized iframes at
320 / 390 / 860 / 1000 / 1400px: active link `rgb(247,195,164)`, the other four
`rgb(184,198,190)`, no console errors.

**Verified on `Institutions.dc.html` only.** All 18 pages mount the same `SiteHeader` and the
constant is shared, so the other 17 follow by construction — but that is an inference, not a
measurement, and this doc's own history (A4, A4.2) is a list of times that inference was wrong.
Worth a sweep before committing.

### A6 — Institutions sticky card deleted ✅ *(uncommitted)*

Deleted outright rather than given mobile rules, per your call — "a) broken b) unnecessary".

`Institutions.dc.html`, all in the `#workshop` section:

- The `.sticky-panel` block and its four inner `ref` targets — gone.
- The `.hiw-grid` wrapper was `0.7fr 1.3fr`; with one child left it is now a plain
  `max-width:760px` block. That is within a pixel or two of the width the steps column had before
  (`(1100−56)×0.65 ≈ 679`… widened slightly to 760 so the text column doesn't get narrower than it
  was), so the steps themselves are unmoved at desktop.
- `min-height:560px; justify-content:center` came off all four `.hiw-step`s. Those existed **only**
  to give the sticky card scroll runway — with the card gone they are 2,240px of dead whitespace.
  `gap` 72 → 56px for the same reason.
- **~35 lines of now-unreachable JS**: `activeStep` state, `step0Ref`–`step3Ref`,
  `applyStickyColors()` and its 4-panel colour table, `componentDidUpdate`, the nearest-to-centre
  ref scan inside the scroll handler, and the `clockLabel` / `clockProgress` / `stickyKicker` /
  `stickyTitle` / `stickyBody` bindings with their four-item copy arrays.
- The scroll handler survives — it also drives `headerCompact` and the worry-bubble reveal. Renamed
  `pickActive` → `onScrollTick`, since it no longer picks anything, with a comment recording what
  it used to do.
- The `@template` comment at the top still advertised a "sticky-scroll workshop walkthrough";
  updated.

`.hiw-step` keeps its class — `site-mobile.css:402` still uses it to force `opacity:1` on mobile.

**Verified**: `node --check` on the extracted `data-dc-script`; every `{{ binding }}` still present
in the page resolves against `renderVals()`; no console errors. In Chrome at 320 / 390 / 860 /
1000 / 1400px — zero `.sticky-panel` elements, all four steps render, content column 760px at
≥1000px and full-width below, `document.scrollWidth === innerWidth` at every width (no horizontal
overflow).

**Not verified — and I edited the code path in question.** The `headerCompact` flip and the
worry-bubble reveal both live in the handler I trimmed, and I could not exercise either:
`window.scrollY` reads `0` through the browser tooling on this page even after the viewport
visibly moves, both top-level and inside an iframe, so `scrollY > 360` never fired during testing.
The edit is a deletion from the middle of that function and the surrounding logic is untouched,
but that is an argument, not evidence. **Someone should scroll this page by hand** and confirm the
header still compacts past 360px and the three worry bubbles still drop in.

- **Header content overflows its own box at 320px** on `index` and `Why Almaya` — measured
  `header.scrollWidth` 358 vs `clientWidth` 320, i.e. ~38px of the "Get Matched" CTA past the
  edge. **Pre-existing**: identical before and after A4.2, so not a regression from it. This sits
  awkwardly against A4 — fixed's "zero clipping past the header edge" across 63 combinations; the
  two were measured differently (that pass checked the CTA's right edge, this one the header's own
  scroll width) and it is not yet established which is the right question. `html,body` carry
  `overflow-x:hidden`, so the page does not scroll — the excess is simply hidden. Worth a proper
  look now that the gutter values underneath it are finally the ones the file intends.

- **`site-header.js` still carries the `<site-header>` custom-element shim.** The header is now a
  React component (`window.SiteHeader`) and all 18 pages mount it by that name, but neither the
  pages nor the script are versioned assets, so a browser holding cached HTML that still says
  `component-from-global-scope="site-header"` would get no header at all without the shim.
  Delete the shim block, and the `site-header{display:contents}` rule above it, once the renamed
  pages have been live long enough to age out of caches.
- **The header still inlines its own copy of the design-system `Button`.** That was forced by the
  custom element — the DC runtime does not walk DOM built by one, so `x-import` was unavailable.
  A React component can call `AlmayyaDesignSystem_fd8d10.Button` directly, which would delete the
  hand-synced `.am-hdr-cta` CSS block. Left out of the port deliberately: it changes the emitted
  DOM, and the port was meant to be behaviour-identical.

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
- **`index.html:104-107` carries mobile rules for `.hiw-grid`, `.sticky-panel`, `.hiw-steps-col`
  and `.hiw-step` — none of which exist in `index.html`.** Pre-existing dead code, not caused by
  A6, and left alone. Note the shape: it is `.sticky-panel{position:static;height:auto}`, i.e. the
  exact rule A6 says to add to `Institutions.dc.html` — it was written once, on the wrong page.
  Another instance of the C6 drift. `How It Works.dc.html:50-54` is the copy that does something.

#### A6.1 — Institutions: workshop stock photos deleted ✅ *(uncommitted)*

Not an audit item — your call, "delete the stock image cards with the hover zoom behavior, they're
not needed at all". Same section as A6 (`#workshop`), so logged alongside it.

The three `.wk-thumb` cards were one per walkthrough step: `workshop-insight.jpg` (Part One),
`workshop-strategy.jpg` (Part Two), `workshop-writing.jpg` (Part Three) — each a
`max-width:420px`, `aspect-ratio:4/3` framed image that scaled to `1.05` on hover.

- The three wrapper `<div>`s and their `<img>`s — gone. Each step's `hiw-heading` now sits directly
  under its timestamp; the steps are otherwise untouched (still `flex-direction:column`, gap 56px
  from A6).
- The `.wk-thumb` / `.wk-thumb:hover` rules in the page `<style>` — deleted, zero remaining users.
- `.wk-grid{grid-template-columns:1fr 1fr!important}` in the 860px block — **already dead before
  this change**; no `.wk-grid` element existed anywhere in the repo. Swept out while adjacent.

**Kept deliberately, both also stock and both easy to confuse with the above:**

- `workshop-insight.jpg` as the full-bleed background of `#contact` — a background under a 0.82–0.88
  forest gradient, not a card, and not hover-animated.
- The `.founder-photo` avatars for Razi and Eitan. They have their own hover transform
  (`saturate(1.35) scale(1.06)`), so they match "hover zoom" on a grep — but they are real team
  photos, not stock.

**Knock-on: `assets/photos/workshop-strategy.jpg` is now referenced by zero pages — and it is
18.9 MB**, the largest file in the repo by a factor of eight. It was only ever used here.
`workshop-writing.jpg` (7.3 MB) survives on `About Us.dc.html`; `workshop-insight.jpg` survives in
the `#contact` background above. Same disposition as the orphaned 8 MB `uploads/` stock photo
already listed above: tracked in git, so deletion is recoverable, but it is licensed art — left in
place pending your call. Worth noting the page was shipping ~28 MB of un-resized JPEGs before this.

**Verified:** the file's own grep — no `wk-thumb`, `wk-grid`, or `workshop-strategy` reference
remains anywhere outside `.git`. The diff is six deleted lines, all of them removals.
**Not verified in a browser.** This is pure subtraction from static markup with no `{{ binding }}`,
`ref`, or JS touched, so there is no state to break — but per this doc's own track record that is
an argument, not a measurement. The vertical rhythm of the walkthrough is now three text-only
steps under one step that still carries the founder cards; **someone should eyeball whether that
first step now looks unbalanced against the other three.**

### Decisions taken along the way

- **Positional header selectors: banned.** `header > div:last-child` and its `:not()` variant are
  both broken by design — `site-mobile-nav.js` appends to the header at runtime, so *any* rule
  keyed on sibling order is one JS change away from silently dying. Header rules target
  `.am-hdr-cta-wrap` / `.am-navtoggle` by class now. See **A4 — correction**.
- **Breakpoint blocks are ordered widest-first; page-local copies of shared header rules are
  banned.** Nearly every rule in `site-mobile.css` is `!important` on a bare element or single
  class, so specificity ties and source order decides. A narrower `@media` block placed above a
  wider one is silently dead — and a copy of a shared rule in a page `<style>` outranks the whole
  shared file. Both were happening at once. See **A4.2**.
- **Ellipsizing the logo: rejected.** Measured; it hides 100 of 143px of the wordmark at 320px and
  the entire wordmark on Institutions. Tightening the gutter below 360px buys the same 16px
  without touching the brand. See **A4 — fixed**.
- **Colour values in this doc are suggestions, not specs.** A3 proposed `#E0A183` "or thereabouts"
  for `--copper-300`; it measures 3.5:1 on the header green — below AA, and *below the inactive
  links it is supposed to outrank*. Every colour this doc names should be re-measured against its
  actual ground before it ships. See **A3 — active-link contrast**.
- **Prettier: rejected.** `Tutors.dc.html` doesn't parse (`Unexpected closing tag "x-dc"`), and
  prettier rewrites the CSS *inside* `style=""` attributes (`#2D5C49` → `#2d5c49`,
  `padding:16px` → `padding: 16px`). The whole responsive layer is `[style*="…"]` substring
  matching against those exact strings, and `Tutors.dc.html:62` depends on the unspaced form.
  It also inflates files ~6× (197 → 1150 lines), invalidating every line number in this doc.
