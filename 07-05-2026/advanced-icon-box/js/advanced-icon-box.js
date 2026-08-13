/* ============================================================================
   ADVANCED ICON BOX — behaviour layer

   Three opt-in hooks, each declared with a data attribute on the preset
   wrapper and each initialised once per preset that uses it:

     data-thha-reveal      stagger the children in when the group scrolls in
     data-thha-spotlight   cards track the pointer, writing the glow gradient
                           to the .thha-aib-spot-glow element's inline style
     data-thha-tilt        cards tilt toward the pointer, writing rotateX /
                           rotateY to the card's inline transform

   The stylesheet uses no CSS custom properties, so anything the pointer
   drives is written as a complete inline value rather than as a variable the
   CSS reads back. Each design degrades to a perfectly usable static card if
   the script never runs.
   ========================================================================== */

(function ($) {
  "use strict";

  var REDUCED_MOTION =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var FINE_POINTER =
    window.matchMedia &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ------------------------------------------------------------------
     Scroll entrance — used by all five presets. The observer is released
     as soon as a group has played, so the effect never re-fires on the
     way back up the page.
  ------------------------------------------------------------------ */
  function thhaAibReveal(scope) {
    var $root = $(scope).filter("[data-thha-reveal]");
    if (!$root.length) return;

    if (REDUCED_MOTION || !("IntersectionObserver" in window)) {
      $root.addClass("is-inview");
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-inview");
          observer.unobserve(entry.target); // play once, then stop watching
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );

    $root.each(function () {
      observer.observe(this);
    });
  }

  /* ------------------------------------------------------------------
     Design 1 — pointer spotlight. The whole radial-gradient is written to
     the glow element's inline background, so the stylesheet holds no
     custom property for it. Writes are throttled to one per frame because
     pointermove fires far faster than the compositor can use.
  ------------------------------------------------------------------ */
  function thhaAibSpotlight(scope) {
    var $root = $(scope).filter("[data-thha-spotlight]");
    if (!$root.length || REDUCED_MOTION) return;

    $root.children().each(function () {
      var card = this;
      var glow = card.querySelector(".thha-aib-spot-glow");
      if (!glow) return;

      var frame = 0;

      $(card).on("pointermove", function (e) {
        if (frame) return;
        frame = window.requestAnimationFrame(function () {
          frame = 0;
          var box = card.getBoundingClientRect();
          glow.style.background =
            "radial-gradient(280px circle at " +
            (e.clientX - box.left) +
            "px " +
            (e.clientY - box.top) +
            "px, rgba(124, 160, 255, 0.22), transparent 68%)";
        });
      });

      $(card).on("pointerleave", function () {
        if (frame) {
          window.cancelAnimationFrame(frame);
          frame = 0;
        }
      });
    });
  }

  /* ------------------------------------------------------------------
     Design 4 — pointer tilt. Deliberately gentle, and skipped entirely
     on coarse pointers, where a tilt keyed to a tap reads as a glitch
     rather than as depth.
  ------------------------------------------------------------------ */
  var MAX_TILT = 6; // degrees

  function thhaAibTilt(scope) {
    var $root = $(scope).filter("[data-thha-tilt]");
    if (!$root.length || REDUCED_MOTION || !FINE_POINTER) return;

    $root.children().each(function () {
      var card = this;
      var frame = 0;

      $(card).on("pointermove", function (e) {
        if (frame) return;
        frame = window.requestAnimationFrame(function () {
          frame = 0;
          var box = card.getBoundingClientRect();
          var px = (e.clientX - box.left) / box.width - 0.5; // -0.5 … 0.5
          var py = (e.clientY - box.top) / box.height - 0.5;

          /* the full transform goes straight onto inline style, so the
             stylesheet keeps only the resting rotateX(0deg) rotateY(0deg) */
          card.style.transform =
            "rotateX(" +
            (py * -MAX_TILT).toFixed(2) +
            "deg) rotateY(" +
            (px * MAX_TILT).toFixed(2) +
            "deg)";
        });
      });

      $(card).on("pointerleave", function () {
        if (frame) {
          window.cancelAnimationFrame(frame);
          frame = 0;
        }
        card.style.transform = "rotateX(0deg) rotateY(0deg)";
      });
    });
  }

  $(document).ready(function () {
    thhaAibReveal(".thha-advanced-icon-box.thha-presets-1");
    thhaAibReveal(".thha-advanced-icon-box.thha-presets-2");
    thhaAibReveal(".thha-advanced-icon-box.thha-presets-3");
    thhaAibReveal(".thha-advanced-icon-box.thha-presets-4");
    thhaAibReveal(".thha-advanced-icon-box.thha-presets-5");

    thhaAibSpotlight(".thha-advanced-icon-box.thha-presets-1");
    thhaAibTilt(".thha-advanced-icon-box.thha-presets-4");
  });
})(jQuery);
