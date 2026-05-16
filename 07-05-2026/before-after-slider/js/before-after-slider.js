(function ($) {
  "use strict";

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function getPointX(ev) {
    if (ev.touches && ev.touches.length) return ev.touches[0].clientX;
    if (
      ev.originalEvent &&
      ev.originalEvent.touches &&
      ev.originalEvent.touches.length
    )
      return ev.originalEvent.touches[0].clientX;
    return ev.clientX;
  }

  function getPointY(ev) {
    if (ev.touches && ev.touches.length) return ev.touches[0].clientY;
    if (
      ev.originalEvent &&
      ev.originalEvent.touches &&
      ev.originalEvent.touches.length
    )
      return ev.originalEvent.touches[0].clientY;
    return ev.clientY;
  }

  /* ============================================
     Design 1 — Classic Drag Slider
  ============================================ */
  function thhaBasPreset1(scope) {
    var $stage = $(scope).find('.thha-bas-stage[data-bas="drag"]');
    if (!$stage.length) return;

    var $after = $stage.find(".thha-bas-after");
    var $divider = $stage.find(".thha-bas-divider");
    var dragging = false;

    function setPos(pct) {
      pct = clamp(pct, 0, 100);
      $after.css("width", pct + "%");
      $divider.css("left", pct + "%");
      $stage.attr("data-pos", Math.round(pct));
    }

    function pctFromEvent(ev) {
      var rect = $stage[0].getBoundingClientRect();
      var x = getPointX(ev) - rect.left;
      return (x / rect.width) * 100;
    }

    setPos(50);

    $stage.on("mousedown touchstart", function (ev) {
      dragging = true;
      $stage.addClass("is-dragging");
      setPos(pctFromEvent(ev));
      ev.preventDefault();
    });

    $(document).on("mousemove touchmove", function (ev) {
      if (!dragging) return;
      setPos(pctFromEvent(ev));
    });

    $(document).on("mouseup touchend touchcancel", function () {
      if (!dragging) return;
      dragging = false;
      $stage.removeClass("is-dragging");
    });

    // entrance teaser
    setTimeout(function () {
      var t = 0;
      var seq = [62, 38, 50];
      (function step() {
        if (t >= seq.length) return;
        setPos(seq[t]);
        t++;
        setTimeout(step, 450);
      })();
    }, 450);
  }

  /* ============================================
     Design 2 — Hover Reveal Wipe
  ============================================ */
  function thhaBasPreset2(scope) {
    var $stage = $(scope).find('.thha-bas-stage[data-bas="hover"]');
    if (!$stage.length) return;

    var $after = $stage.find(".thha-bas-after");
    var $line = $stage.find(".thha-bas-line2");
    var $fill = $stage.find(".thha-bas-progress-fill");

    function setPct(pct) {
      pct = clamp(pct, 0, 100);
      $after.css("width", pct + "%");
      $line.css("left", pct + "%");
      $fill.css("width", pct + "%");
    }

    $stage.on("mouseenter touchstart", function () {
      $stage.addClass("is-engaged");
    });

    $stage.on("mousemove touchmove", function (ev) {
      var rect = $stage[0].getBoundingClientRect();
      var x = getPointX(ev) - rect.left;
      var pct = (x / rect.width) * 100;
      setPct(pct);
    });

    $stage.on("mouseleave touchend touchcancel", function () {
      $stage.removeClass("is-engaged");
      setPct(0);
    });

    setPct(0);
  }

  /* ============================================
     Design 3 — Spotlight Magnifier Lens
  ============================================ */
  function thhaBasPreset3(scope) {
    var $stage = $(scope).find('.thha-bas-stage[data-bas="lens"]');
    if (!$stage.length) return;

    var $lens = $stage.find(".thha-bas-lens");
    var $lensImg = $stage.find(".thha-bas-lens-img");

    function update(ev) {
      var rect = $stage[0].getBoundingClientRect();
      var x = getPointX(ev) - rect.left;
      var y = getPointY(ev) - rect.top;
      x = clamp(x, 0, rect.width);
      y = clamp(y, 0, rect.height);

      $lens.css({
        left: x + "px",
        top: y + "px",
      });

      var bx = (x / rect.width) * 100;
      var by = (y / rect.height) * 100;
      $lensImg.css("background-position", bx + "% " + by + "%");
    }

    $stage.on("mouseenter", function () {
      $stage.addClass("is-engaged");
    });

    $stage.on("mousemove", function (ev) {
      update(ev);
    });

    $stage.on("touchstart touchmove", function (ev) {
      $stage.addClass("is-engaged");
      update(ev);
      ev.preventDefault();
    });

    $stage.on("mouseleave touchend touchcancel", function () {
      $stage.removeClass("is-engaged");
    });
  }

  /* ============================================
     Design 4 — Vertical Split Slider
  ============================================ */
  function thhaBasPreset4(scope) {
    var $stage = $(scope).find('.thha-bas-stage[data-bas="vertical"]');
    if (!$stage.length) return;

    var $after = $stage.find(".thha-bas-after");
    var $divider = $stage.find(".thha-bas-vdivider");
    var dragging = false;

    function setPos(pct) {
      pct = clamp(pct, 0, 100);
      $after.css("height", pct + "%");
      $divider.css("top", 100 - pct + "%");
      $stage.attr("data-pos", Math.round(pct));
    }

    function pctFromEvent(ev) {
      var rect = $stage[0].getBoundingClientRect();
      var y = getPointY(ev) - rect.top;
      return 100 - (y / rect.height) * 100;
    }

    setPos(50);

    $stage.on("mousedown touchstart", function (ev) {
      dragging = true;
      $stage.addClass("is-dragging");
      setPos(pctFromEvent(ev));
      ev.preventDefault();
    });

    $(document).on("mousemove touchmove", function (ev) {
      if (!dragging) return;
      setPos(pctFromEvent(ev));
    });

    $(document).on("mouseup touchend touchcancel", function () {
      if (!dragging) return;
      dragging = false;
      $stage.removeClass("is-dragging");
    });

    setTimeout(function () {
      var t = 0;
      var seq = [62, 38, 50];
      (function step() {
        if (t >= seq.length) return;
        setPos(seq[t]);
        t++;
        setTimeout(step, 450);
      })();
    }, 600);
  }

  /* ============================================
     Design 5 — Autoplay Showcase
  ============================================ */
  function thhaBasPreset5(scope) {
    var $root = $(scope);
    var $stage = $root.find('.thha-bas-stage[data-bas="auto"]');
    if (!$stage.length) return;

    var $after = $stage.find(".thha-bas-after");
    var $line = $stage.find(".thha-bas-autoline");
    var $fill = $root.find(".thha-bas-track-fill");
    var $playBtn = $root.find(".thha-bas-ctrl--play");
    var $resetBtn = $root.find(".thha-bas-ctrl--reset");
    var $tabs = $root.find(".thha-bas-tab");

    var pos = 50;
    var direction = 1;
    var playing = true;
    var tickHandle = null;

    function applyPos(pct, instant) {
      pct = clamp(pct, 0, 100);
      pos = pct;
      $after.css({ width: pct + "%" });
      $line.css({ left: pct + "%" });
      $fill.css({ width: pct + "%" });
      if (instant) {
        $after.css("transition", "none");
        $line.css("transition", "none");
        $fill.css("transition", "none");
      } else {
        $after.css("transition", "");
        $line.css("transition", "");
        $fill.css("transition", "");
      }
    }

    function tick() {
      if (!playing) return;
      pos += direction * 0.7;
      if (pos >= 100) {
        pos = 100;
        direction = -1;
      } else if (pos <= 0) {
        pos = 0;
        direction = 1;
      }
      applyPos(pos, true);
    }

    function start() {
      stop();
      tickHandle = setInterval(tick, 28);
    }

    function stop() {
      if (tickHandle) {
        clearInterval(tickHandle);
        tickHandle = null;
      }
    }

    $playBtn.on("click", function () {
      playing = !playing;
      $playBtn.toggleClass("is-playing", playing);
      if (playing) {
        $stage.removeClass("is-tab-before is-tab-after");
        $tabs.removeClass("is-active").attr("aria-selected", "false");
        start();
      } else {
        stop();
      }
    });

    $resetBtn.on("click", function () {
      stop();
      pos = 50;
      direction = 1;
      $stage.removeClass("is-tab-before is-tab-after");
      $tabs.removeClass("is-active").attr("aria-selected", "false");
      applyPos(50, false);
      setTimeout(function () {
        playing = true;
        $playBtn.addClass("is-playing");
        start();
      }, 480);
    });

    $tabs.on("click", function () {
      var $btn = $(this);
      var which = $btn.data("tab");
      stop();
      playing = false;
      $playBtn.removeClass("is-playing");
      $tabs.removeClass("is-active").attr("aria-selected", "false");
      $btn.addClass("is-active").attr("aria-selected", "true");
      $stage.removeClass("is-tab-before is-tab-after");
      if (which === "before") {
        $stage.addClass("is-tab-before");
        applyPos(0, false);
      } else {
        $stage.addClass("is-tab-after");
        applyPos(100, false);
      }
    });

    $stage.on("mouseenter", function () {
      if (playing) stop();
    });
    $stage.on("mouseleave", function () {
      if (playing) start();
    });

    applyPos(50, false);
    start();
  }

  $(document).ready(function () {
    thhaBasPreset1(".thha-bas.thha-presets-1");
    thhaBasPreset2(".thha-bas.thha-presets-2");
    thhaBasPreset3(".thha-bas.thha-presets-3");
    thhaBasPreset4(".thha-bas.thha-presets-4");
    thhaBasPreset5(".thha-bas.thha-presets-5");
  });
})(jQuery);
