// presets 1
$(document).ready(function () {
  const $wrapper = $(".thha-presets-1");

  $wrapper.each(function () {
    const $section = $(this);
    const $marquee = $section.find(".thha-marquee");

    $marquee.hover(
      function () {
        $marquee.addClass("thha-paused");
      },
      function () {
        $marquee.removeClass("thha-paused");
      },
    );
  });
});

// presets 2
$(document).ready(function () {
  const $wrapper = $(".thha-presets-2");
  const slidesContainer = $wrapper.find(".thha-slides");
  const slideHeight = 60;
  const slideDelay = 4000;

  const firstSlide = slidesContainer.find(".thha-slide").first().clone();
  const lastSlide = slidesContainer.find(".thha-slide").last().clone();

  slidesContainer.append(firstSlide);
  slidesContainer.prepend(lastSlide);

  const totalSlides = slidesContainer.find(".thha-slide").length;
  let currentIndex = 1;
  let interval;
  let isAnimating = false;

  slidesContainer.css(
    "transform",
    "translateY(-" + currentIndex * slideHeight + "px)",
  );

  function moveSlide() {
    slidesContainer.css("transition", ".6s cubic-bezier(.4,0,.2,1)");
    slidesContainer.css(
      "transform",
      "translateY(-" + currentIndex * slideHeight + "px)",
    );
  }

  function nextSlide() {
    if (isAnimating) return;
    isAnimating = true;
    currentIndex++;
    moveSlide();

    setTimeout(() => {
      if (currentIndex === totalSlides - 1) {
        slidesContainer.css("transition", "none");
        currentIndex = 1;
        slidesContainer.css(
          "transform",
          "translateY(-" + currentIndex * slideHeight + "px)",
        );
      }
      isAnimating = false;
    }, 600);
  }

  function prevSlide() {
    if (isAnimating) return;
    isAnimating = true;
    currentIndex--;
    moveSlide();

    setTimeout(() => {
      if (currentIndex === 0) {
        slidesContainer.css("transition", "none");
        currentIndex = totalSlides - 2;
        slidesContainer.css(
          "transform",
          "translateY(-" + currentIndex * slideHeight + "px)",
        );
      }
      isAnimating = false;
    }, 600);
  }

  function startAuto() {
    interval = setInterval(nextSlide, slideDelay);
  }

  function resetAuto() {
    clearInterval(interval);
    startAuto();
  }

  $wrapper.find("#next").click(function () {
    nextSlide();
    resetAuto();
  });

  $wrapper.find("#prev").click(function () {
    prevSlide();
    resetAuto();
  });

  $wrapper.find(".thha-trending-wrapper").hover(
    function () {
      clearInterval(interval);
    },
    function () {
      startAuto();
    },
  );

  startAuto();
});
