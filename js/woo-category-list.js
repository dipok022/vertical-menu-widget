// design 3
$(document).ready(function () {
  $(".thha-presets-4")
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

// design 5
$(document).ready(function () {
  const $carousel = $("#thha-woo-category-carousel");
  const $track = $carousel.find(".thha-woo-category-list");
  const $slides = $track.find(".thha-woo-category-item");
  const $bulletsWrap = $carousel.find(".thha-woo-category-list-bullets");

  const total = $slides.length;

  const itemsToShow = 3;
  let current = 0;
  let timer = null;
  const delay = 3500;

  let slideWidth = 0;
  let gap = 15;

  function getSlideWidth() {
    const carouselWidth = $carousel.width();
    return (carouselWidth - gap * (itemsToShow - 1)) / itemsToShow;
  }

  function updateSlideWidth() {
    slideWidth = getSlideWidth();
    $slides.css("width", slideWidth);
  }

  $slides.slice(0, itemsToShow).clone().appendTo($track);

  for (let i = 0; i < total; i++) {
    $bulletsWrap.append(`<button data-index="${i}"></button>`);
  }
  const $bullets = $bulletsWrap.find("button");

  function goTo(index, animate = true) {
    if (animate) {
      $track.css("transition", "transform 0.6s ease");
    } else {
      $track.css("transition", "none");
    }

    $track.css("transform", `translateX(-${index * (slideWidth + gap)}px)`);
    $bullets
      .removeClass("active")
      .eq(index % total)
      .addClass("active");
    current = index;
  }

  function nextSlide() {
    goTo(current + 1);
    if (current >= total) {
      setTimeout(() => {
        goTo(0, false);
      }, 600);
    }
  }

  function startAuto() {
    timer = setInterval(nextSlide, delay);
  }

  function resetAuto() {
    clearInterval(timer);
    startAuto();
  }

  $bullets.on("click", function () {
    const index = $(this).data("index");
    goTo(index);
    resetAuto();
  });

  $(window).resize(function () {
    updateSlideWidth();
    goTo(current, false);
  });

  updateSlideWidth();
  goTo(0);
  startAuto();
});
