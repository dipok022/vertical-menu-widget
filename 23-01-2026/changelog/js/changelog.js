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
jQuery(document).ready(function ($) {
  const $wrapper = ".thha-presets-4";

  // Loop through each wrapper (important if multiple exist)
  $($wrapper).each(function () {
    const $thisWrapper = $(this);

    // Open first item
    const $firstEntry = $thisWrapper.find(".thha-entry").first();
    const $firstHeader = $firstEntry.find(".thha-entry-header");
    const $firstBody = $firstEntry.find(".thha-entry-body");
    const $firstIcon = $firstEntry.find(".thha-icon");

    $firstHeader.addClass("open");
    $firstBody.css("max-height", $firstBody.prop("scrollHeight") + "px");
    $firstIcon.text("−");

    // Click event (scoped)
    $thisWrapper.on("click", ".thha-entry-header", function () {
      const $currentHeader = $(this);
      const $currentBody = $currentHeader.next(".thha-entry-body");
      const $currentIcon = $currentHeader.find(".thha-icon");

      // If already open → close
      if ($currentHeader.hasClass("open")) {
        $currentHeader.removeClass("open");
        $currentBody.css("max-height", 0);
        $currentIcon.text("+");
        return;
      }

      // Close all inside this wrapper only
      $thisWrapper.find(".thha-entry-header").removeClass("open");
      $thisWrapper.find(".thha-entry-body").css("max-height", 0);
      $thisWrapper.find(".thha-icon").text("+");

      // Open current
      $currentHeader.addClass("open");
      $currentBody.css("max-height", $currentBody.prop("scrollHeight") + "px");
      $currentIcon.text("−");
    });
  });
});
