(function ($) {
  "use strict";

  var FINE_POINTER =
    window.matchMedia && window.matchMedia("(pointer: fine)").matches;

  var REDUCED_MOTION =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------
     Design 1 — Spotlight: publish the pointer position to CSS custom
     properties so the gradient can follow it. Pointer-capable devices
     only; touch users get the static rim, which is the designed
     fallback rather than a degraded one.
  ------------------------------------------------------------------ */
  function thhaMbSpotlight(scope) {
    var $root = $(scope);
    if (!$root.length || !FINE_POINTER) return;

    $root.find("[data-thha-spotlight]").each(function () {
      var el = this;

      $(el).on("mousemove", function (e) {
        var rect = el.getBoundingClientRect();
        el.style.setProperty("--thha-mx", e.clientX - rect.left + "px");
        el.style.setProperty("--thha-my", e.clientY - rect.top + "px");
      });

      $(el).on("mouseleave", function () {
        el.style.removeProperty("--thha-mx");
        el.style.removeProperty("--thha-my");
      });
    });
  }

  /* ------------------------------------------------------------------
     Design 2 — Split the label into per-character windows. Each char
     carries its own index so the CSS can stagger the roll. Built via
     the DOM rather than an HTML string so quotes and ampersands in the
     label can never break the markup.
  ------------------------------------------------------------------ */
  function thhaMbSplit(scope) {
    var $root = $(scope);
    if (!$root.length) return;

    $root.find("[data-thha-split]").each(function () {
      var el = this;
      if (el.getAttribute("data-thha-split-done") === "true") return;

      var text = $(el).text();
      var frag = document.createDocumentFragment();

      for (var i = 0; i < text.length; i++) {
        // real spaces would collapse inside an inline-block, so use NBSP
        var ch = text.charAt(i) === " " ? " " : text.charAt(i);

        var win = document.createElement("span");
        win.className = "thha-mb-roll-char";

        var inner = document.createElement("span");
        inner.className = "thha-mb-roll-char-in";
        inner.style.setProperty("--thha-i", String(i));
        inner.setAttribute("data-char", ch);
        inner.textContent = ch;

        win.appendChild(inner);
        frag.appendChild(win);
      }

      el.textContent = "";
      el.appendChild(frag);
      el.setAttribute("data-thha-split-done", "true");
    });
  }

  /* ------------------------------------------------------------------
     Design 4 — Proximity magnet. The button reacts inside a radius
     around itself rather than waiting for a true hover, so the cursor
     is pulled in before it arrives. The shell and its contents move at
     different rates to give the label a shallower parallax depth.
  ------------------------------------------------------------------ */
  function thhaMbMagnet(scope) {
    var $root = $(scope);
    if (!$root.length || !FINE_POINTER || REDUCED_MOTION) return;

    var RADIUS = 110; // px of pull beyond the button's own box
    var SHELL_PULL = 0.32; // how far the shell leans toward the cursor
    var INNER_PULL = 0.14; // extra travel for the label/arrow layer

    var magnets = [];

    $root.find("[data-thha-magnet]").each(function () {
      magnets.push({
        el: this,
        $el: $(this),
        $inner: $(this).find(".thha-mb-magnet-inner"),
        near: false
      });
    });

    if (!magnets.length) return;

    var pending = false;
    var lastEvent = null;

    function release(m) {
      m.near = false;
      m.$el.removeClass("is-near");
      // drop the fast-follow transition so the CSS spring handles the
      // return, then clear the offsets
      m.$el.css({ transition: "", transform: "" });
      m.$inner.css({ transition: "", transform: "" });
    }

    function update() {
      pending = false;
      if (!lastEvent) return;

      var cx = lastEvent.clientX;
      var cy = lastEvent.clientY;

      for (var i = 0; i < magnets.length; i++) {
        var m = magnets[i];
        var rect = m.el.getBoundingClientRect();

        // distance from the cursor to the button's box, 0 when inside
        var dx = Math.max(rect.left - cx, 0, cx - rect.right);
        var dy = Math.max(rect.top - cy, 0, cy - rect.bottom);
        var distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > RADIUS) {
          if (m.near) release(m);
          continue;
        }

        if (!m.near) {
          m.near = true;
          m.$el.addClass("is-near");
          // while tracking, follow quickly instead of springing
          m.$el.css("transition", "transform .25s cubic-bezier(.22,1,.36,1)");
          m.$inner.css(
            "transition",
            "transform .25s cubic-bezier(.22,1,.36,1)"
          );
        }

        // offset from the button's centre, scaled by proximity so the
        // pull eases in at the edge of the radius instead of snapping
        var ox = cx - (rect.left + rect.width / 2);
        var oy = cy - (rect.top + rect.height / 2);
        var falloff = 1 - distance / RADIUS;

        m.$el.css(
          "transform",
          "translate(" +
            ox * SHELL_PULL * falloff +
            "px," +
            oy * SHELL_PULL * falloff +
            "px)"
        );
        m.$inner.css(
          "transform",
          "translate(" +
            ox * INNER_PULL * falloff +
            "px," +
            oy * INNER_PULL * falloff +
            "px)"
        );
      }
    }

    $(document).on("mousemove", function (e) {
      lastEvent = e;
      if (pending) return;
      pending = true;
      window.requestAnimationFrame(update);
    });

    // a scrolled page moves the buttons out from under the cursor
    $(window).on("scroll", function () {
      for (var i = 0; i < magnets.length; i++) {
        if (magnets[i].near) release(magnets[i]);
      }
    });
  }

  /* ------------------------------------------------------------------
     Design 5 — Morphing CTA: idle → busy → done → idle, with a real
     determinate progress ring rather than an indeterminate spinner, so
     the control communicates how much is left. State changes are
     mirrored to a live region for screen readers.
  ------------------------------------------------------------------ */
  function thhaMbMorph(scope) {
    var $root = $(scope);
    if (!$root.length) return;

    var RING = 119.38; // 2πr for the r=19 circle in the markup
    var DURATION = REDUCED_MOTION ? 400 : 1500;
    var HOLD = REDUCED_MOTION ? 900 : 1900;

    var $status = $root.find(".thha-mb-sr-status");

    $root.find("[data-thha-morph]").on("click", function () {
      var $btn = $(this);
      if ($btn.attr("data-state") !== "idle") return; // ignore while busy

      var $bar = $btn.find(".thha-mb-morph-ring-bar");
      var start = null;

      $btn.attr({ "data-state": "busy", "aria-busy": "true" });
      $status.text($btn.attr("data-label-busy") || "Working");
      $bar.css("stroke-dashoffset", RING);

      function settle() {
        $btn.attr({ "data-state": "done", "aria-busy": "false" });
        $status.text($btn.attr("data-label-done") || "Done");

        window.setTimeout(function () {
          $btn.attr("data-state", "idle");
          $bar.css("stroke-dashoffset", RING);
          $status.text("");
        }, HOLD);
      }

      function step(timestamp) {
        if (start === null) start = timestamp;

        var progress = Math.min((timestamp - start) / DURATION, 1);
        // ease-out: fast at first, then settling, like a real request
        var eased = 1 - Math.pow(1 - progress, 3);

        $bar.css("stroke-dashoffset", RING * (1 - eased));

        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          settle();
        }
      }

      window.requestAnimationFrame(step);
    });
  }

  $(document).ready(function () {
    thhaMbSpotlight(".thha-marketing-buttons.thha-presets-1");
    thhaMbSplit(".thha-marketing-buttons.thha-presets-2");
    thhaMbMagnet(".thha-marketing-buttons.thha-presets-4");
    thhaMbMorph(".thha-marketing-buttons.thha-presets-5");
  });
})(jQuery);
