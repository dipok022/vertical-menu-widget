// Design 1
$(document).ready(function () {
  const $preset = $(".thha-presets-1");
  const $names = $preset.find(".thha-interactive-link-item");
  const $images = $preset.find(".thha-interactive-link-image img");

  let activeIndex = 0;
  $names.eq(activeIndex).addClass("active");
  $images.eq(activeIndex).addClass("active");

  $names.on("mouseenter", function () {
    const index = $(this).index();

    if (index !== activeIndex) {
      $names.removeClass("active");
      $(this).addClass("active");

      $images.removeClass("active");
      $images.eq(index).addClass("active");

      activeIndex = index;
    }
  });
});

// Design 2
$(document).ready(function () {
  const $preset = $(".thha-presets-2");
  const $items = $preset.find(".thha-interactive-link-item");
  const $images = $preset.find(".thha-interactive-link-image img");
  const $title = $preset.find(".thha-active-overlay-title");

  function showSlide(index) {
    $items.removeClass("active").eq(index).addClass("active");
    $images.removeClass("active").eq(index).addClass("active");

    const text = $items
      .eq(index)
      .text()
      .trim()
      .replace(/^\d+\s*/, "");
    $title.stop(true, true).animate({ opacity: 0 }, 150, function () {
      $(this).text(text).animate({ opacity: 1 }, 400);
    });
  }

  $items.on("mouseenter click", function (e) {
    e.preventDefault();
    const index = $(this).data("index");
    showSlide(index);
  });

  $(document).on("keydown", function (e) {
    let active = $(".thha-interactive-link-item.active").data("index");
    if (e.key === "ArrowDown") {
      active = (active + 1) % $items.length;
      showSlide(active);
    } else if (e.key === "ArrowUp") {
      active = (active - 1 + $items.length) % $items.length;
      showSlide(active);
    }
  });
});
