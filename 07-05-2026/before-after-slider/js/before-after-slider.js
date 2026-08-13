(function ($) {
  "use strict";

  var REDUCED_MOTION =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var HAS_IO = "IntersectionObserver" in window;

  function clamp(n, min, max) {
    return Math.max(min, Math.min(n, max));
  }

  function announce(el, message) {
    var $sr = $(el).closest(".thha-before-after-slider").find(".thha-bas-sr");
    if (!$sr.length) return;
    $sr.text(message);
    window.setTimeout(function () {
      $sr.text("");
    }, 2200);
  }

  /* Fire once, the first time the element is scrolled into view. */
  function onceInView(el, cb) {
    if (!HAS_IO || REDUCED_MOTION) {
      cb();
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          cb();
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.4 }
    );

    io.observe(el);
  }

  /* ------------------------------------------------------------------
     Designs 1, 2 and 4 — Drag comparison.
     One implementation serves every dragged slider: everything downstream
     reads a single --thha-pos percentage, so the only per-instance work
     is which pointer coordinate feeds it, which arrow keys move it, and
     whether it plays an opening sweep.
  ------------------------------------------------------------------ */
  function thhaBasDrag(scope) {
    var $root = $(scope);
    if (!$root.length) return;

    $root.find("[data-thha-drag]").each(function () {
      var frame = this;
      var $frame = $(frame);
      var vertical = $frame.attr("data-orientation") === "vertical";
      var handle = $frame.find(".thha-bas-handle")[0];
      var $readout = $frame.find(".thha-bas-readout-n");
      if (!handle) return;

      var unit = $frame.attr("data-thha-unit") || "revealed";
      var from = parseFloat($frame.attr("data-thha-from"));
      var hasOpening = !isNaN(from);

      var pos = hasOpening ? from : 50;
      var dragging = false;

      function paint() {
        frame.style.setProperty("--thha-pos", pos + "%");

        var rounded = Math.round(pos);
        handle.setAttribute("aria-valuenow", String(rounded));
        handle.setAttribute("aria-valuetext", rounded + "% " + unit);

        if ($readout.length) $readout.text(rounded);

        // a corner label would otherwise sit on the wrong side of the
        // divider once it reaches the extremes
        $frame.toggleClass("is-near-start", pos < 12);
        $frame.toggleClass("is-near-end", pos > 88);
      }

      function setFromPointer(e) {
        var rect = frame.getBoundingClientRect();
        var raw = vertical
          ? ((e.clientY - rect.top) / rect.height) * 100
          : ((e.clientX - rect.left) / rect.width) * 100;
        pos = clamp(raw, 0, 100);
        paint();
      }

      function start(e) {
        dragging = true;
        $frame.addClass("is-dragging").removeClass("is-hinting");
        setFromPointer(e);
        if (frame.setPointerCapture && e.pointerId !== undefined) {
          frame.setPointerCapture(e.pointerId);
        }
      }

      function move(e) {
        if (!dragging) return;
        // once a drag is under way the gesture owns the pointer
        if (e.cancelable) e.preventDefault();
        setFromPointer(e);
      }

      function end() {
        dragging = false;
        $frame.removeClass("is-dragging");
      }

      if (window.PointerEvent) {
        frame.addEventListener("pointerdown", start);
        frame.addEventListener("pointermove", move);
        frame.addEventListener("pointerup", end);
        frame.addEventListener("pointercancel", end);
      } else {
        frame.addEventListener("mousedown", start);
        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", end);
      }

      // a drag-only control would be unusable from the keyboard
      handle.addEventListener("keydown", function (e) {
        var back = vertical ? "ArrowUp" : "ArrowLeft";
        var fwd = vertical ? "ArrowDown" : "ArrowRight";
        var step = 0;

        if (e.key === back) step = -2;
        else if (e.key === fwd) step = 2;
        else if (e.key === "PageUp") step = -10;
        else if (e.key === "PageDown") step = 10;
        else if (e.key === "Home") step = -100;
        else if (e.key === "End") step = 100;
        else return;

        e.preventDefault();
        $frame.removeClass("is-hinting");
        pos = clamp(pos + step, 0, 100);
        paint();
      });

      /* Two openings share one mechanism. A slider given data-thha-from
         starts there and sweeps once to its resting position — the
         cinematic reveal. Everything else nudges either side of centre so
         the handle reads as draggable without a caption saying so. */
      function play() {
        if (REDUCED_MOTION) return;
        $frame.addClass("is-hinting");

        var steps = hasOpening ? [50] : [64, 36, 50];
        var gap = hasOpening ? 1500 : 620;

        steps.forEach(function (value, i) {
          window.setTimeout(
            function () {
              if (dragging) return;
              pos = value;
              paint();
            },
            420 + i * gap
          );
        });

        window.setTimeout(function () {
          $frame.removeClass("is-hinting");
        }, 420 + steps.length * gap);
      }

      paint();

      if ($frame.is("[data-thha-hint]")) {
        onceInView(frame, play);
      }
    });
  }

  /* ------------------------------------------------------------------
     Design 3 — Spotlight lens. Pointer Events rather than mouse events so
     a touch drag moves the lens too; the frame keeps vertical panning so
     the page can still be scrolled past it.
  ------------------------------------------------------------------ */
  function thhaBasLens(scope) {
    var $root = $(scope);
    if (!$root.length) return;

    $root.find("[data-thha-lens]").each(function () {
      var lens = this;
      var $lens = $(lens);
      var pending = false;
      var lastX = 0;
      var lastY = 0;

      function publish() {
        pending = false;
        var rect = lens.getBoundingClientRect();
        lens.style.setProperty("--thha-mx", lastX - rect.left + "px");
        lens.style.setProperty("--thha-my", lastY - rect.top + "px");
      }

      function track(e) {
        lastX = e.clientX;
        lastY = e.clientY;
        $lens.addClass("is-active");
        if (pending) return;
        pending = true;
        window.requestAnimationFrame(publish);
      }

      if (window.PointerEvent) {
        lens.addEventListener("pointermove", track);
        lens.addEventListener("pointerdown", track);
        lens.addEventListener("pointerleave", function () {
          $lens.removeClass("is-active");
        });
      } else {
        lens.addEventListener("mousemove", track);
        lens.addEventListener("mouseleave", function () {
          $lens.removeClass("is-active");
        });
      }
    });
  }

  /* ------------------------------------------------------------------
     Design 5 — Product set, click to compare.
     Clicking walks the divider to the point you clicked rather than
     asking for a grab, and the thumbnail row swaps which product is on
     the stage without leaving the section.
  ------------------------------------------------------------------ */
  function thhaBasShop(scope) {
    var $root = $(scope);
    if (!$root.length) return;

    $root.find(".thha-bas-shop").each(function () {
      var $shop = $(this);
      var stage = $shop.find("[data-thha-stage]")[0];
      var $stage = $(stage);
      var $after = $shop.find(".thha-bas-stage-after");
      var $before = $shop.find(".thha-bas-stage-before");
      var $name = $shop.find(".thha-bas-shop-name");
      var $meta = $shop.find(".thha-bas-shop-meta");
      var $thumbs = $shop.find(".thha-bas-thumb");
      if (!stage || !$thumbs.length) return;

      var pos = 50;
      var total = $thumbs.length;

      function paint() {
        stage.style.setProperty("--thha-pos", pos + "%");

        var rounded = Math.round(pos);
        stage.setAttribute("aria-valuenow", String(rounded));
        stage.setAttribute("aria-valuetext", rounded + "% retouched");

        $stage.toggleClass("is-near-start", pos < 12);
        $stage.toggleClass("is-near-end", pos > 88);
      }

      stage.addEventListener("click", function (e) {
        var rect = stage.getBoundingClientRect();
        pos = clamp(((e.clientX - rect.left) / rect.width) * 100, 0, 100);
        $stage.addClass("is-used");
        paint();
      });

      // the stage is the slider, so it answers the keyboard directly
      stage.addEventListener("keydown", function (e) {
        var step = 0;

        if (e.key === "ArrowLeft") step = -4;
        else if (e.key === "ArrowRight") step = 4;
        else if (e.key === "Home") step = -100;
        else if (e.key === "End") step = 100;
        else return;

        e.preventDefault();
        $stage.addClass("is-used");
        pos = clamp(pos + step, 0, 100);
        paint();
      });

      $thumbs.on("click", function () {
        var $thumb = $(this);
        if ($thumb.attr("aria-pressed") === "true") return;

        var src = $thumb.attr("data-src");
        var name = $thumb.attr("data-name") || "Product";
        var alt = $thumb.attr("data-alt") || "";
        var index = $thumbs.index($thumb);

        $thumbs.attr("aria-pressed", "false");
        $thumb.attr("aria-pressed", "true");

        // hold the frame blank only until the new frame has decoded, so
        // the swap never shows a half-loaded image
        $stage.addClass("is-swapping");

        var loader = new Image();
        loader.onload = function () {
          $after.attr({ src: src, alt: alt });
          $before.attr("src", src);
          $name.text(name);
          $meta.text("Studio retouch · " + (index + 1) + " of " + total);

          pos = 50;
          paint();

          window.setTimeout(function () {
            $stage.removeClass("is-swapping");
          }, 40);
        };

        // a cached or failed image must not leave the stage stuck blank
        loader.onerror = function () {
          $stage.removeClass("is-swapping");
        };

        loader.src = src;

        announce(stage, name + " loaded for comparison");
      });

      paint();
    });
  }

  $(document).ready(function () {
    thhaBasDrag(".thha-before-after-slider.thha-presets-1");
    thhaBasDrag(".thha-before-after-slider.thha-presets-2");
    thhaBasLens(".thha-before-after-slider.thha-presets-3");
    thhaBasDrag(".thha-before-after-slider.thha-presets-4");
    thhaBasShop(".thha-before-after-slider.thha-presets-5");
  });
})(jQuery);
