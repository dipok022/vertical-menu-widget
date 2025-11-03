$(document).ready(function ($) {
  // Scope only inside this preset
  const $preset = $(".thha-presets-1");
  const $names = $preset.find(".thha-interactive-link-item");
  const $images = $preset.find(".thha-interactive-link-image img");

  // Set first active
  let activeIndex = 0;
  $names.eq(activeIndex).addClass("active");
  $images.eq(activeIndex).addClass("active");

  // Hover event (scoped)
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
