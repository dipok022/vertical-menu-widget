// Design 1
$(document).ready(function ($) {
  $(".thha-menu-item").on("mouseenter", function () {
    $(".thha-megamenu-panel").removeClass("active");
    $(this).find(".thha-megamenu-panel").addClass("active");
  });

  $(".thha-vertical-menu-wrapper").on("mouseleave", function () {
    $(".thha-megamenu-panel").removeClass("active");
  });
});
