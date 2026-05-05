(function ($) {
  "use strict";

  // Design 4 — multi-location tabs.
  // Each .thha-google-map.thha-presets-4 is its own scope so multiple
  // widgets on the same page (Elementor lets users drop several) don't
  // share state. data-index pairs a button with its pane; no DOM ids
  // are used so duplicate widgets can't collide.
  function initLocationTabs($widget) {
    var $tabs = $widget.find(".thha-gm-tab");
    var $panes = $widget.find(".thha-gm-pane");

    $tabs.on("click", function () {
      var idx = String($(this).data("index"));

      $tabs.removeClass("active").attr("aria-selected", "false");
      $(this).addClass("active").attr("aria-selected", "true");

      $panes.removeClass("active");
      $panes.filter('[data-index="' + idx + '"]').addClass("active");
    });
  }

  $(document).ready(function () {
    $(".thha-google-map.thha-presets-4").each(function () {
      initLocationTabs($(this));
    });
  });
})(jQuery);
