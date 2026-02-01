$(document).ready(($) => {
  $(".thha-changlogs-tab").on("click", function () {
    const filterType = $(this).attr("data");

    // Active tab
    $(".thha-changlogs-tab").removeClass("thha-active-tab");
    $(this).addClass("thha-active-tab");

    $(".thha-changlogs-item").each(function () {
      const $item = $(this);
      const $sections = $item.find(".thha-changlogs");

      let hasMatch = false;

      if (filterType === "") {
        $sections.show();
        hasMatch = true;
      } else {
        $sections.hide();

        const matchSection = $item.find(
          `.thha-changlogs[data-changlogs="${filterType}"]`,
        );

        if (matchSection.length > 0) {
          matchSection.show();
          hasMatch = true;
        }
      }

      $item.toggle(hasMatch);
    });

    runSearchFilter();
  });

  //  search

  $(".thha-changlogs-search-input").on("keyup", function () {
    runSearchFilter();
  });

  function runSearchFilter() {
    const q = $(".thha-changlogs-search-input").val().toLowerCase();

    $(".thha-changlogs-item").each(function () {
      const version = $(this).find("h2").text().toLowerCase();
      const date = $(this).find("span").text().toLowerCase();

      $(this).toggle(version.includes(q) || date.includes(q));
    });
  }
});
