// Design 1
function thhaVerticalMenu(presetClass) {
  const $preset = $(presetClass);

  // Hover to show mega menu panels
  $preset.find(".thha-menu-item").on("mouseenter", function () {
    $preset.find(".thha-megamenu-panel").removeClass("active");
    $(this).find(".thha-megamenu-panel").addClass("active");
  });

  //  Remove active when leaving menu area
  $preset.on("mouseleave", function () {
    $preset.find(".thha-megamenu-panel").removeClass("active");
  });

  //  Toggle button
  $preset.find(".thha-vertical-menu-tigger").on("click", function (e) {
    e.preventDefault();
    $preset.toggleClass("active-toggle");
  });
}

$(document).ready(() => {
  thhaVerticalMenu(".thha-presets-1");
  thhaVerticalMenu(".thha-presets-2");
});
