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

// presets 2,3,4
$(document).ready(function () {
  $(".thha-presets-2, .thha-presets-3, .thha-presets-4").each(function () {
    const $wrapper = $(this);
    const $slider = $wrapper.find(".thha-slider");
    const $slidesContainer = $wrapper.find(".thha-slides");

    const direction = $slider.data("slide") || "vertical";
    const slideDelay = 4000;

    let $slides = $slidesContainer.find(".thha-slide");

    if (direction === "horizontal") {
      $slidesContainer.css({
        display: "flex",
        flexDirection: "row",
        width: "100%",
      });

      $slides.css({
        minWidth: "100%",
        flexShrink: "0",
      });
    } else {
      $slidesContainer.css({
        display: "flex",
        flexDirection: "column",
      });
    }

    const firstClone = $slides.first().clone();
    const lastClone = $slides.last().clone();

    $slidesContainer.append(firstClone);
    $slidesContainer.prepend(lastClone);

    $slides = $slidesContainer.find(".thha-slide");

    let totalSlides = $slides.length;
    let currentIndex = 1;
    let isAnimating = false;
    let interval;

    function getSlideSize() {
      return direction === "vertical"
        ? $slides.first().outerHeight(true)
        : $slider.outerWidth();
    }

    function setPosition(index, animate = true) {
      const slideSize = getSlideSize();

      $slidesContainer.css(
        "transition",
        animate ? "transform .6s cubic-bezier(.4,0,.2,1)" : "none",
      );

      if (direction === "vertical") {
        $slidesContainer.css(
          "transform",
          `translateY(-${index * slideSize}px)`,
        );
      } else {
        $slidesContainer.css(
          "transform",
          `translateX(-${index * slideSize}px)`,
        );
      }
    }

    setPosition(currentIndex, false);

    function nextSlide() {
      if (isAnimating) return;
      isAnimating = true;

      currentIndex++;
      setPosition(currentIndex, true);

      setTimeout(() => {
        if (currentIndex === totalSlides - 1) {
          currentIndex = 1;
          setPosition(currentIndex, false);
        }
        isAnimating = false;
      }, 600);
    }

    function prevSlide() {
      if (isAnimating) return;
      isAnimating = true;

      currentIndex--;
      setPosition(currentIndex, true);

      setTimeout(() => {
        if (currentIndex === 0) {
          currentIndex = totalSlides - 2;
          setPosition(currentIndex, false);
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

    $wrapper.find("#next").on("click", function () {
      nextSlide();
      resetAuto();
    });

    $wrapper.find("#prev").on("click", function () {
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

    $(window).on("resize", function () {
      setPosition(currentIndex, false);
    });

    startAuto();
  });
});
