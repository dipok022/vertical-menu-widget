(function ($) {
  "use strict";

  /* =========================================================
     Design 1 — Action Suite
     ========================================================= */
  function thhaBgPreset1(scope) {
    var $root = $(scope);
    if (!$root.length) return;

    /* --- Add to Cart -> Quantity selector --- */
    var $cart = $root.find(".thha-bg-cart");
    var qty = 1;

    $cart.on("click", function (e) {
      // Ignore clicks on the qty steppers when in qty state.
      if ($(e.target).closest(".thha-bg-step").length) return;
      if ($cart.attr("data-state") === "idle") {
        $cart.attr("data-state", "qty");
      }
    });

    $cart.on("click", ".thha-bg-step", function (e) {
      e.stopPropagation();
      var step = parseInt($(this).data("step"), 10) || 0;
      qty = Math.max(1, Math.min(99, qty + step));
      $cart.find(".thha-bg-qty").text(qty);
    });

    $cart.on("click", ".thha-bg-confirm", function (e) {
      e.stopPropagation();
      var $confirm = $(this);
      $confirm.addClass("is-confirmed");
      setTimeout(function () {
        $confirm.removeClass("is-confirmed");
        $cart.attr("data-state", "idle");
        qty = 1;
        $cart.find(".thha-bg-qty").text(qty);
      }, 1100);
    });

    /* --- Like with counter --- */
    var $like = $root.find(".thha-bg-like");
    var $likeLabel = $like.find(".thha-bg-like__label");
    var $likeCount = $like.find(".thha-bg-like__count");
    var likeBase = parseInt($likeCount.attr("data-count"), 10) || 0;
    var liked = false;

    $like.on("click", function () {
      liked = !liked;
      $like.toggleClass("is-liked", liked).attr("aria-pressed", liked);
      $likeLabel.text(liked ? "LIKED" : "LIKE");
      var next = likeBase + (liked ? 1 : 0);
      $likeCount
        .text(next)
        .css("transform", "translateY(-4px)")
        .css("opacity", "0");
      setTimeout(function () {
        $likeCount.css("transform", "").css("opacity", "");
      }, 30);
    });

    /* --- Play / Pause with progress --- */
    var $play = $root.find(".thha-bg-play");
    var $progress = $play.find(".thha-bg-play__progress");
    var $current = $play.find(".thha-bg-play__current");
    var $total = $play.find(".thha-bg-play__total");
    var totalSeconds = parseTime($total.text() || "5:23");
    var elapsed = 0;
    var ticker = null;

    $play.on("click", function () {
      if ($play.attr("data-state") === "playing") {
        $play.attr("data-state", "paused");
        clearInterval(ticker);
        ticker = null;
        return;
      }
      $play.attr("data-state", "playing");
      ticker = setInterval(function () {
        elapsed = (elapsed + 1) % (totalSeconds + 1);
        $current.text(formatTime(elapsed));
        $progress.css("width", (elapsed / totalSeconds) * 100 + "%");
        if (elapsed === 0) {
          $play.attr("data-state", "paused");
          clearInterval(ticker);
          ticker = null;
        }
      }, 1000);
    });

    function parseTime(s) {
      var p = String(s).split(":");
      return parseInt(p[0], 10) * 60 + parseInt(p[1], 10);
    }
    function formatTime(t) {
      var m = Math.floor(t / 60);
      var s = t % 60;
      return m + ":" + (s < 10 ? "0" : "") + s;
    }
  }

  /* =========================================================
     Design 2 — Segmented + Tab list
     ========================================================= */
  function thhaBgPreset2(scope) {
    var $root = $(scope);
    if (!$root.length) return;

    /* Segmented with sliding indicator */
    var $segWrap = $root.find(".thha-bg-segmented");
    var $indicator = $segWrap.find(".thha-bg-indicator");

    function moveIndicator($btn) {
      if (!$btn.length) return;
      var wrapOffset = $segWrap.offset().left;
      var btnOffset = $btn.offset().left;
      var x = btnOffset - wrapOffset - 6; /* matches 6px padding */
      $indicator.css({
        width: $btn.outerWidth() + "px",
        transform: "translateX(" + x + "px)",
      });
    }

    moveIndicator($segWrap.find(".thha-bg-seg.is-active"));

    $segWrap.on("click", ".thha-bg-seg", function () {
      var $btn = $(this);
      $segWrap.find(".thha-bg-seg")
        .removeClass("is-active")
        .attr("aria-selected", "false");
      $btn.addClass("is-active").attr("aria-selected", "true");
      moveIndicator($btn);
    });

    $(window).on("resize.thhaBgPreset2", function () {
      moveIndicator($segWrap.find(".thha-bg-seg.is-active"));
    });

    /* Tab list (Inbox/Sent/Archived) */
    var $tabList = $root.find(".thha-bg-tablist");
    $tabList.on("click", ".thha-bg-tab", function () {
      $tabList.find(".thha-bg-tab").removeClass("is-active");
      $(this).addClass("is-active");
    });
  }

  /* =========================================================
     Design 3 — Split Buttons + Launch
     ========================================================= */
  function thhaBgPreset3(scope) {
    var $root = $(scope);
    if (!$root.length) return;

    /* Split buttons */
    $root.on("click", ".thha-bg-split__more", function (e) {
      e.stopPropagation();
      var $split = $(this).closest(".thha-bg-split");
      $root.find(".thha-bg-split").not($split).removeClass("is-open");
      $split.toggleClass("is-open");
    });

    /* Bump badge counter on main click */
    $root.on("click", ".thha-bg-split__main", function () {
      var $split = $(this).closest(".thha-bg-split");
      var $badge = $split.find(".thha-bg-split__badge");
      var current = parseInt($badge.attr("data-count"), 10) || 0;
      var next = current + 1;
      $badge.attr("data-count", next).text(next);
      $split.removeClass("is-bumped");
      // Force reflow so animation re-triggers.
      void $split[0].offsetWidth;
      $split.addClass("is-bumped");
    });

    /* Click outside closes menus */
    $(document).on("click.thhaBgPreset3", function (e) {
      if (!$(e.target).closest(".thha-bg-split").length) {
        $root.find(".thha-bg-split").removeClass("is-open");
      }
    });

    /* Launch project */
    var $launch = $root.find(".thha-bg-launch");
    var $launchLabel = $launch.find(".thha-bg-launch__label");
    var originalText = $launchLabel.text();

    $launch.on("click", ".thha-bg-launch__main", function () {
      if ($launch.attr("data-state") !== "idle") return;
      $launch.attr("data-state", "loading");
      $launchLabel.text("Launching…");
      setTimeout(function () {
        $launch.attr("data-state", "done");
        $launchLabel.text("Launched");
      }, 1800);
      setTimeout(function () {
        $launch.attr("data-state", "idle");
        $launchLabel.text(originalText);
      }, 3600);
    });
  }

  /* =========================================================
     Design 4 — Toolset
     ========================================================= */
  function thhaBgPreset4(scope) {
    var $root = $(scope);
    if (!$root.length) return;

    $root.on("click", ".thha-bg-align__btn", function () {
      var $btn = $(this);
      $btn.closest(".thha-bg-align")
        .find(".thha-bg-align__btn")
        .removeClass("is-active");
      $btn.addClass("is-active");
    });

    $root.on("click", ".thha-bg-rating__btn", function () {
      var $btn = $(this);
      $btn.closest(".thha-bg-rating")
        .find(".thha-bg-rating__btn")
        .removeClass("is-active");
      // Restart bounce animation.
      void $btn[0].offsetWidth;
      $btn.addClass("is-active");
    });

    $root.on("click", ".thha-bg-actions__btn:not(.is-disabled)", function () {
      var $btn = $(this);
      $btn.removeClass("is-pulse");
      void $btn[0].offsetWidth;
      $btn.addClass("is-pulse");
    });
  }

  /* =========================================================
     Design 5 — Pricing Pill
     ========================================================= */
  function thhaBgPreset5(scope) {
    var $root = $(scope);
    if (!$root.length) return;

    var $pill = $root.find(".thha-bg-pill");
    var $indicator = $pill.find(".thha-bg-pill__indicator");
    var $priceCard = $root.find(".thha-bg-price");

    function move($btn) {
      if (!$btn.length) return;
      var wrapOffset = $pill.offset().left;
      var btnOffset = $btn.offset().left;
      var x = btnOffset - wrapOffset - 6;
      $indicator.css({
        width: $btn.outerWidth() + "px",
        transform: "translateX(" + x + "px)",
      });
    }

    function showPlan(plan) {
      $priceCard.find(".thha-bg-price__item").removeClass("is-active");
      $priceCard
        .find('.thha-bg-price__item[data-plan="' + plan + '"]')
        .addClass("is-active");
      $priceCard.attr("data-plan", plan);
    }

    move($pill.find(".thha-bg-pill__btn.is-active"));

    $pill.on("click", ".thha-bg-pill__btn", function () {
      var $btn = $(this);
      $pill
        .find(".thha-bg-pill__btn")
        .removeClass("is-active")
        .attr("aria-selected", "false");
      $btn.addClass("is-active").attr("aria-selected", "true");
      move($btn);
      showPlan($btn.data("plan"));
    });

    $(window).on("resize.thhaBgPreset5", function () {
      move($pill.find(".thha-bg-pill__btn.is-active"));
    });
  }

  $(document).ready(function () {
    thhaBgPreset1(".thha-button-group.thha-presets-1");
    thhaBgPreset2(".thha-button-group.thha-presets-2");
    thhaBgPreset3(".thha-button-group.thha-presets-3");
    thhaBgPreset4(".thha-button-group.thha-presets-4");
    thhaBgPreset5(".thha-button-group.thha-presets-5");
  });
})(jQuery);
