---
name: huge
description: Build a complete, finished ThemeHuge ("thha-") widget preview from a folder location. Given a path like `07-05-2026/business-hours` (or just a widget name), creates the full folder structure — <widget>.html, scss/<widget>.scss, compiled scss/<widget>.css + .css.map, js/<widget>.js — and fills it with five fully designed, working presets, not placeholders. Use when the user runs /huge, points at a folder and asks for a widget built there, or asks to "make the preview code and folder structure" for a widget. For a bare TODO skeleton instead, use scaffold-thha-widget.
---

# /huge — build a finished ThemeHuge widget preview

`/huge <folder-location>` takes one argument: **where the widget lives**. From that it derives every name, creates the folder structure, writes real styled preview code for five designs, compiles the SCSS, and verifies the result renders.

This skill produces **finished work**. Every preset ships working markup, real styles, and (where interactive) real JS. `TODO`, `<!-- Design N markup -->`, `// Design N styles`, lorem filler, and empty preset blocks are all failures of this skill — if you cannot finish all five, say so explicitly rather than shipping stubs.

## Step 1 — Resolve the folder location

The argument may arrive in any of these forms. Resolve, don't ask, when the form is unambiguous:

| Argument | Resolves to |
|---|---|
| `07-05-2026/business-hours` | that exact batch + widget |
| `business-hours` | `<newest existing batch>/business-hours` |
| `/abs/path/.../business-hours` | that path verbatim |
| existing folder with a stub `.html` | fill it in; **read the stub first** |
| nothing | ask for the widget name and the batch in one message |

Batch folders are dated `DD-MM-YYYY`. Determine the newest by listing the repo root — do not hardcode a date from this file, the set grows. If the user names a batch that doesn't exist yet, create it.

Derive from the folder's basename (always kebab-case):

- **slug** — the basename, e.g. `business-hours`
- **root class** — `thha-<slug>`, e.g. `thha-business-hours`
- **inner prefix** — `thha-` + initials, e.g. `thha-bh-` for `business-hours`, `thha-mb-` for `marketing-buttons`. Every descendant class uses it: `thha-bh-card`, `thha-bh-row`. Modifiers use `--`: `thha-bh-card--compact`.
- **Title Case** — `Business Hours`, used for `<title>` and any launcher entry

If the folder already exists with content, **read every file before writing**. Fill gaps and extend; never clobber authored markup or styles without confirming.

## Step 2 — Create the folder structure

```
<batch>/<slug>/
  <slug>.html            # entry page, five design sections
  scss/<slug>.scss       # source styles
  scss/<slug>.css        # compiled — committed, this is what the HTML loads
  scss/<slug>.css.map    # compiled
  js/<slug>.js           # only if any preset needs behaviour
  img/                   # only if the widget ships local assets
```

Skip `js/` entirely when all five designs are CSS-driven — an empty IIFE file is noise. Skip `img/` unless real local assets exist; photos come from Unsplash URLs, icons from Font Awesome.

## Step 3 — Write `<slug>.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TITLE_CASE</title>
    <link rel="stylesheet" href="./scss/SLUG.css" />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <!-- Design 1 : SHORT NAME OF THE CONCEPT -->
    <section style="background-color: #f4f6fa; padding: 100px 0">
      <div class="container">
        <h2 class="header-title">Design 1</h2>

        <div class="thha-SLUG thha-presets-1">
          <!-- real, complete markup -->
        </div>
      </div>
    </section>

    <!-- Design 2 : … repeat through Design 5 -->

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="./js/SLUG.js"></script>
  </body>
</html>
```

Rules that are not negotiable:

- One `<section>` per design, backgrounds alternating light/white (`#f4f6fa` or `#f8f9fc` ↔ `#ffffff`), `padding: 100px 0` inline on the section. This inline style is the repo convention — keep it.
- Every section carries `<h2 class="header-title">Design N</h2>`.
- The preset wrapper is `<div class="thha-SLUG thha-presets-N">` — both classes, always.
- An HTML comment above each section naming the design concept (`<!-- Design 3 : Magnetic hover with rising fill -->`). This is how the existing widgets document themselves.
- Drop the two `<script>` tags when there's no `js/`.
- Semantic elements and real accessibility: `<a>` for navigation, `<button>` for actions, `aria-expanded` on disclosure triggers, `aria-hidden="true"` on decorative icons, `alt` on content images. A visually-hidden `aria-live` region when JS changes state.

## Step 4 — Write `scss/<slug>.scss`

Base chrome first — re-declared per widget so the folder stays drop-in portable:

```scss
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

button {
  background: none;
  border: 0;
  cursor: pointer;
  color: inherit;
  font: inherit;
}

a {
  text-decoration: none;
}

.container {
  width: 100%;
  max-width: 1320px;
  margin: auto;
  padding: 0 20px;

  .header-title {
    color: #df0463;
    font-size: 28px;
    font-weight: 900;
    line-height: 22px;
    text-align: center;
    margin: 38px 0 50px 0;
  }
}

.thha-SLUG {
  font-family: "Poppins", sans-serif;
  color: #0f172a;

  /* =====================================================================
     Design 1 — CONCEPT NAME
     One or two lines on what the design is doing and why.
     ===================================================================== */
  &.thha-presets-1 {
    // complete styles
  }

  /* … through Design 5 */
}
```

- Every preset lives in an `&.thha-presets-N` block under the single root selector. Nothing escapes `.thha-SLUG`.
- Banner comments introduce each design, matching the style above — the existing widgets read as documented source, not dumped CSS.
- Use CSS custom properties for values JS drives (`--thha-mx`, `--thha-fill`) so behaviour stays in CSS and JS only publishes numbers.
- Responsive: each design must hold at 1320px, tablet, and ~375px. Use `clamp()` for type and `flex-wrap` / `grid` that reflows, and add explicit breakpoints where reflow alone isn't enough.
- Honour `@media (prefers-reduced-motion: reduce)` wherever a design animates — drop the motion, keep the end state.
- Interactive elements get real `:hover`, `:focus-visible`, and `:active` states. A focus ring that only appears on keyboard focus is the standard.

## Step 5 — Write `js/<slug>.js` (only if needed)

```js
(function ($) {
  "use strict";

  var REDUCED_MOTION =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------
     Design N — what this does and why it's JS rather than CSS.
  ------------------------------------------------------------------ */
  function thhaSlugFeature(scope) {
    var $root = $(scope);
    if (!$root.length) return;
    // …
  }

  $(document).ready(function () {
    thhaSlugFeature(".thha-presets-1");
    thhaSlugFeature(".thha-presets-3");
  });
})(jQuery);
```

- jQuery IIFE + `$(document).ready`. Vanilla-JS modules are out of pattern here.
- One named function per behaviour, taking a preset selector, called once per preset that uses it. This is the repo's per-design initialization pattern.
- Guard every function with `if (!$root.length) return;` so a widget page missing that preset doesn't throw.
- Feature-detect pointer type (`matchMedia("(pointer: fine)")`) before wiring mouse-tracking, and treat the touch path as a designed fallback, not a broken one.
- Build DOM nodes with jQuery/`document.createElement`, not HTML string concatenation — labels containing `&` or quotes must not be able to break the markup.

## Step 6 — Compile the SCSS

The `.css` is what the browser loads and **it is committed**. A widget with no compiled CSS is unfinished.

VS Code's Live Sass Compiler handles this on save when it's running. It usually isn't, in an agent session — so compile explicitly:

```bash
npx --yes sass --style=expanded --source-map <batch>/<slug>/scss/<slug>.scss <batch>/<slug>/scss/<slug>.css
```

(Verified available in this environment — there is no global `sass` binary, `npx` fetches it.)

Confirm afterwards that `<slug>.css` and `<slug>.css.map` both exist and the `.css` ends with a `sourceMappingURL` comment. Report which path was taken. Never leave a missing or stale `.css` unmentioned.

## Step 7 — Verify before reporting done

Work through this list and state the result:

1. `<slug>.css` and `.css.map` exist and are newer than the `.scss`.
2. Every `thha-presets-N` in the HTML has a matching `&.thha-presets-N` block in the SCSS, and vice versa — no orphans either way.
3. No `TODO`, no placeholder comment, no empty preset block, in any of the three files.
4. Every class in the HTML starts with `thha-` (except `container` and `header-title`).
5. If `js/` exists, the HTML loads jQuery *before* it, and every `thha…` function referenced in `ready()` is defined.
6. Grep the HTML for the icon classes used and confirm they're real Font Awesome 6 names.

A quick check for 2 and 3:

```bash
grep -o 'thha-presets-[0-9]' <batch>/<slug>/<slug>.html | sort -u
grep -o 'thha-presets-[0-9]' <batch>/<slug>/scss/<slug>.scss | sort -u
grep -rn 'TODO\|FIXME\|Lorem ipsum' <batch>/<slug>/
```

Offer to open the page on the Live Server port (5502) or `python3 -m http.server` so the user can see it.

## Step 8 — Launcher entry

Root `index.html` is hand-maintained and historically lists only the `23-01-2026/` batch. **Ask** before adding — don't append silently:

```html
<li>
  <a target="_blank" href="./<batch>/<slug>/<slug>.html"> TITLE_CASE </a>
</li>
```

## Design quality bar

Five designs on one page means five *genuinely different* ideas — not one design in five colourways. Vary the structural approach: layout (stacked / split / grid / marquee), the interaction (hover reveal, scroll-triggered, click-to-expand, cursor-tracked), and the visual register (flat, glass, bordered, shadowed, gradient). If two presets would screenshot nearly identically, replace one.

Palette discipline: pick one palette and hold it across all five. The repo's accent is `#df0463`; slate neutrals (`#0f172a`, `#475569`, `#94a3b8`, `#e2e8f0`) carry the rest. Per-design accent variants belong on modifier classes (`thha-bh-card--sunset`), not new base palettes.

Avoid the generic-AI-preview tells: uniform 8px radius everywhere, a purple-blue gradient on every CTA, three identical feature cards, drop shadows with no light source, centre-aligned everything.

## What NOT to do

- Do not use a class prefix other than `thha-`.
- Do not vendor jQuery, Font Awesome, or Google Fonts locally — CDN links are the convention.
- Do not hand-edit `<slug>.css`; edit the `.scss` and recompile.
- Do not extract `.container` / `.header-title` into a shared stylesheet — each widget redeclares them on purpose.
- Do not collapse the five `<section>` wrappers into one, or drop the alternating backgrounds.
- Do not add a build system, package.json, bundler, or framework to this repo.
- Do not ship a preset you haven't styled. Finish it, or say plainly which one is unfinished and why.
