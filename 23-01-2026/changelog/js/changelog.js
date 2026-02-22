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
