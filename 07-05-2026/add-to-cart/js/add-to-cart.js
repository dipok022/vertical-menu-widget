(function ($) {
  "use strict";

  /* ------------------------------------------------------------------
     Design 1 — Morphing add button: idle → loading → done → idle.
     The cart icon rolls off, a green wash fills, the label flips to
     "Added". Mimics an async add-to-cart round-trip, then resets.
  ------------------------------------------------------------------ */
  function thhaAtcRoll(scope) {
    var $root = $(scope);
    if (!$root.length) return;

    $root.find(".thha-atc-roll").on("click", function () {
      var $btn = $(this);
      if ($btn.attr("data-state") !== "idle") return; // ignore while busy

      $btn.attr("data-state", "loading");

      setTimeout(function () {
        $btn.attr("data-state", "done");

        setTimeout(function () {
          $btn.attr("data-state", "idle");
        }, 1900);
      }, 650);
    });
  }

  /* ------------------------------------------------------------------
     Design 2 — Quantity stepper bar: +/- updates the qty with a bump
     and recomputes the live total from data-unit-price. The add button
     flashes on click.
  ------------------------------------------------------------------ */
  function thhaAtcBar(scope) {
    var $root = $(scope);
    if (!$root.length) return;

    $root.find(".thha-atc-bar").each(function () {
      var $bar = $(this);
      var unit = parseFloat($bar.attr("data-unit-price")) || 0;
      var min = parseInt($bar.attr("data-min"), 10) || 1;
      var max = parseInt($bar.attr("data-max"), 10) || 99;
      var qty = min;

      var $qty = $bar.find(".thha-atc-qty");
      var $total = $bar.find(".thha-atc-total");
      var $minus = $bar.find(".thha-atc-step--minus");
      var $plus = $bar.find(".thha-atc-step--plus");

      function render() {
        $qty.text(qty);
        $total.text(unit * qty);
        $minus.toggleClass("is-disabled", qty <= min);
        $plus.toggleClass("is-disabled", qty >= max);

        $qty.removeClass("is-bump");
        // reflow so the animation can replay
        void $qty[0].offsetWidth;
        $qty.addClass("is-bump");
      }

      $plus.on("click", function () {
        if (qty < max) {
          qty++;
          render();
        }
      });

      $minus.on("click", function () {
        if (qty > min) {
          qty--;
          render();
        }
      });

      $bar.find(".thha-atc-bar-btn").on("click", function () {
        var $b = $(this);
        $b.removeClass("is-added");
        void $b[0].offsetWidth;
        $b.addClass("is-added");
      });

      render();
    });
  }

  /* ------------------------------------------------------------------
     Design 3 — Card add buttons: flip to a green "Added" state, then
     settle back to idle.
  ------------------------------------------------------------------ */
  function thhaAtcCard(scope) {
    var $root = $(scope);
    if (!$root.length) return;

    $root.find(".thha-atc-card-add").on("click", function () {
      var $btn = $(this);
      if ($btn.attr("data-state") === "done") return;

      $btn.attr("data-state", "done");
      setTimeout(function () {
        $btn.attr("data-state", "idle");
      }, 1800);
    });
  }

  /* ------------------------------------------------------------------
     Design 4 — Slide-to-confirm: drag the thumb across the track to
     confirm. Past ~92% it snaps to the success state; otherwise it
     springs back to the start. Works with mouse and touch via
     Pointer Events.
  ------------------------------------------------------------------ */
  function thhaAtcSlide(scope) {
    var $root = $(scope);
    if (!$root.length) return;

    $root.find(".thha-atc-slide").each(function () {
      var track = this;
      var $track = $(track);
      var thumb = $track.find(".thha-atc-slide-thumb")[0];
      var fill = $track.find(".thha-atc-slide-fill")[0];

      var dragging = false;
      var startX = 0;
      var startLeft = 6;
      var minLeft = 6;

      function maxLeft() {
        return track.clientWidth - thumb.offsetWidth - 6;
      }

      function setLeft(px) {
        var capped = Math.max(minLeft, Math.min(px, maxLeft()));
        thumb.style.left = capped + "px";
        fill.style.width = capped + thumb.offsetWidth / 2 + "px";
        return capped;
      }

      function reset() {
        $track.removeClass("is-dragging");
        thumb.style.transition = "left 0.35s cubic-bezier(0.22,1,0.36,1)";
        fill.style.transition = "width 0.35s cubic-bezier(0.22,1,0.36,1)";
        thumb.style.left = minLeft + "px";
        fill.style.width = thumb.offsetWidth + "px";
      }

      function complete() {
        $track.attr("data-state", "done");
        thumb.style.transition = "left 0.3s ease";
        thumb.style.left = maxLeft() + "px";
        // auto-reset after celebrating
        setTimeout(function () {
          $track.attr("data-state", "idle");
          reset();
        }, 2000);
      }

      function onDown(e) {
        if ($track.attr("data-state") === "done") return;
        dragging = true;
        startX = e.clientX;
        startLeft = parseFloat(thumb.style.left) || minLeft;
        $track.addClass("is-dragging");
        thumb.style.transition = "none";
        fill.style.transition = "none";
        if (thumb.setPointerCapture && e.pointerId !== undefined) {
          thumb.setPointerCapture(e.pointerId);
        }
      }

      function onMove(e) {
        if (!dragging) return;
        setLeft(startLeft + (e.clientX - startX));
      }

      function onUp() {
        if (!dragging) return;
        dragging = false;
        $track.removeClass("is-dragging");
        var current = parseFloat(thumb.style.left) || minLeft;
        if (current >= maxLeft() * 0.92) {
          complete();
        } else {
          reset();
        }
      }

      if (window.PointerEvent) {
        thumb.addEventListener("pointerdown", onDown);
        thumb.addEventListener("pointermove", onMove);
        thumb.addEventListener("pointerup", onUp);
        thumb.addEventListener("pointercancel", onUp);
      } else {
        thumb.addEventListener("mousedown", onDown);
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
      }

      // initialise fill under the resting thumb
      fill.style.width = thumb.offsetWidth + "px";
    });
  }

  /* ------------------------------------------------------------------
     Design 5 — Fly-to-cart: clicking a product's "+" clones its image
     and arcs it toward the floating cart, then increments the badge
     with a pop while the cart bounces.
  ------------------------------------------------------------------ */
  function thhaAtcShop(scope) {
    var $root = $(scope);
    if (!$root.length) return;

    $root.find(".thha-atc-shop").each(function () {
      var $shop = $(this);
      var $cart = $shop.find(".thha-atc-cart");
      var $badge = $shop.find(".thha-atc-cart-badge");
      var count = 0;

      $shop.find(".thha-atc-tile-add").on("click", function () {
        var $btn = $(this);
        var $tile = $btn.closest(".thha-atc-tile");
        var imgSrc = $tile.attr("data-img");

        flyToCart($tile.find(".thha-atc-tile-img img")[0], imgSrc, function () {
          count++;
          $badge
            .text(count)
            .attr("data-count", count)
            .addClass("is-visible is-bump");
          setTimeout(function () {
            $badge.removeClass("is-bump");
          }, 420);

          $cart.removeClass("is-bcounting");
          void $cart[0].offsetWidth;
          $cart.addClass("is-bcounting");
        });

        // brief "added" tick on the button
        $btn.addClass("is-added").html('<i class="fa-solid fa-check"></i>');
        setTimeout(function () {
          $btn.removeClass("is-added").html('<i class="fa-solid fa-plus"></i>');
        }, 900);
      });

      function flyToCart(sourceImg, src, onArrive) {
        if (!sourceImg || !$cart.length) {
          if (onArrive) onArrive();
          return;
        }

        var from = sourceImg.getBoundingClientRect();
        var to = $cart[0].getBoundingClientRect();

        var flyer = document.createElement("img");
        flyer.src = src || sourceImg.src;
        flyer.className = "thha-atc-flyer";
        flyer.style.left = from.left + from.width / 2 - 28 + "px";
        flyer.style.top = from.top + from.height / 2 - 28 + "px";
        document.body.appendChild(flyer);

        var dx = to.left + to.width / 2 - (from.left + from.width / 2);
        var dy = to.top + to.height / 2 - (from.top + from.height / 2);

        // arc upward first, then drop into the cart
        flyer.animate(
          [
            { transform: "translate(0,0) scale(1)", opacity: 1, offset: 0 },
            {
              transform:
                "translate(" + dx * 0.5 + "px," + (dy - 90) + "px) scale(0.7)",
              opacity: 1,
              offset: 0.55,
            },
            {
              transform: "translate(" + dx + "px," + dy + "px) scale(0.18)",
              opacity: 0.4,
              offset: 1,
            },
          ],
          { duration: 750, easing: "cubic-bezier(0.5, 0, 0.5, 1)" },
        ).onfinish = function () {
          flyer.remove();
          if (onArrive) onArrive();
        };
      }
    });
  }

  $(document).ready(function () {
    thhaAtcRoll(".thha-add-to-cart.thha-presets-1");
    thhaAtcBar(".thha-add-to-cart.thha-presets-2");
    thhaAtcCard(".thha-add-to-cart.thha-presets-3");
    thhaAtcSlide(".thha-add-to-cart.thha-presets-4");
    thhaAtcShop(".thha-add-to-cart.thha-presets-5");
  });
})(jQuery);
