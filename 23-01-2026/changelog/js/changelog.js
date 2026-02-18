function thha_changelog(wrapperSelector) {
  const $wrapper = $(wrapperSelector);
  let currentFilterType = ""; // Track active filter

  // TAB CLICK
  $wrapper.find(".thha-filter-btn").on("click", function () {
    const filterType = $(this).attr("data"); // <-- matches your markup
    currentFilterType = filterType; // Store active filter

    // Active tab
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

  // SEARCH
  $wrapper.find(".thha-search-input").on("keyup", function () {
    runSearchFilter();
  });

  function runSearchFilter() {
    const q = $wrapper.find(".thha-search-input").val().toLowerCase();

    $wrapper.find(".thha-entry").each(function () {
      const $item = $(this);

      const version = $item.find("h2").text().toLowerCase();
      const date = $item.find("span").first().text().toLowerCase();
      const content = $item.find(".thha-changes:visible").text().toLowerCase();

      const textMatch =
        version.includes(q) || date.includes(q) || content.includes(q);

      // Check if entry has matching filter
      let passesFilter = false;
      if (!currentFilterType) {
        // All Release - show all
        passesFilter = true;
      } else {
        // Check if entry has the selected filter type
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
