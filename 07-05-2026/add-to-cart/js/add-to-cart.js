(function ($) {
  "use strict";

  var REDUCED_MOTION =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Announce an action to whichever live region belongs to this preset. */
  function announce(scopeEl, message) {
    var $sr = $(scopeEl).closest(".thha-add-to-cart").find(".thha-atc-sr");
    if (!$sr.length) return;
    $sr.text(message);
    window.setTimeout(function () {
      $sr.text("");
    }, 2500);
  }

  /* ------------------------------------------------------------------
     Shared — reveal cards as they scroll in, staggered per row. The
     hidden state is only armed once we know the observer exists, so a
     browser without IntersectionObserver (or with reduced motion) shows
     the cards immediately rather than leaving them invisible.
  ------------------------------------------------------------------ */
  function thhaAtcReveal() {
    if (REDUCED_MOTION || !("IntersectionObserver" in window)) return;

    $(".thha-add-to-cart").each(function () {
      var $group = $(this);
      var $items = $group.find("[data-thha-reveal]");
      if (!$items.length) return;

      $items.each(function (i) {
        this.style.setProperty("--thha-d", String(i));
      });

      $group.addClass("is-reveal-ready");

      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
      );

      $items.each(function () {
        observer.observe(this);
      });
    });
  }

  /* ------------------------------------------------------------------
     Design 1 — Morphing add button: idle → busy → done → idle. The
     button collapses to a disc while "working", then reopens as a
     confirmation before settling back.
  ------------------------------------------------------------------ */
  function thhaAtcMorph(scope) {
    var $root = $(scope);
    if (!$root.length) return;

    var BUSY = REDUCED_MOTION ? 300 : 900;
    var HOLD = REDUCED_MOTION ? 900 : 1900;

    $root.find("[data-thha-morph]").on("click", function () {
      var $btn = $(this);
      if ($btn.attr("data-state") !== "idle") return; // ignore while busy

      var product = $btn.attr("data-product") || "Item";

      $btn.attr({ "data-state": "busy", "aria-busy": "true" });

      window.setTimeout(function () {
        $btn.attr({ "data-state": "done", "aria-busy": "false" });
        announce($btn[0], product + " added to cart");

        window.setTimeout(function () {
          $btn.attr("data-state", "idle");
        }, HOLD);
      }, BUSY);
    });
  }

  /* ------------------------------------------------------------------
     Design 2 — Quantity stepper with a live total. The total is derived
     from data-unit-price so the markup stays the single source of truth.
  ------------------------------------------------------------------ */
  function thhaAtcQbar(scope) {
    var $root = $(scope);
    if (!$root.length) return;

    $root.find(".thha-atc-qbar").each(function () {
      var $bar = $(this);
      var unit = parseFloat($bar.attr("data-unit-price")) || 0;
      var min = parseInt($bar.attr("data-min"), 10) || 1;
      var max = parseInt($bar.attr("data-max"), 10) || 99;
      var qty = min;

      var $qty = $bar.find(".thha-atc-qty");
      var $total = $bar.find(".thha-atc-total");
      var $minus = $bar.find(".thha-atc-step--minus");
      var $plus = $bar.find(".thha-atc-step--plus");

      function render(bump) {
        $qty.text(qty);
        $total.text((unit * qty).toLocaleString("en-US"));
        $minus.toggleClass("is-disabled", qty <= min);
        $plus.toggleClass("is-disabled", qty >= max);

        if (!bump) return;
        $qty.removeClass("is-bump");
        void $qty[0].offsetWidth; // reflow so the animation can replay
        $qty.addClass("is-bump");
      }

      $plus.on("click", function () {
        if (qty >= max) return;
        qty++;
        render(true);
      });

      $minus.on("click", function () {
        if (qty <= min) return;
        qty--;
        render(true);
      });

      $bar.find(".thha-atc-qadd").on("click", function () {
        var $b = $(this);
        $b.removeClass("is-added");
        void $b[0].offsetWidth;
        $b.addClass("is-added");
        announce(
          $b[0],
          qty + (qty === 1 ? " item" : " items") + " added to cart"
        );
      });

      render(false);
    });
  }

  /* ------------------------------------------------------------------
     Design 3 — Quick add, wishlist toggle, and colour swatches. The
     wishlist and swatches carry real aria-pressed state rather than
     relying on colour alone.
  ------------------------------------------------------------------ */
  function thhaAtcMin(scope) {
    var $root = $(scope);
    if (!$root.length) return;

    $root.find("[data-thha-quick]").on("click", function () {
      var $btn = $(this);
      if ($btn.hasClass("is-added")) return;

      $btn.addClass("is-added");
      announce($btn[0], ($btn.attr("data-product") || "Item") + " added to cart");

      window.setTimeout(function () {
        $btn.removeClass("is-added");
      }, 1800);
    });

    $root.find("[data-thha-wish]").on("click", function () {
      var $btn = $(this);
      var next = $btn.attr("aria-pressed") !== "true";

      $btn.attr("aria-pressed", next ? "true" : "false");
      $btn
        .find("i")
        .toggleClass("fa-regular", !next)
        .toggleClass("fa-solid", next);
    });

    $root.find(".thha-atc-min-sws").each(function () {
      var $group = $(this);

      $group.find(".thha-atc-min-sw").on("click", function () {
        $group.find(".thha-atc-min-sw").attr("aria-pressed", "false");
        $(this).attr("aria-pressed", "true");
      });
    });
  }

  /* ------------------------------------------------------------------
     Design 4 — Slide to confirm. Drag the thumb across the track; past
     ~92% it locks in, otherwise it springs back. Pointer Events cover
     mouse and touch, and Enter/Space confirm from the keyboard so the
     control is not drag-only.
  ------------------------------------------------------------------ */
  function thhaAtcSlide(scope) {
    var $root = $(scope);
    if (!$root.length) return;

    $root.find(".thha-atc-slide").each(function () {
      var track = this;
      var $track = $(track);
      var thumb = $track.find(".thha-atc-slide-thumb")[0];
      var fill = $track.find(".thha-atc-slide-fill")[0];
      var idleLabel = $track.find(".thha-atc-slide-label--idle")[0];
      var product = $track.attr("data-product") || "Item";

      var dragging = false;
      var startX = 0;
      var startLeft = 5;
      var minLeft = 5;

      function maxLeft() {
        return track.clientWidth - thumb.offsetWidth - 5;
      }

      /* The fill is inset to the thumb's box, so its width is the thumb's
         own width plus however far the thumb has travelled. At rest that
         leaves it hidden behind the thumb instead of ringing it. */
      function fillWidthFor(left) {
        return left - minLeft + thumb.offsetWidth;
      }

      function setLeft(px) {
        var capped = Math.max(minLeft, Math.min(px, maxLeft()));
        thumb.style.left = capped + "px";
        fill.style.width = fillWidthFor(capped) + "px";

        // recede the prompt as the gesture commits, so the thumb never
        // just slides over readable text
        if (idleLabel) {
          var span = maxLeft() - minLeft;
          var progress = span > 0 ? (capped - minLeft) / span : 0;
          idleLabel.style.opacity = String(1 - progress * 0.9);
        }

        return capped;
      }

      function reset() {
        $track.removeClass("is-dragging");
        thumb.style.transition = "left 0.35s cubic-bezier(0.22,1,0.36,1)";
        fill.style.transition = "width 0.35s cubic-bezier(0.22,1,0.36,1)";
        thumb.style.left = minLeft + "px";
        fill.style.width = thumb.offsetWidth + "px";
        if (idleLabel) idleLabel.style.opacity = "";
      }

      function complete() {
        $track.attr("data-state", "done");
        thumb.style.transition = "left 0.3s ease";
        fill.style.transition = "width 0.3s ease";
        thumb.style.left = maxLeft() + "px";
        fill.style.width = fillWidthFor(maxLeft()) + "px";
        // hand the idle label back to the done-state stylesheet rule
        if (idleLabel) idleLabel.style.opacity = "";
        announce(track, product + " added to cart");

        window.setTimeout(function () {
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

      // keyboard equivalent — a drag-only control would lock out anyone
      // not using a pointer
      thumb.addEventListener("keydown", function (e) {
        if (e.key !== "Enter" && e.key !== " " && e.key !== "Spacebar") return;
        e.preventDefault();
        if ($track.attr("data-state") === "done") return;
        complete();
      });

      // settle the fill under the resting thumb
      fill.style.width = thumb.offsetWidth + "px";
    });
  }

  /* ------------------------------------------------------------------
     Design 5 — Fly to cart. The product image arcs into the floating
     cart, which then bumps its counter. With reduced motion the flight
     is skipped and the count updates directly.
  ------------------------------------------------------------------ */
  function thhaAtcShop(scope) {
    var $root = $(scope);
    if (!$root.length) return;

    $root.find(".thha-atc-shop").each(function () {
      var $shop = $(this);
      var $cart = $shop.find(".thha-atc-cart");
      var $badge = $shop.find(".thha-atc-cart-badge");

      var $drawer = $shop.find("[data-thha-drawer]");
      var $list = $shop.find(".thha-atc-lines");
      var $count = $shop.find(".thha-atc-drawer-count");
      var $total = $shop.find(".thha-atc-sum-total");

      /* The cart is the single source of truth; every row keeps a handle
         on its own nodes so a quantity change touches one line instead of
         re-rendering the list (which would drop keyboard focus). */
      var items = [];
      var lastFocus = null;

      function money(n) {
        return "$" + n.toLocaleString("en-US");
      }

      function find(name) {
        for (var i = 0; i < items.length; i++) {
          if (items[i].name === name) return items[i];
        }
        return null;
      }

      function syncTotals() {
        var units = 0;
        var sum = 0;

        items.forEach(function (it) {
          units += it.qty;
          sum += it.price * it.qty;
        });

        $badge
          .text(units)
          .attr("data-count", units)
          .toggleClass("is-visible", units > 0);
        $count.text(units + (units === 1 ? " item" : " items"));
        $total.text(money(sum));
        $drawer.toggleClass("is-empty", units === 0);

        $cart.attr(
          "aria-label",
          units
            ? "View cart, " + units + (units === 1 ? " item" : " items")
            : "View cart, empty"
        );
      }

      function bumpCart() {
        $badge.addClass("is-bump");
        window.setTimeout(function () {
          $badge.removeClass("is-bump");
        }, 430);

        $cart.removeClass("is-counting");
        void $cart[0].offsetWidth;
        $cart.addClass("is-counting");
      }

      function setQty(item, next) {
        if (next < 1) return;
        item.qty = next;
        item.nEl.textContent = next;
        item.totalEl.textContent = money(item.price * next);
        item.decEl.disabled = next <= 1;
        syncTotals();
      }

      function removeItem(item, silent) {
        var idx = items.indexOf(item);
        if (idx === -1) return;
        items.splice(idx, 1);
        syncTotals();

        var el = item.el;
        var dropped = false;

        function drop() {
          if (dropped) return;
          dropped = true;
          if (el.parentNode) el.parentNode.removeChild(el);
        }

        el.classList.add("is-leaving");
        el.addEventListener("animationend", drop);
        // same reasoning as the flyer: never leave a row stranded if the
        // animation event does not arrive
        window.setTimeout(drop, 420);

        if (!silent) announce($cart[0], item.name + " removed from cart");
      }

      function buildLine(item) {
        var li = document.createElement("li");
        li.className = "thha-atc-line";

        var img = document.createElement("img");
        img.className = "thha-atc-line-img";
        img.src = item.img;
        img.alt = "";
        li.appendChild(img);

        var main = document.createElement("div");
        main.className = "thha-atc-line-main";

        var name = document.createElement("h4");
        name.className = "thha-atc-line-name";
        name.textContent = item.name;
        main.appendChild(name);

        var unit = document.createElement("span");
        unit.className = "thha-atc-line-unit";
        unit.textContent = money(item.price) + " each";
        main.appendChild(unit);

        var qty = document.createElement("div");
        qty.className = "thha-atc-line-qty";

        var dec = document.createElement("button");
        dec.type = "button";
        dec.disabled = true; // starts at 1; the trash button handles removal
        dec.setAttribute("aria-label", "Decrease quantity of " + item.name);
        dec.innerHTML = '<i class="fa-solid fa-minus" aria-hidden="true"></i>';
        dec.addEventListener("click", function () {
          setQty(item, item.qty - 1);
        });

        var n = document.createElement("span");
        n.className = "thha-atc-line-n";
        n.textContent = item.qty;

        var inc = document.createElement("button");
        inc.type = "button";
        inc.setAttribute("aria-label", "Increase quantity of " + item.name);
        inc.innerHTML = '<i class="fa-solid fa-plus" aria-hidden="true"></i>';
        inc.addEventListener("click", function () {
          setQty(item, item.qty + 1);
        });

        qty.appendChild(dec);
        qty.appendChild(n);
        qty.appendChild(inc);
        main.appendChild(qty);
        li.appendChild(main);

        var right = document.createElement("div");
        right.className = "thha-atc-line-right";

        var lineTotal = document.createElement("span");
        lineTotal.className = "thha-atc-line-total";
        lineTotal.textContent = money(item.price * item.qty);
        right.appendChild(lineTotal);

        var remove = document.createElement("button");
        remove.type = "button";
        remove.className = "thha-atc-line-x";
        remove.setAttribute("aria-label", "Remove " + item.name + " from cart");
        remove.innerHTML = '<i class="fa-solid fa-trash-can" aria-hidden="true"></i>';
        remove.addEventListener("click", function () {
          removeItem(item);
        });
        right.appendChild(remove);

        li.appendChild(right);

        item.el = li;
        item.nEl = n;
        item.totalEl = lineTotal;
        item.decEl = dec;
        return li;
      }

      function land(product, price, img) {
        var existing = find(product);

        if (existing) {
          setQty(existing, existing.qty + 1);
        } else {
          var item = { name: product, price: price, img: img, qty: 1 };
          items.push(item);
          $list[0].appendChild(buildLine(item));
          syncTotals();
        }

        bumpCart();
        announce($cart[0], product + " added to cart");
      }

      function clearAll() {
        if (!items.length) return;
        items.slice().forEach(function (it) {
          removeItem(it, true);
        });
        announce($cart[0], "Cart cleared");
      }

      /* ---- off-canvas open / close ---- */

      function focusables() {
        return $drawer
          .find("button:not([disabled])")
          .filter(function () {
            return this.offsetParent !== null;
          });
      }

      function openDrawer() {
        lastFocus = document.activeElement;
        $drawer.addClass("is-open");
        $cart.attr("aria-expanded", "true");
        document.body.classList.add("thha-atc-locked");

        window.setTimeout(function () {
          var $x = $drawer.find(".thha-atc-drawer-x");
          if ($x.length) $x[0].focus();
        }, 60);
      }

      function closeDrawer() {
        if (!$drawer.hasClass("is-open")) return;
        $drawer.removeClass("is-open");
        $cart.attr("aria-expanded", "false");
        document.body.classList.remove("thha-atc-locked");
        if (lastFocus && lastFocus.focus) lastFocus.focus();
      }

      $shop.find("[data-thha-cart-open]").on("click", openDrawer);
      $shop.find("[data-thha-cart-close]").on("click", closeDrawer);
      $shop.find("[data-thha-cart-clear]").on("click", clearAll);

      $shop.find(".thha-atc-checkout").on("click", function () {
        var $b = $(this);
        var label = $b.text();
        $b.text("Demo only");
        announce($cart[0], "This is a demo checkout; nothing was submitted");
        window.setTimeout(function () {
          $b.text(label);
        }, 1600);
      });

      // Escape closes; Tab stays inside the panel while it is open
      $(document).on("keydown", function (e) {
        if (!$drawer.hasClass("is-open")) return;

        if (e.key === "Escape") {
          closeDrawer();
          return;
        }

        if (e.key !== "Tab") return;

        var $f = focusables();
        if (!$f.length) return;

        var first = $f[0];
        var last = $f[$f.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      });

      syncTotals();

      function flyToCart(sourceImg, src, onArrive) {
        // The cart total must not depend on a decorative animation
        // completing — a backgrounded tab throttles the timeline and
        // onfinish may never fire. Whichever path gets there first wins,
        // and arrive() is idempotent.
        var landed = false;

        function arrive() {
          if (landed) return;
          landed = true;
          onArrive();
        }

        if (!sourceImg || !$cart.length || REDUCED_MOTION || !sourceImg.animate) {
          arrive();
          return;
        }

        var from = sourceImg.getBoundingClientRect();
        var to = $cart[0].getBoundingClientRect();

        var flyer = document.createElement("img");
        flyer.src = src || sourceImg.src;
        flyer.alt = "";
        flyer.className = "thha-atc-flyer";
        flyer.style.left = from.left + from.width / 2 - 28 + "px";
        flyer.style.top = from.top + from.height / 2 - 28 + "px";
        document.body.appendChild(flyer);

        var dx = to.left + to.width / 2 - (from.left + from.width / 2);
        var dy = to.top + to.height / 2 - (from.top + from.height / 2);

        var flight = flyer.animate(
          [
            { transform: "translate(0,0) scale(1)", opacity: 1, offset: 0 },
            {
              transform:
                "translate(" + dx * 0.5 + "px," + (dy - 90) + "px) scale(0.7)",
              opacity: 1,
              offset: 0.55
            },
            {
              transform: "translate(" + dx + "px," + dy + "px) scale(0.18)",
              opacity: 0.4,
              offset: 1
            }
          ],
          { duration: 750, easing: "cubic-bezier(0.5, 0, 0.5, 1)" }
        );

        flight.onfinish = function () {
          flyer.remove();
          arrive();
        };

        // safety net: settle the cart even if the flight never finishes
        window.setTimeout(function () {
          if (flyer.parentNode) flyer.remove();
          arrive();
        }, 1100);
      }

      $shop.find(".thha-atc-tile-add").on("click", function () {
        var $btn = $(this);
        var $tile = $btn.closest(".thha-atc-tile");
        var product = $btn.attr("data-product") || "Item";
        var price = parseFloat($tile.attr("data-price")) || 0;
        var img = $tile.attr("data-img");

        flyToCart($tile.find(".thha-atc-tile-img img")[0], img, function () {
          land(product, price, img);
        });

        // brief tick on the button itself
        $btn.addClass("is-added").html('<i class="fa-solid fa-check"></i>');
        window.setTimeout(function () {
          $btn.removeClass("is-added").html('<i class="fa-solid fa-plus"></i>');
        }, 900);
      });
    });
  }

  $(document).ready(function () {
    thhaAtcReveal();
    thhaAtcMorph(".thha-add-to-cart.thha-presets-1");
    thhaAtcQbar(".thha-add-to-cart.thha-presets-2");
    thhaAtcMin(".thha-add-to-cart.thha-presets-3");
    thhaAtcSlide(".thha-add-to-cart.thha-presets-4");
    thhaAtcShop(".thha-add-to-cart.thha-presets-5");
  });
})(jQuery);
