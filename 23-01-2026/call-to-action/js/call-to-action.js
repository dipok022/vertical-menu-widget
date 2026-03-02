// presets 3

jQuery(document).ready(function ($) {
  let $cta = $(".thha-presets-3 .thha-cta-wrapper");

  let observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          $cta.addClass("active");
        }
      });
    },
    { threshold: 0.3 },
  );

  $cta.each(function () {
    observer.observe(this);
  });
});

// presets 4
jQuery(document).ready(function ($) {
  function thhaRevealOnScroll() {
    $(".thha-presets-4 .thha-cta-content, .thha-presets-4 .thha-cta-image")
      .not(".thha-show")
      .each(function () {
        var elementTop = $(this).offset().top;
        var windowTop = $(window).scrollTop();
        var windowHeight = $(window).height();

        if (windowTop + windowHeight > elementTop + 100) {
          $(this).addClass("thha-show");
        }
      });
  }

  thhaRevealOnScroll();
  $(window).on("scroll", thhaRevealOnScroll);
});
