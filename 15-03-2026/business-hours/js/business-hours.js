(function ($) {
  "use strict";

  var DAY_NAMES = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  function refreshBusinessHours() {
    var todayName = DAY_NAMES[new Date().getDay()];

    $(".thha-business-hours .thha-bh-day").each(function () {
      var $row = $(this);
      var day = String($row.data("day") || "").toLowerCase();
      var time = $.trim($row.find(".thha-bh-time").text() || "").toLowerCase();

      $row.toggleClass("thha-closed", time === "closed");

      $row.toggleClass("thha-today", day === todayName);
    });
  }

  $(document).ready(function () {
    refreshBusinessHours();

    var now = new Date();
    var nextMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
      0,
      5,
    );
    var msUntilMidnight = nextMidnight - now;

    setTimeout(function rollover() {
      refreshBusinessHours();

      setInterval(refreshBusinessHours, 24 * 60 * 60 * 1000);
    }, msUntilMidnight);
  });
})(jQuery);
