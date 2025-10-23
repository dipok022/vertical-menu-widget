// design 2
$(document).ready(function () {
  $(".thha-presets-2")
    .find(".thha-woo-category-link")
    .on("mousemove", function (e) {
      const $title = $(this).find(".thha-woo-category-title");
      const offset = $(this).offset();
      const x = e.pageX - offset.left;
      const y = e.pageY - offset.top;

      $title.css({
        left: x,
        top: y,
      });
    });

  $(".thha-woo-category-link").on("mouseenter", function () {
    const $title = $(this).find(".thha-woo-category-title");
    $title.addClass("active");
  });

  $(".thha-woo-category-link").on("mouseleave", function () {
    const $title = $(this).find(".thha-woo-category-title");
    $title.removeClass("active");
  });
});
