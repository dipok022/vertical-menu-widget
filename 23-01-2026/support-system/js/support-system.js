// presets 5
jQuery(document).ready(function ($) {
  const $wrapper = $(".thha-presets-5");

  $wrapper.each(function () {
    const $this = $(this);

    $this.find(".thha-open-btn").on("click", function () {
      $this.find(".thha-overlay").fadeIn(200);
      $this.find(".thha-drawer").addClass("active");
    });

    $this.find(".thha-close, .thha-overlay").on("click", function () {
      $this.find(".thha-overlay").fadeOut(200);
      $this.find(".thha-drawer").removeClass("active");
    });

    $this.find(".thha-issue").on("click", function () {
      $this.find(".thha-issue").removeClass("active");
      $(this).addClass("active");
    });
  });
});
