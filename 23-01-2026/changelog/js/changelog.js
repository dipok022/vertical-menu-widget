function thha_changelog(wrapperSelector) {
  const $wrapper = $(wrapperSelector);

  // TAB CLICK
  $wrapper.find(".thha-filter-btn").on("click", function () {
    const filterType = $(this).attr("data"); // <-- matches your markup

    // Active tab
    $wrapper.find(".thha-filter-btn").removeClass("active");
    $(this).addClass("active");

    $wrapper.find(".thha-changlogs-item").each(function () {
      const $item = $(this);
      const $sections = $item.find(".thha-changelog-content > .thha-changlogs");

      let hasMatch = false;

      if (!filterType) {
        // All Release
        $sections.show();
        hasMatch = true;
      } else {
        $sections.hide();

        const $match = $sections.filter(`[data-changlogs="${filterType}"]`);

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

    $wrapper.find(".thha-changlogs-item").each(function () {
      const $item = $(this);

      const version = $item.find("h2").text().toLowerCase();
      const date = $item.find("span").first().text().toLowerCase();

      const textMatch = version.includes(q) || date.includes(q);
      const visibleSection = $item.find(".thha-changlogs:visible").length > 0;

      $item.toggle(textMatch && visibleSection);
    });
  }
}

$(document).ready(function () {
  thha_changelog(".thha-presets-1");
});
