---
name: scaffold-thha-widget
description: Scaffold a new ThemeHuge ("thha-") HTML widget under a dated batch folder. Creates the standard <widget>.html, scss/<widget>.scss, and js/<widget>.js files with the project's 5-design preset pattern, container/header-title chrome, jQuery CDN wiring, and namespaced classes. Use when the user asks to start a new widget, create a widget skeleton, scaffold a widget, or has just made an empty <widget>.html in a date-folder and wants the boilerplate filled in.
---

# Scaffold a ThemeHuge widget

Use this skill when the user wants to start a new widget in this repo, or when an empty `<widget>.html` exists in a date-folder and needs the boilerplate. **Do not invoke for unrelated edits** to existing widgets.

## What to confirm before writing

Ask the user (in one message — don't ping repeatedly) for whichever of these isn't already obvious from context:

1. **Widget name** (kebab-case, used for folder, file, class, and title — e.g. `business-hours`).
2. **Batch folder** — which dated folder it lives in (existing folders: `11-10-2025/`, `23-01-2026/`, `15-03-2026/`). Default to the newest existing batch unless the user specifies.
3. **Number of designs** — the project default is **5** (`thha-presets-1` through `thha-presets-5`). Only deviate if asked.
4. **Needs jQuery JS?** — most widgets do; if interactivity is purely CSS-driven, the `js/` folder can be omitted.

If the widget folder already exists with stubbed files, **read them first** and fill in rather than overwrite. Never clobber existing `<widget>.html`/`scss/`/`js/` content without confirming.

## Files to produce

For widget `<name>` under `<batch>/`:

### `<batch>/<name>/<name>.html`

Skeleton (replace `WIDGET_NAME` with kebab-case name, `WIDGET_TITLE` with Title Case for the `<title>` and design heading prose):

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>WIDGET_TITLE</title>
    <link rel="stylesheet" href="./scss/WIDGET_NAME.css" />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <!-- Design 1 -->
    <section style="background-color: #ffffff; padding: 100px 0">
      <div class="container">
        <h2 class="header-title">Design 1</h2>

        <div class="thha-WIDGET_NAME thha-presets-1">
          <!-- TODO: Design 1 markup -->
        </div>
      </div>
    </section>

    <!-- Design 2 -->
    <section style="background-color: #f8f9fc; padding: 100px 0">
      <div class="container">
        <h2 class="header-title">Design 2</h2>

        <div class="thha-WIDGET_NAME thha-presets-2">
          <!-- TODO: Design 2 markup -->
        </div>
      </div>
    </section>

    <!-- Design 3 -->
    <section style="background-color: #ffffff; padding: 100px 0">
      <div class="container">
        <h2 class="header-title">Design 3</h2>

        <div class="thha-WIDGET_NAME thha-presets-3">
          <!-- TODO: Design 3 markup -->
        </div>
      </div>
    </section>

    <!-- Design 4 -->
    <section style="background-color: #f8f9fc; padding: 100px 0">
      <div class="container">
        <h2 class="header-title">Design 4</h2>

        <div class="thha-WIDGET_NAME thha-presets-4">
          <!-- TODO: Design 4 markup -->
        </div>
      </div>
    </section>

    <!-- Design 5 -->
    <section style="background-color: #ffffff; padding: 100px 0">
      <div class="container">
        <h2 class="header-title">Design 5</h2>

        <div class="thha-WIDGET_NAME thha-presets-5">
          <!-- TODO: Design 5 markup -->
        </div>
      </div>
    </section>

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="./js/WIDGET_NAME.js"></script>
  </body>
</html>
```

If the widget needs no JS, omit the two `<script>` tags and skip creating `js/`.

### `<batch>/<name>/scss/<name>.scss`

```scss
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
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

.thha-WIDGET_NAME {
  font-family: "Poppins", sans-serif;

  &.thha-presets-1 {
    // TODO: Design 1 styles
  }

  &.thha-presets-2 {
    // TODO: Design 2 styles
  }

  &.thha-presets-3 {
    // TODO: Design 3 styles
  }

  &.thha-presets-4 {
    // TODO: Design 4 styles
  }

  &.thha-presets-5 {
    // TODO: Design 5 styles
  }
}
```

After writing the SCSS, **the matching `.css` and `.css.map` must exist** for the HTML to render styled. The intended workflow is the VS Code Live Sass Compiler extension auto-generating these on save. If that extension isn't running, run `sass <name>/scss/<name>.scss <name>/scss/<name>.css` to compile manually. Tell the user explicitly which path was taken — do not silently leave a missing `.css`.

### `<batch>/<name>/js/<name>.js` (if interactive)

```js
(function ($) {
  "use strict";

  $(document).ready(function () {
    // TODO: per-preset initialization
    // Pattern when each preset has its own behavior:
    //   thhaWIDGET(".thha-presets-1");
    //   thhaWIDGET(".thha-presets-2");
    //   ...
  });
})(jQuery);
```

## Update the launcher

`index.html` at the repo root is hand-maintained. After scaffolding, **ask** whether to add a launcher entry — don't add silently. If yes, append a `<li>` to the `<ul>` inside `.container`:

```html
<li>
  <a target="_blank" href="./<batch>/<name>/<name>.html"> WIDGET_TITLE </a>
</li>
```

The launcher historically only lists the `23-01-2026/` batch — adding entries for newer batches is a deliberate choice and worth confirming.

## What NOT to do

- Do not invent a different class prefix — every widget uses `thha-`.
- Do not vendor jQuery, Font Awesome, or Google Fonts locally; CDN links are the convention.
- Do not skip the `<h2 class="header-title">Design N</h2>` heading per section — every widget in the repo has it.
- Do not collapse the per-design `<section>` wrappers into a single shared one; alternating background colors per design is intentional.
- Do not declare shared `.container` / `.header-title` styles in a global stylesheet — each widget redeclares them so the folder stays drop-in portable.
