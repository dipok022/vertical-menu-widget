// presets 1
$(document).ready(function () {
  const $wrapper = $(".thha-presets-1");

  $wrapper.each(function () {
    const $section = $(this);
    const $marquee = $section.find(".thha-marquee");
    const $trendingWrapper = $section.find(".thha-trending-wrapper");

    $trendingWrapper.hover(
      function () {
        $marquee.addClass("thha-paused");
      },
      function () {
        $marquee.removeClass("thha-paused");
      },
    );

    let isDown = false;
    let startX;
    let scrollLeft;

    $trendingWrapper.on("mousedown", function (e) {
      isDown = true;
      startX = e.pageX - this.offsetLeft;
      scrollLeft = this.scrollLeft;
      $(this).addClass("thha-dragging");
    });

    $trendingWrapper.on("mouseleave mouseup", function () {
      isDown = false;
      $(this).removeClass("thha-dragging");
    });

    $trendingWrapper.on("mousemove", function (e) {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - this.offsetLeft;
      const walk = (x - startX) * 2;
      this.scrollLeft = scrollLeft - walk;
    });
  });
});
