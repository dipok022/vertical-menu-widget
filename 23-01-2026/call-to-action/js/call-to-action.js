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
