(function ($) {
  "use strict";

  var REDUCED_MOTION =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Restart a CSS entrance animation. Removing the class is not enough on
     its own — the browser coalesces the remove/add into one frame and the
     animation never re-runs, so a forced reflow sits between them. */
  function replayClass($el, cls) {
    if (REDUCED_MOTION) return;
    $el.removeClass(cls);
    void $el[0].offsetWidth;
    $el.addClass(cls);
  }

  /* ------------------------------------------------------------------
     Design 2 — Guided tour. The spotlight is moved by copying the active
     pin's own --thha-x / --thha-y onto the stage, so a marker's position
     is declared once in the markup and never duplicated in JS.
  ------------------------------------------------------------------ */
  function thhaHtwTour(scope) {
    var $root = $(scope);
    if (!$root.length) return;

    $root.find("[data-thha-tour]").each(function () {
      var $tour = $(this);
      var $stage = $tour.find(".thha-htw-tour-stage");
      var $pins = $tour.find("[data-thha-step]");
      if (!$pins.length) return;

      var $panel = $tour.find(".thha-htw-tour-panel");
      var $title = $tour.find("[data-thha-title]");
      var $text = $tour.find("[data-thha-text]");
      var $index = $tour.find("[data-thha-index]");
      var $total = $tour.find("[data-thha-total]");
      var $bar = $tour.find("[data-thha-bar]");
      var $fill = $tour.find("[data-thha-fill]");
      var $play = $tour.find("[data-thha-play]");
      var $status = $tour.find(".thha-htw-sr-status");

      var count = $pins.length;
      var delay = parseInt($tour.attr("data-autoplay"), 10) || 4200;
      var current = 0;
      var timer = null;
      /* An autoplaying panel swaps copy out from under the reader, which is
         precisely what the reduced-motion preference asks us not to do — so
         it starts paused there and waits for an explicit press. */
      var playing = !REDUCED_MOTION;
      var hovering = false;

      $total.text(count);
      $bar.attr("aria-valuemax", count);

      function show(i, announce) {
        current = (i + count) % count;
        var $pin = $pins.eq(current);

        $pins.removeClass("is-active");
        $pin.addClass("is-active");

        /* move the spotlight to this pin's coordinates */
        $stage[0].style.setProperty(
          "--thha-fx",
          $pin[0].style.getPropertyValue("--thha-x") || "50%"
        );
        $stage[0].style.setProperty(
          "--thha-fy",
          $pin[0].style.getPropertyValue("--thha-y") || "50%"
        );

        $title.text($pin.attr("data-title") || "");
        $text.text($pin.attr("data-text") || "");
        $index.text(current + 1);
        $fill.css("width", ((current + 1) / count) * 100 + "%");
        $bar.attr("aria-valuenow", current + 1);

        replayClass($panel, "is-swapping");

        if (announce) {
          $status.text(
            "Step " + (current + 1) + " of " + count + ": " + $pin.attr("data-title")
          );
        }
      }

      function stop() {
        if (timer) {
          window.clearInterval(timer);
          timer = null;
        }
      }

      function start() {
        stop();
        if (!playing || hovering) return;
        timer = window.setInterval(function () {
          show(current + 1, false);
        }, delay);
      }

      function setPlaying(next) {
        playing = next;
        $play
          .attr("aria-pressed", String(playing))
          .attr("aria-label", playing ? "Pause the tour" : "Play the tour")
          .find("i")
          .attr("class", playing ? "fa-solid fa-pause" : "fa-solid fa-play");
        start();
      }

      $pins.on("click", function () {
        show($pins.index(this), true);
        setPlaying(false); // a direct pick means the visitor is steering
      });

      $tour.find("[data-thha-next]").on("click", function () {
        show(current + 1, true);
      });

      $tour.find("[data-thha-prev]").on("click", function () {
        show(current - 1, true);
      });

      $play.on("click", function () {
        setPlaying(!playing);
      });

      /* Autoplay that keeps moving while it is being read is hostile, so it
         holds still for the pointer and for keyboard focus alike. */
      $tour.on("mouseenter focusin", function () {
        hovering = true;
        stop();
      });

      $tour.on("mouseleave focusout", function () {
        hovering = false;
        start();
      });

      show(0, false);
      setPlaying(playing);
    });
  }

  /* ------------------------------------------------------------------
     Design 3 — Split explorer. Markers drive a panel beside the photo.
     Left/right arrows walk the set, which is the behaviour a grouped set
     of buttons is expected to have once one of them holds focus.
  ------------------------------------------------------------------ */
  function thhaHtwExplorer(scope) {
    var $root = $(scope);
    if (!$root.length) return;

    $root.find("[data-thha-explorer]").each(function () {
      var $ex = $(this);
      var $markers = $ex.find("[data-thha-marker]");
      if (!$markers.length) return;

      var $detail = $ex.find("[data-thha-detail]");
      var $thumb = $ex.find("[data-thha-thumb]");
      var $eyebrow = $ex.find("[data-thha-eyebrow]");
      var $title = $ex.find("[data-thha-title]");
      var $text = $ex.find("[data-thha-text]");
      var $index = $ex.find("[data-thha-index]");
      var $total = $ex.find("[data-thha-total]");
      var $status = $ex.find(".thha-htw-sr-status");

      var count = $markers.length;
      $total.text(count);

      function select(i, focus) {
        var idx = (i + count) % count;
        var $m = $markers.eq(idx);

        $markers.removeClass("is-active");
        $m.addClass("is-active");

        $thumb.attr("src", $m.attr("data-thumb"));
        $eyebrow.text($m.attr("data-eyebrow") || "");
        $title.text($m.attr("data-title") || "");
        $text.text($m.attr("data-text") || "");
        $index.text(idx + 1);

        replayClass($detail, "is-swapping");
        $status.text($m.attr("data-title") || "");

        if (focus) $m.trigger("focus");
      }

      $markers.on("click", function () {
        select($markers.index(this), false);
      });

      $markers.on("keydown", function (e) {
        var i = $markers.index(this);
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          e.preventDefault();
          select(i + 1, true);
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          e.preventDefault();
          select(i - 1, true);
        } else if (e.key === "Home") {
          e.preventDefault();
          select(0, true);
        } else if (e.key === "End") {
          e.preventDefault();
          select(count - 1, true);
        }
      });

      select(0, false);
    });
  }

  /* ------------------------------------------------------------------
     Design 5 — Filterable map. Legend chips gate which categories are on;
     a marker opens its card in place. Only one card is open at a time,
     which keeps overlapping cards from stacking into an unreadable pile.
  ------------------------------------------------------------------ */
  function thhaHtwMap(scope) {
    var $root = $(scope);
    if (!$root.length) return;

    $root.find("[data-thha-map]").each(function () {
      var $map = $(this);
      var $nodes = $map.find(".thha-htw-node");
      if (!$nodes.length) return;

      var $chips = $map.find("[data-thha-filter]");
      var $allChip = $map.find('[data-thha-filter="all"]');
      var $catChips = $chips.not($allChip);
      var $status = $map.find(".thha-htw-sr-status");

      function closeAll() {
        $nodes.removeClass("is-open");
        $nodes.find("[data-thha-node]").attr("aria-expanded", "false");
      }

      function activeSet() {
        var on = {};
        $catChips.each(function () {
          var $c = $(this);
          if ($c.hasClass("is-on")) on[$c.attr("data-thha-filter")] = true;
        });
        return on;
      }

      function applyFilter(announce) {
        var on = activeSet();
        var shown = 0;

        $nodes.each(function () {
          var $n = $(this);
          var visible = !!on[$n.attr("data-category")];
          $n.toggleClass("is-dimmed", !visible);
          if (visible) {
            shown++;
          } else if ($n.hasClass("is-open")) {
            $n.removeClass("is-open");
            $n.find("[data-thha-node]").attr("aria-expanded", "false");
          }
        });

        var everyOn = $catChips.length === $catChips.filter(".is-on").length;
        $allChip
          .toggleClass("is-on", everyOn)
          .attr("aria-pressed", String(everyOn));

        if (announce) {
          $status.text(
            shown === 0
              ? "No markers shown"
              : shown + (shown === 1 ? " marker shown" : " markers shown")
          );
        }
      }

      $catChips.on("click", function () {
        var $c = $(this);
        var next = !$c.hasClass("is-on");
        $c.toggleClass("is-on", next).attr("aria-pressed", String(next));
        applyFilter(true);
      });

      /* "All markers" is a reset, not a toggle — pressing it always ends
         with every category on, which is the only unsurprising outcome. */
      $allChip.on("click", function () {
        $catChips.addClass("is-on").attr("aria-pressed", "true");
        applyFilter(true);
      });

      $map.find("[data-thha-node]").on("click", function (e) {
        e.stopPropagation();
        var $pin = $(this);
        var $node = $pin.closest(".thha-htw-node");
        var isOpen = $node.hasClass("is-open");

        closeAll();

        if (!isOpen) {
          $node.addClass("is-open");
          $pin.attr("aria-expanded", "true");
          $status.text($node.find(".thha-htw-node-title").text());
        }
      });

      $map.on("keydown", function (e) {
        if (e.key !== "Escape") return;
        var $open = $nodes.filter(".is-open");
        if (!$open.length) return;
        closeAll();
        $open.find("[data-thha-node]").trigger("focus");
      });

      $(document).on("click", function (e) {
        if ($(e.target).closest(".thha-htw-node").length) return;
        closeAll();
      });

      applyFilter(false);
    });
  }

  $(document).ready(function () {
    thhaHtwTour(".thha-hotspot-tour-widget.thha-presets-2");
    thhaHtwExplorer(".thha-hotspot-tour-widget.thha-presets-3");
    thhaHtwMap(".thha-hotspot-tour-widget.thha-presets-5");
  });
})(jQuery);
