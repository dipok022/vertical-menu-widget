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
}

$(document).ready(() => {
  thhaVerticalMenu(".thha-presets-1");
  thhaVerticalMenu(".thha-presets-2");
  thhaVerticalMenu(".thha-presets-3");
  thhaVerticalMenu(".thha-presets-4");
  thhaVerticalMenu(".thha-presets-5");
});

//  yoggle button
$(document).ready(($) => {
  const $preset = $(".thha-vertical-menu-wrapper.thha-presets-2");
  $preset.find(".thha-vertical-menu-tigger").on("click", function (e) {
    e.preventDefault();
    $preset.toggleClass("active-toggle");
  });
});

// menu collapse
function thhaCollapseMneu(presetClass) {
  const $preset = $(presetClass);

  $preset.find(".thha-vertical-menu-collapse-btn").on("click", function (e) {
    e.preventDefault();

    const $btn = $(this);
    $preset.toggleClass("collapsed");

    $btn.toggleClass("active");
  });
}

$(document).ready(() => {
  thhaCollapseMneu(".thha-presets-3");
  thhaCollapseMneu(".thha-presets-4");
});
