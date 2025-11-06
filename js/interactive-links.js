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

// Design -3
$(document).ready(function () {
  const $preset = $(".thha-presets-3");

  $preset.find(".thha-interactive-link-item").on("mouseenter", function (e) {
    e.preventDefault();
    const imageIndex = $(this).data("image");

    $preset.find(".thha-interactive-link-item").removeClass("active");
    $(this).addClass("active");

    $preset.find(".thha-interactive-link-image").removeClass("active");
    $preset
      .find(".thha-interactive-link-image")
      .eq(imageIndex)
      .addClass("active");
  });

  $preset.find(".thha-interactive-link-item").on("click", function (e) {
    e.preventDefault();
    if (window.innerWidth <= 1024) {
      $("html, body").animate(
        {
          scrollTop: $preset.find(".thha-interactive-link-images").offset().top,
        },
        600
      );
    }
  });
});

// Design -4
$(document).ready(function () {
  const $preset = $(".thha-presets-4");

  const $bigImages = $preset.find(".thha-interactive-link-thumb-image");
  const $thumbs = $preset.find(".thha-interactive-link-thumbs a");

  $bigImages.removeClass("active").first().addClass("active");
  $thumbs.removeClass("active-thumb").first().addClass("active-thumb");

  function showIndex(index) {
    $bigImages.removeClass("active").eq(index).addClass("active");
    $thumbs.removeClass("active-thumb").eq(index).addClass("active-thumb");
  }

  $thumbs.each(function (i) {
    $(this).on("click", function (e) {
      e.preventDefault();
      showIndex(i);
    });

    $(this).on("mouseenter", function () {
      showIndex(i);
    });
  });

  $(document).on("keydown", function (e) {
    const $current = $bigImages.filter(".active");
    let idx = $bigImages.index($current);

    if (e.key === "ArrowUp" || e.key === "ArrowLeft")
      idx = Math.max(0, idx - 1);
    if (e.key === "ArrowDown" || e.key === "ArrowRight")
      idx = Math.min($bigImages.length - 1, idx + 1);

    showIndex(idx);
  });
});
