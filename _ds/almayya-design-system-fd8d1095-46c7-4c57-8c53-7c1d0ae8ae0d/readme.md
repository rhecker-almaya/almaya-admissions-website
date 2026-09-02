# Almaya Admissions Design System

**Naming note:** the brand is spelled **Almaya** (one Y) per the latest direction. The provided logo image assets (`assets/almayya-*.png`) still read "ALMAYYA" (two Ys) — they're the client's real supplied artwork, so they were kept as-is rather than redrawn; flag this mismatch to the client and request updated logo files spelled "Almaya" when available. All written copy in this system now uses "Almaya" / "Almaya Admissions."

Almaya is a college admissions guidance marketplace — "College Admissions Guidance, Personally Matched." It matches students and families with vetted, personally-selected admissions experts (former admissions officers, essay specialists, interview coaches) rather than offering a generic counseling package or a self-serve directory.

**Positioning:** a premium, boutique alternative to going it alone or hiring a counselor blindly. Selectivity is part of the pitch — Almaya vets only a small fraction of applicants into its expert network, so exclusivity signals quality over quantity. Core line: *"The right expert can change the outcome."*

**Audience:** ambitious high-school students and their parents — upper-middle-income+, applying to selective colleges, wary of generic or low-quality counseling services.

**Products this system supports:**
- Marketing/landing website (hero, trust stats, how-it-works, expert grid, testimonials, footer CTA)
- Expert profile pages (public-facing bios experts are matched against)
- Printable one-pagers / PDFs (expert bios, service overviews)

## Sources provided
- `uploads/Logo.png` — logo sheet (LinkedIn banner, Instagram profile mark, transparent-background lockups). Cropped into `assets/`.
- `uploads/Almaya logo.png.pdf` — same logo sheet as a PDF (not machine-readable in this environment; `Logo.png` was used as the source of truth).
- `uploads/Almaya color schemes.png` — 6-color palette swatch, plus a full reference landing-page mockup skinned as "Admity" (a structurally-identical marketplace) showing hero, trust row, vetting-process, 3-step how-it-works, featured experts grid, testimonial band, and footer. Used as the layout/structure reference only — the Almaya UI kit here uses Almaya's own palette, type, and copy, not Admity's brand.
- No codebase, Figma file, or existing component library was provided — components below are an original standard set (Button, Card, Tag, etc.) sized to Almaya's marketing-site needs, per the brand-guidelines-only path.

## Components
Standard set, grouped under `components/`:
- **core/**: `Button`, `Card`, `Tag`, `StatChip`, `Avatar`, `StepIndicator`
- **forms/**: `Input`, `Select`

### Intentional additions
No component in the source materials dictated this inventory (brand-guidelines-only run). The set above covers exactly what the reference layout uses — no extra primitives (Tabs, Dialog, Toast, etc.) were added since nothing in the brand materials calls for them.

## Content fundamentals
- **Recurring phrase:** "personally matched" — use it, don't paraphrase it away.
- **Voice:** warm but authoritative; editorial and premium, never startup-y. Calm confidence, not hype or urgency ("Get matched" not "Don't miss out!").
- **POV:** speaks to the family in second person ("your student," "get matched with up to three admissions experts") while Almaya acts in first person plural ("We personally match...", "Our rigorous vetting process...").
- **Casing:** Sentence case for headlines and body copy; the wordmark and top nav-level brand mentions are the only ALL CAPS, wide-tracked treatment reserved for the logotype itself — don't apply that treatment to arbitrary headlines.
- **Numbers as trust signals, sparingly:** one hero stat row (families supported, rating, colleges represented, acceptance rate) — never scattered decorative stats.
- **Selectivity as reassurance, not pressure:** "We accept only a small fraction of applicants" reads as quality control, not scarcity marketing — keep that framing.
- **No emoji, no exclamation-point energy.** Em dashes and italics (in the serif) carry emphasis instead, e.g. "The right expert *can change* the outcome."
- **CTAs are short, concrete verbs:** "Get Matched," "Learn How It Works," "Explore All Services" — never "Sign Up Now!!" or filler like "Click Here."

## Visual foundations
- **Color:** two-tone system — Deep Forest (#17392F) for dark sections (hero, footer, CTA bands) against Warm Ivory (#F7F3EA) for light sections. Burnt Copper (#B85C3D) is the ONLY call-to-action / accent color — used exclusively for primary buttons and small brand accents (the diamond in the logo, occasional underline flourish). Muted Sage and Sand are secondary — tag pills, dividers, quiet background bands (testimonial strip, vetting stat). Charcoal is body text on light backgrounds, never a background itself.
- **Type:** wide-tracked, all-caps serif (Cormorant, substituted — see Fonts note below) for the wordmark and large display headlines; a clean geometric sans (Jost, substituted) for everything else — body copy, nav, buttons, labels. Headlines mix roman and italic within one line for emphasis ("can change the *outcome*") rather than color or weight changes.
- **Spacing:** generous — section padding is 48–64px, not tight SaaS density. A 4px base unit scales up to 128px for section rhythm.
- **Backgrounds:** flat color fields only — no gradients, no patterns, no textures. Photography is warm, natural-light campus/lifestyle imagery (see the reference banner), never stock-corporate or desaturated. Full-bleed color bands alternate Forest/Ivory/Sage-tint to break up a long page; imagery sits in bounded rounded rectangles, never full-bleed background photography behind text.
- **Animation:** none observed in source materials — treat as a calm, static brand. If motion is added, keep it subtle (short opacity/transform fades, no bounce/spring easing) to match the editorial tone.
- **Hover/press states:** buttons darken slightly on hover (copper → darker copper) rather than changing shape or adding shadow; outline/secondary buttons gain a faint translucent fill. No scale/shrink press effects — this is a restrained, editorial system, not a playful one.
- **Borders & shadows:** hairline 1px borders in a low-opacity charcoal (`--border-subtle`) on light cards; shadows are soft and low-contrast ambient shadows (`--shadow-card`), never hard drop shadows or colored glows.
- **Corner radii:** small and consistent — 4px on buttons/inputs/cards, up to 8px for larger image containers and feature cards. No fully rounded ("bubbly") cards; pill radius (999px) is reserved for tag chips and the small step-number circles.
- **Cards:** white surface, 1px subtle border, soft ambient shadow, 4–8px radius, generous internal padding (18–24px) — never a colored left-border accent stripe.
- **Transparency/blur:** used sparingly — only for secondary-button fills on dark backgrounds (translucent ivory overlay) and the nav's dark scrim. No glassmorphism/backdrop-blur panels.
- **Imagery color vibe:** warm, sunlit, natural — golden-hour campus photography, not cool/blue corporate stock or black-and-white.

**Font substitution flag:** No font files were provided. Cormorant (display serif) and Jost (body sans) are the nearest Google Fonts matches to the wordmark's wide-tracked classic serif and the reference layout's clean geometric sans. If Almaya has licensed originals (the wordmark looks like it could be a custom or licensed serif), please share the font files/names and this system will be updated to use them exactly.

## Iconography
No icon set, icon font, or SVG library was provided in the source materials. The reference layout uses simple line icons (shield, star, people, building) at a small, quiet size next to trust stats and process steps — restrained, not decorative. In the absence of source assets, this system uses plain Unicode glyphs (★, ✓, →) as lightweight placeholders in components/cards. **Recommended substitution:** [Lucide icons](https://lucide.dev) (CDN) — thin 1.5px stroke, no fill, matches the reference's understated line-icon weight. Flagging this as a substitution: swap in Lucide (or real brand icons, if Almaya has a set) before shipping production screens.

## Index
- `styles.css` — root stylesheet, imports everything under `tokens/`
- `tokens/` — `colors.css`, `typography.css`, `spacing.css`, `fonts.css`, `base.css`
- `assets/` — logo lockups and mark crops
- `guidelines/` — foundation specimen cards (Colors, Type, Spacing, Brand) shown in the Design System tab
- `components/core/`, `components/forms/` — reusable primitives (see above)
- `templates/landing-page/` — marketing landing page template (hero, differentiator, vetting path, admitted-schools marquee, how it works, founders, experts, rotating testimonials, footer CTA)
- `templates/expert-profile/` — expert profile page template (example: Arianna Zarka, Tier 2 — Coach, with Cornell/Cornell Tech/Cornell Law crests)
- `templates/one-pager/` — printable one-pager template (Arianna Zarka)
- `templates/one-pager-jacob/` — one-pager (Jacob Feit Mann, Tier 1 — Mentor)
- `templates/one-pager-sarah/` — one-pager (Sarah Rosen, Tier 3 — Strategist)
- `templates/one-pager-jonathan/` — one-pager (Jonathan Mizrahi, Tier 2 — Coach)

## Tutor tiers
Almaya Admissions tutors/experts are leveled into four tiers, surfaced as a `Tag` badge on profiles and one-pagers:
- **Tier 1 — Mentor** (sage tag): strong college students, recent grads, trained mentors, early-career writing tutors.
- **Tier 2 — Coach** (sand tag): very experienced writing tutors/essay editors, English/MFA backgrounds.
- **Tier 3 — Strategist** (copper tag): admissions strategists with deep, proven placement track records.
- **Tier 4 — Expert** (solid forest tag): the network's most senior experts (e.g. former admissions officers).
- `SKILL.md` — portable skill file for use outside this environment
