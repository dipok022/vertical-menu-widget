(function ($) {
  "use strict";

  // Variant 02
  $(document).ready(function () {
    let teamMembers = $(".thha-team-members.thha-presets-2");

    teamMembers.find(".thha-team-card").each(function () {
      $(this)
        .find(".thha-team-social a")
        .each(function (index) {
          let delay = 0.3 + index * 0.1; // 0.3s, 0.4s, 0.5s...

          $(this).css({
            "transition-delay": delay + "s",
          });
        });
    });
  });
})(jQuery);
