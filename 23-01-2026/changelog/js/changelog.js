function thha_changelog(wrapperSelector) {
  const $wrapper = $(wrapperSelector);
  let currentFilterType = "";

  $wrapper.find(".thha-filter-btn").on("click", function () {
    const filterType = $(this).attr("data");
    currentFilterType = filterType;

    // Active filter
    $wrapper.find(".thha-filter-btn").removeClass("active");
    $(this).addClass("active");

    $wrapper.find(".thha-entry").each(function () {
      const $item = $(this);
      const $sections = $item.find(".thha-card .thha-changes");

      let hasMatch = false;

      if (!filterType) {
        // All Release
        $sections.show();
        hasMatch = true;
      } else {
        $sections.hide();

        const $match = $sections.filter(`[data-changes="${filterType}"]`);

        if ($match.length) {
          $match.show();
          hasMatch = true;
        }
      }

      $item.toggle(hasMatch);
    });

    runSearchFilter();
  });

  // search
  $wrapper.find(".thha-search-input").on("keyup", function () {
    runSearchFilter();
  });

  function runSearchFilter() {
    const q = $wrapper.find(".thha-search-input").val().toLowerCase();

    $wrapper.find(".thha-entry").each(function () {
      const $item = $(this);

      const version = $item.find(".thha-version").text().toLowerCase();
      const date = $item.find(".thha-date").text().toLowerCase();

      let content = "";
      if (!currentFilterType) {
        content = $item.find(".thha-card .thha-changes").text().toLowerCase();
      } else {
        content = $item
          .find(`.thha-card .thha-changes[data-changes="${currentFilterType}"]`)
          .text()
          .toLowerCase();
      }

      const textMatch =
        version.includes(q) || date.includes(q) || content.includes(q);

      let passesFilter = false;
      if (!currentFilterType) {
        passesFilter = true;
      } else {
        passesFilter =
          $item.find(`.thha-changes[data-changes="${currentFilterType}"]`)
            .length > 0;
      }

      const shouldShow = q === "" ? passesFilter : textMatch && passesFilter;
      $item.toggle(shouldShow);
    });
  }
}

$(document).ready(function () {
  thha_changelog(".thha-presets-1");
  thha_changelog(".thha-presets-2");
});

// accordion changelog
jQuery(window).on("load", function () {
  const $wrapper = jQuery(".thha-presets-4");

  $wrapper.each(function () {
    const $thisWrapper = jQuery(this);

    const $headers = $thisWrapper.find(".thha-entry-header");
    const $bodies = $thisWrapper.find(".thha-entry-body");
    const $icons = $thisWrapper.find(".thha-icon");

    $headers.removeClass("open");
    $bodies.css({
      maxHeight: 0,
      overflow: "hidden",
    });
    $icons.text("+");

    const $firstHeader = $headers.first();
    const $firstBody = $firstHeader.next(".thha-entry-body");
    const $firstIcon = $firstHeader.find(".thha-icon");

    $firstHeader.addClass("open");
    $firstIcon.text("−");

    $firstBody[0].offsetHeight;

    $firstBody.css("max-height", $firstBody[0].scrollHeight + "px");

    // Click Event
    $thisWrapper.on("click", ".thha-entry-header", function () {
      const $header = jQuery(this);
      const $body = $header.next(".thha-entry-body");
      const $icon = $header.find(".thha-icon");

      if ($header.hasClass("open")) {
        $header.removeClass("open");
        $body.css("max-height", 0);
        $icon.text("+");
        return;
      }

      $headers.removeClass("open");
      $bodies.css("max-height", 0);
      $icons.text("+");

      $body[0].offsetHeight;

      $header.addClass("open");
      $body.css("max-height", $body[0].scrollHeight + "px");
      $icon.text("−");
    });
  });
});

// Horizontal Timeline - Preset 5
jQuery(window).on("load", function () {
  const $wrapper = jQuery(".thha-presets-5");

  initializeTimeline();

  setupInteractivity();

  function initializeTimeline() {
    $wrapper.find(".thha-entry").each(function (i) {
      const $element = $(this);
      setTimeout(() => $element.addClass("thha-visible"), i * 100);
    });
  }

  // Setup all interactive features: scrolling, dragging, keyboard navigation
  function setupInteractivity() {
    setupScrolling();
    setupHoverEffects();
    setupDragScroll();
    setupKeyboardNavigation();
  }

  // SCROLLING: Mouse wheel and touch support
  function setupScrolling() {
    let wheelTimeout;

    $wrapper.on("wheel", function (e) {
      if (e.deltaY === 0 && e.deltaX === 0) return;

      e.preventDefault();
      clearTimeout(wheelTimeout);

      // Calculate scroll direction and amount
      const scrollDir = e.deltaY > 0 || e.deltaX > 0 ? 1 : -1;
      const totalDelta = Math.abs(e.deltaY) + Math.abs(e.deltaX);
      const scrollAmount = scrollDir * Math.min(totalDelta, 50);

      // Apply smooth scroll
      $wrapper.scrollLeft($wrapper.scrollLeft() + scrollAmount);

      wheelTimeout = setTimeout(() => {
        // Timeout complete
      }, 100);
    });
  }

  //  HOVER EFFECTS: Scale and z-index changes on hover
  function setupHoverEffects() {
    $wrapper
      .find(".thha-entry")
      .on("mouseenter", function () {
        $(this).css({
          transform: "translateX(0) scale(1.05)",
          zIndex: 10,
        });
      })
      .on("mouseleave", function () {
        $(this).css({
          transform: "translateX(0) scale(1)",
          zIndex: 1,
        });
      });
  }

  // DRAG SCROLL: Right-click (button 2) drag to scroll timeline
  function setupDragScroll() {
    let isDragging = false;
    let startX = 0;
    let $draggingEntry = null;
    let startScrollLeft = 0;

    // Prevent context menu
    $wrapper.on("contextmenu", function (e) {
      e.preventDefault();
    });

    // Start drag on right-click
    $wrapper.find(".thha-entry").on("mousedown", function (e) {
      if (e.button !== 2) return;

      isDragging = true;
      startX = e.clientX;
      $draggingEntry = $(this);
      startScrollLeft = $wrapper.scrollLeft();

      $draggingEntry.css({
        cursor: "grabbing",
        opacity: 0.8,
      });
    });

    // Drag movement
    $(document).on("mousemove", function (e) {
      if (!isDragging || !$draggingEntry) return;

      const dragDistance = e.clientX - startX;
      const newScrollLeft = startScrollLeft - dragDistance;

      $wrapper.scrollLeft(newScrollLeft);
      e.preventDefault();
    });

    // End drag
    $(document).on("mouseup", function () {
      if (isDragging && $draggingEntry) {
        isDragging = false;
        $draggingEntry.css({
          cursor: "grab",
          opacity: 1,
        });
        $draggingEntry = null;
      }
    });
  }

  // KEYBOARD NAVIGATION: Left/Right arrow keys for timeline scrolling

  function setupKeyboardNavigation() {
    const scrollAmount = 350;

    $(document).on("keydown", function (e) {
      // Check if timeline is in viewport
      if (!isTimelineVisible()) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        animateScroll($wrapper.scrollLeft() - scrollAmount);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        animateScroll($wrapper.scrollLeft() + scrollAmount);
      }
    });

    // Animate scroll to position
    function animateScroll(position) {
      $wrapper.animate({ scrollLeft: position }, 300, "swing");
    }
  }

  // Check if timeline wrapper is visible in viewport
  function isTimelineVisible() {
    const wrapperOffset = $wrapper.offset();
    const wrapperHeight = $wrapper.height();
    const scrollTop = $(window).scrollTop();
    const windowHeight = $(window).height();

    return (
      wrapperOffset.top < scrollTop + windowHeight &&
      wrapperOffset.top + wrapperHeight > scrollTop
    );
  }

  /**
   * Add smooth scroll snap for better UX on mobile/tablet
   */
  function addScrollSnap() {
    let scrollTimer = null;

    $wrapper.on("scroll", function () {
      clearTimeout(scrollTimer);

      scrollTimer = setTimeout(() => {
        const scrollLeft = $wrapper.scrollLeft();
        const cardWidth = 384; // card width (360px) + gap (24px)
        const targetScroll = Math.round(scrollLeft / cardWidth) * cardWidth;

        $wrapper.animate({ scrollLeft: targetScroll }, 300, "swing");
      }, 150);
    });
  }

  /**
   * CLICK EXPAND: Click entry to expand to full parent width
   */
  function setupClickExpand() {
    let selectedEntry = null;
    const $timeline = $wrapper.find(".thha-timeline");
    const parentWidth = $wrapper.width();

    $wrapper.find(".thha-entry").on("click", function () {
      const $entry = $(this);

      // Remove previous selection and restore original styles
      if (selectedEntry) {
        selectedEntry.css({
          width: "",
          position: "",
          left: "",
          zIndex: "",
          right: "",
        });
      }

      // Check if clicking same entry to toggle off
      if (selectedEntry && selectedEntry[0] === $entry[0]) {
        selectedEntry = null;
        // Reset timeline height
        $timeline.css({ height: "" });
        return;
      }

      // Set new selection to full parent width
      selectedEntry = $entry;

      $entry.css({
        width: parentWidth + "px",
        position: "absolute",
        left: "0",
        top: "0",
        zIndex: 50,
      });

      // Adjust timeline height to accommodate expanded entry
      const entryHeight = $entry.outerHeight();
      $timeline.css({ minHeight: entryHeight + "px" });

      // Scroll to top
      $wrapper.animate({ scrollLeft: 0 }, 300, "swing");
    });

    // Click outside to deselect
    $(document).on("click", function (e) {
      if (!$(e.target).closest(".thha-presets-5").length && selectedEntry) {
        selectedEntry.css({
          width: "",
          position: "",
          left: "",
          top: "",
          zIndex: "",
          right: "",
        });
        $timeline.css({ height: "" });
        selectedEntry = null;
      }
    });
  }

  // Enable click expand functionality
  setupClickExpand();

  // Enable scroll snap for better UX
  addScrollSnap();
});
