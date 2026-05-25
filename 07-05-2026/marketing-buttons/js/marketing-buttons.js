(function ($) {
  "use strict";

  /* ------------------------------------------------------------------
     Design 4 — Magnetic buttons: the button eases toward the cursor
     while hovered and springs back on leave. Pointer-capable devices
     only, so touch users keep a normal tap target.
  ------------------------------------------------------------------ */
  function thhaMbMagnetic(scope) {
    var $root = $(scope);
    if (!$root.length) return;

    var fine = window.matchMedia && window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;

    var strength = 0.35; // how far it leans toward the cursor (0–1)

    $root.find(".thha-mb-magnetic").each(function () {
      var $btn = $(this);

      $btn.on("mousemove", function (e) {
        var rect = this.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        $btn.css(
          "transform",
          "translate(" + x * strength + "px," + y * strength + "px)"
        );
      });

      $btn.on("mouseleave", function () {
        $btn.css("transform", "");
      });
    });
  }

  /* ------------------------------------------------------------------
     Design 5 — Morphing CTA: idle → loading → success → idle.
     Mimics an async subscribe/signup round-trip.
  ------------------------------------------------------------------ */
  function thhaMbMorph(scope) {
    var $root = $(scope);
    if (!$root.length) return;

    $root.find(".thha-mb-morph").on("click", function () {
      var $btn = $(this);
      if ($btn.attr("data-state") !== "idle") return; // ignore while busy

      $btn.attr("data-state", "loading");

      // fake network request, then show success
      setTimeout(function () {
        $btn.attr("data-state", "done");

        // settle back to the original state
        setTimeout(function () {
          $btn.attr("data-state", "idle");
        }, 1800);
      }, 1500);
    });
  }

  $(document).ready(function () {
    thhaMbMagnetic(".thha-marketing-buttons.thha-presets-4");
    thhaMbMorph(".thha-marketing-buttons.thha-presets-5");
  });
})(jQuery);
