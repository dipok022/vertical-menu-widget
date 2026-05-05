# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A collection of standalone, static HTML widget demos (vertical menus, team members, breadcrumbs, login, changelog, news ticker, support system, call-to-action, video gallery, interactive links, Instagram feed, WooCommerce category list). Each widget is a self-contained design preview — no build system, no package manager, no framework. Pages use vanilla HTML, compiled SCSS → CSS, and (where interactivity is needed) jQuery loaded from a CDN.

The repo is the source for the "ThemeHuge" widget set — the `thha-` CSS-class prefix throughout the codebase is the project's namespace.

## How to run

There is no `npm install` / `npm run` step. Open files via a static server:

- VS Code Live Server is the intended workflow (`.vscode/settings.json` pins it to port 5502).
- Or any static server from the repo root, e.g. `python3 -m http.server 8000`, then open `index.html`.

`index.html` is a hand-maintained launcher that links to a subset of widgets (currently the `23-01-2026/` batch). Widgets in other date folders are accessed by opening their HTML directly — `index.html` is **not** auto-generated, so adding a widget there is a manual edit.

## How to compile SCSS

Each widget keeps `scss/<widget>.scss` alongside its committed compiled output `scss/<widget>.css` and `scss/<widget>.css.map`. The `.css` files are checked in and consumed directly by the HTML — **the SCSS must be recompiled and the resulting `.css` committed** for style changes to show up in the browser.

The intended toolchain is the VS Code "Live Sass Compiler" extension (auto-compiles on save, writes the `.css` next to the `.scss`). If using the Dart Sass CLI instead:

```bash
sass <widget>/scss/<widget>.scss <widget>/scss/<widget>.css
```

There is no project-wide build script — compile per widget.

## Repository layout

Top-level folders are dated batches (`11-10-2025/`, `23-01-2026/`, `15-03-2026/`), each containing one folder per widget. A widget folder follows this shape:

```
<widget-name>/
  <widget-name>.html      # entry page; demonstrates every design variant
  scss/<widget-name>.scss # source styles
  scss/<widget-name>.css  # compiled output (committed)
  scss/<widget-name>.css.map
  js/<widget-name>.js     # optional, jQuery-based
  img/                    # optional, widget-local assets
```

`css/dashicons.css` at the repo root is a shared WordPress Dashicons stylesheet used by some widgets.

## Architectural conventions

- **Namespace.** All widget classes are prefixed `thha-` (e.g. `thha-team-members`, `thha-vertical-menu-wrapper`). Stay inside this prefix when adding widget-specific styles; do not bleed generic class names into the global scope.
- **Design variants via preset classes.** Each widget HTML demonstrates multiple visual designs on the same page, each wrapped in a `thha-presets-N` modifier (`thha-presets-1` through `thha-presets-5`, etc.). The SCSS is structured as `&.thha-presets-1 { ... } &.thha-presets-2 { ... }` blocks under the widget's root selector — adding a new design means adding both the markup block and the matching `&.thha-presets-N` SCSS branch. Each design is introduced by an `<h2 class="header-title">Design N</h2>` heading inside `.container`.
- **Demo page chrome.** Each widget HTML wraps every design in `<section><div class="container"><h2 class="header-title">Design N</h2> ... </div></section>`. The `.container` and `.header-title` styles are re-declared per widget SCSS; they are intentionally not shared across widgets so each widget folder remains drop-in portable.
- **jQuery is the JS runtime.** Widget JS uses `(function ($) { ... })(jQuery);` IIFEs and `$(document).ready(...)`. When a widget needs JS, jQuery is included via CDN in that widget's HTML — there is no shared bundle. Vanilla-JS solutions are out of pattern; match existing jQuery style.
- **Per-design JS initialization.** Where one widget has multiple interactive presets, the pattern is a function that takes a preset selector and is called once per active preset (see `11-10-2025/vertical-menu/js/vertical-menu.js` — `thhaVerticalMenu('.thha-presets-1'); thhaVerticalMenu('.thha-presets-2'); ...`). Follow this when adding a new interactive design.
- **External assets are CDN-linked, not vendored.** Font Awesome, Google Fonts, Unsplash placeholder images, and jQuery come from CDNs in each widget's `<head>`. Do not vendor them locally unless asked.

## Adding a new widget

1. Create `<date-folder>/<widget-name>/` with `<widget-name>.html`, `scss/<widget-name>.scss`, and (if needed) `js/<widget-name>.js`.
2. Compile the SCSS so `scss/<widget-name>.css` exists and is committed.
3. Inside the HTML, follow the multi-design pattern: one `<section>` per design, each containing `<div class="container"><h2 class="header-title">Design N</h2><div class="thha-<widget> thha-presets-N"> ... </div></div>`.
4. If the widget should appear on the launcher, add a `<li><a target="_blank" href="./<path>/<widget>.html">…</a></li>` entry to the root `index.html`.
