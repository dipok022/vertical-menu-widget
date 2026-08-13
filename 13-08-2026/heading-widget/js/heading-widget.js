(function ($) {
  "use strict";

  var REDUCED_MOTION =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var FINE_POINTER =
    window.matchMedia && window.matchMedia("(pointer: fine)").matches;

  var HAS_IO = "IntersectionObserver" in window;

  /* Run once when the element first scrolls into view. Without an observer
     — or with reduced motion — fire immediately so nothing is ever left
     stuck in its hidden starting state. */
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
      { threshold: 0.25, rootMargin: "0px 0px -60px 0px" }
    );

    io.observe(el);
  }

  /* ------------------------------------------------------------------
     Design 1 — Split the headline into per-word masks. Done in JS
     because the markup should stay a plain readable heading; the
     windows only exist once we can actually animate them.
  ------------------------------------------------------------------ */
  function thhaHwWords(scope) {
    var $root = $(scope);
    if (!$root.length) return;

    var ENTER_MS = 850;
    var HOLD_MS = 2600;
    var EXIT_MS = 620;

    $root.find("[data-thha-words]").each(function () {
      var el = this;
      var $el = $(el);
      var $block = $el.closest(".thha-hw-editorial");
      if (!$block.length) return;

      // a heading with data-phrases slides through them; without it the
      // element is split once and simply revealed
      var phrases = ($el.attr("data-phrases") || "").split("|").filter(Boolean);
      if (!phrases.length) phrases = [$el.text().trim()];

      var index = 0;
      var paused = false;
      var timer = null;

      function build(text) {
        var words = text.trim().split(/\s+/);
        var frag = document.createDocumentFragment();

        words.forEach(function (word, i) {
          var mask = document.createElement("span");
          mask.className = "thha-hw-word-mask";

          var inner = document.createElement("span");
          inner.className = "thha-hw-word-in";
          inner.style.setProperty("--thha-i", String(i));
          inner.textContent = word;

          mask.appendChild(inner);
          frag.appendChild(mask);

          // real space between words so the line still wraps naturally
          if (i < words.length - 1) {
            frag.appendChild(document.createTextNode(" "));
          }
        });

        el.textContent = "";
        el.appendChild(frag);

        // the per-word spans fragment the heading for assistive tech, so
        // the label keeps its accessible name whole and in sync
        el.setAttribute("aria-label", text.trim());
      }

      function schedule(ms) {
        window.clearTimeout(timer);
        timer = window.setTimeout(advance, ms);
      }

      function advance() {
        if (paused) {
          schedule(HOLD_MS);
          return;
        }

        $block.removeClass("is-in").addClass("is-out");

        window.setTimeout(function () {
          index = (index + 1) % phrases.length;

          // fresh spans start at the base position, so dropping both
          // classes first means the new phrase rises rather than
          // inheriting the outgoing transform
          $block.removeClass("is-in is-out");
          build(phrases[index]);
          void el.offsetWidth;
          $block.addClass("is-in");

          schedule(ENTER_MS + HOLD_MS);
        }, EXIT_MS);
      }

      build(phrases[0]);

      // arm the hidden state only now that JS is definitely running
      $block.addClass("is-armed");

      onceInView($block[0], function () {
        $block.addClass("is-in");
        if (phrases.length > 1 && !REDUCED_MOTION) {
          schedule(ENTER_MS + HOLD_MS);
        }
      });

      // hovering or focusing the heading holds the current phrase
      $block
        .on("mouseenter focusin", function () {
          paused = true;
        })
        .on("mouseleave focusout", function () {
          paused = false;
        });
    });
  }

  /* ------------------------------------------------------------------
     Design 2 — Draw the marker stroke when the line scrolls in. The
     paths carry pathLength="1", so a single dash value drives every
     shape regardless of its real length.
  ------------------------------------------------------------------ */
  function thhaHwMark(scope) {
    var $root = $(scope);
    if (!$root.length) return;

    $root.find("[data-thha-mark]").each(function () {
      var el = this;
      $(el).addClass("is-armed");

      onceInView(el, function () {
        $(el).addClass("is-drawn");
      });
    });
  }

  /* ------------------------------------------------------------------
     Design 3 — Rotate the word slot. The slot's width is published to
     CSS so the surrounding line re-flows smoothly instead of snapping
     when a longer word arrives.
  ------------------------------------------------------------------ */
  function thhaHwRotate(scope) {
    var $root = $(scope);
    if (!$root.length) return;

    $root.find("[data-thha-rotate]").each(function () {
      var slot = this;
      var $slot = $(slot);
      var $words = $slot.find(".thha-hw-word");
      if ($words.length < 2) return;

      var index = 0;
      var paused = false;
      var timer = null;
      var HOLD = 2400;

      function sizeTo(el) {
        if (!el) return;
        slot.style.setProperty(
          "--thha-w",
          Math.ceil(el.getBoundingClientRect().width) + "px"
        );
      }

      function step() {
        if (paused) return;

        var $out = $words.eq(index);
        index = (index + 1) % $words.length;
        var $in = $words.eq(index);

        $out.removeClass("is-live").addClass("is-out");
        $in.removeClass("is-out").addClass("is-live");
        sizeTo($in[0]);

        // park the outgoing word back below once it has cleared
        window.setTimeout(function () {
          $out.removeClass("is-out");
        }, 620);
      }

      $slot.addClass("is-armed");
      sizeTo($words[0]);

      timer = window.setInterval(step, HOLD);

      // hovering the headline holds the current word
      $slot
        .closest(".thha-hw-rotate-title")
        .on("mouseenter focusin", function () {
          paused = true;
        })
        .on("mouseleave focusout", function () {
          paused = false;
        });

      // the measurement depends on the webfont, which lands late
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () {
          sizeTo($words.eq(index)[0]);
        });
      }

      $(window).on("resize", function () {
        sizeTo($words.eq(index)[0]);
      });
    });
  }

  /* ------------------------------------------------------------------
     Design 4 — Type, hold, erase, next. The markup ships with the first
     phrase already in place, so the headline reads correctly if this
     never runs.
  ------------------------------------------------------------------ */
  function thhaHwType(scope) {
    var $root = $(scope);
    if (!$root.length) return;

    $root.find("[data-thha-type]").each(function () {
      var el = this;
      var phrases = (el.getAttribute("data-phrases") || "")
        .split("|")
        .filter(Boolean);

      if (!phrases.length) return;

      var colors = (el.getAttribute("data-colors") || "")
        .split("|")
        .filter(Boolean);

      // the colour goes on the title so the gradient and the caret, which
      // are siblings, both inherit it
      var host = $(el).closest(".thha-hw-console-title")[0] || el;

      function tint(i) {
        if (!colors.length) return;
        host.style.setProperty("--thha-c", colors[i % colors.length]);
      }

      tint(0);

      // typing is the whole effect; with reduced motion just show one
      if (REDUCED_MOTION) {
        el.textContent = phrases[0];
        return;
      }

      var TYPE_MS = 62;
      var ERASE_MS = 30;
      var HOLD_MS = 1500;
      var GAP_MS = 380;

      var phrase = 0;
      var chars = 0;
      var erasing = false;

      function tick() {
        var text = phrases[phrase];

        if (!erasing) {
          chars++;
          el.textContent = text.slice(0, chars);

          if (chars >= text.length) {
            erasing = true;
            window.setTimeout(tick, HOLD_MS);
            return;
          }
          window.setTimeout(tick, TYPE_MS);
          return;
        }

        chars--;
        el.textContent = text.slice(0, chars);

        if (chars <= 0) {
          erasing = false;
          phrase = (phrase + 1) % phrases.length;
          // recolour while the line is empty, so the change is never
          // visible mid-word
          tint(phrase);
          window.setTimeout(tick, GAP_MS);
          return;
        }
        window.setTimeout(tick, ERASE_MS);
      }

      el.textContent = "";
      window.setTimeout(tick, 450);
    });
  }

  /* ------------------------------------------------------------------
     Design 5 — Track the pointer and publish its position to each lit
     line. The mask is resolved against the lit span itself, so every
     line needs coordinates in its own box, not the block's.
  ------------------------------------------------------------------ */
  function thhaHwSpotlight(scope) {
    var $root = $(scope);
    if (!$root.length) return;

    // nothing to track without a pointer — CSS then shows the full fill
    if (!FINE_POINTER) return;

    $root.find("[data-thha-spotlight]").each(function () {
      var el = this;
      var lits = el.querySelectorAll(".thha-hw-spot-lit");
      if (!lits.length) return;

      el.classList.add("is-tracking");

      var pending = false;
      var lastX = 0;
      var lastY = 0;

      function publish() {
        pending = false;

        Array.prototype.forEach.call(lits, function (lit) {
          var rect = lit.getBoundingClientRect();
          lit.style.setProperty("--thha-mx", lastX - rect.left + "px");
          lit.style.setProperty("--thha-my", lastY - rect.top + "px");
        });
      }

      $(el).on("mousemove", function (e) {
        lastX = e.clientX;
        lastY = e.clientY;
        if (pending) return;
        pending = true;
        window.requestAnimationFrame(publish);
      });

      $(el).on("mouseleave", function () {
        Array.prototype.forEach.call(lits, function (lit) {
          lit.style.removeProperty("--thha-mx");
          lit.style.removeProperty("--thha-my");
        });
      });
    });
  }

  $(document).ready(function () {
    thhaHwWords(".thha-heading-widget.thha-presets-1");
    thhaHwMark(".thha-heading-widget.thha-presets-2");
    thhaHwRotate(".thha-heading-widget.thha-presets-3");
    thhaHwType(".thha-heading-widget.thha-presets-4");
    thhaHwSpotlight(".thha-heading-widget.thha-presets-5");
  });
})(jQuery);
