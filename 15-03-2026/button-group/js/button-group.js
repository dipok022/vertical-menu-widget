(function ($) {
  "use strict";

  function thhaBgPreset1(scope) {
    var $root = $(scope);
    if (!$root.length) return;

    var $cart = $root.find(".thha-bg-cart");
    if (!$cart.length) return;
    var qty = 1;

    $cart.on("click", function (e) {
      if ($(e.target).closest(".thha-bg-step, .thha-bg-confirm").length) return;
      if ($cart.attr("data-state") === "bg_group") {
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
        $cart.attr("data-state", "bg_group");
        qty = 1;
        $cart.find(".thha-bg-qty").text(qty);
      }, 1100);
    });
  }

  function thhaBgPreset2(scope) {
    var $root = $(scope);
    if (!$root.length) return;

    var $like = $root.find(".thha-bg-like");
    if (!$like.length) return;

    var $likeLabel = $like.find(".thha-bg-like-label");
    var $likeCount = $like.find(".thha-bg-like-count");
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
  }

  function thhaBgPreset3(scope) {
    var $root = $(scope);
    if (!$root.length) return;

    var $play = $root.find(".thha-bg-play");
    if (!$play.length) return;

    var $progress = $play.find(".thha-bg-play-progress");
    var $current = $play.find(".thha-bg-play-current");
    var $total = $play.find(".thha-bg-play-total");
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

  function thhaBgPreset4(scope) {
    var $root = $(scope);
    if (!$root.length) return;

    var $splits = $root.find(".thha-bg-split");
    if (!$splits.length) return;

    $root.on("click", ".thha-bg-split-more", function (e) {
      e.stopPropagation();
      var $split = $(this).closest(".thha-bg-split");
      $root.find(".thha-bg-split").not($split).removeClass("is-open");
      $split.toggleClass("is-open");
    });

    $root.on("click", ".thha-bg-split-main", function () {
      var $split = $(this).closest(".thha-bg-split");
      var $badge = $split.find(".thha-bg-split-badge");
      var current = parseInt($badge.attr("data-count"), 10) || 0;
      var next = current + 1;
      $badge.attr("data-count", next).text(next);
      $split.removeClass("is-bumped");
      void $split[0].offsetWidth;
      $split.addClass("is-bumped");
    });

    $root.on("click", ".thha-bg-split-menu li", function () {
      $(this).closest(".thha-bg-split").removeClass("is-open");
    });

    $(document).on("click.thhaBgPreset4", function (e) {
      if (!$(e.target).closest(".thha-bg-split").length) {
        $root.find(".thha-bg-split").removeClass("is-open");
      }
    });
  }

  function thhaBgPreset5(scope) {
    var $root = $(scope);
    if (!$root.length) return;

    var $share = $root.find(".thha-bg-share");
    if (!$share.length) return;

    var $btn = $share.find(".thha-bg-share-btn");

    function setOpen(open) {
      $share.attr("data-state", open ? "open" : "bg_group");
      $btn.attr("aria-expanded", open);
      $share.find(".thha-bg-share-list").attr("aria-hidden", !open);
    }

    $btn.on("click", function (e) {
      e.stopPropagation();
      setOpen($share.attr("data-state") !== "open");
    });

    $(document).on("click.thhaBgPreset5", function (e) {
      if (!$(e.target).closest(".thha-bg-share").length) {
        setOpen(false);
      }
    });

    $(document).on("keydown.thhaBgPreset5", function (e) {
      if (e.key === "Escape") setOpen(false);
    });

    $share.on("click", '.thha-bg-share-item[data-net="copy"]', function () {
      var $item = $(this);
      var $icon = $item.find("i");
      var originalClass = $icon.attr("class");
      var originalTip = $item.attr("data-tip");

      $icon.attr("class", "fa-solid fa-check");
      $item.attr("data-tip", "Copied!").addClass("is-copied");

      if (navigator.clipboard && window.location) {
        navigator.clipboard
          .writeText(window.location.href)
          .catch(function () {});
      }

      setTimeout(function () {
        $icon.attr("class", originalClass);
        $item.attr("data-tip", originalTip).removeClass("is-copied");
      }, 1400);
    });

    $share.on("click", ".thha-bg-share-item", function (e) {
      e.stopPropagation();
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
