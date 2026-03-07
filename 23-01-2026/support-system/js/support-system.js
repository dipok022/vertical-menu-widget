// presets 5
jQuery(document).ready(function ($) {
  const $wrapper = $(".thha-presets-1");

  var $loginPanel = $wrapper.find("#thha-login-panel");
  var $signupPanel = $wrapper.find("#thha-signup-panel");
  var isAnimating = false;

  function thhaSwitch(hidePanel, showPanel, direction) {
    if (isAnimating) return;
    isAnimating = true;

    var outClass =
      direction === "left" ? "thha-slide-out-left" : "thha-slide-out-right";
    var inClass =
      direction === "left" ? "thha-slide-in-right" : "thha-slide-in-left";

    hidePanel.addClass(outClass);

    setTimeout(function () {
      hidePanel.addClass("thha-hidden").removeClass(outClass);
      showPanel.removeClass("thha-hidden").addClass(inClass);

      setTimeout(function () {
        showPanel.removeClass(inClass);
        isAnimating = false;
      }, 420);
    }, 400);
  }

  $wrapper.find("#thha-go-signup").on("click", function (e) {
    e.preventDefault();
    thhaSwitch($loginPanel, $signupPanel, "left");
  });

  $wrapper.find("#thha-go-login").on("click", function (e) {
    e.preventDefault();
    thhaSwitch($signupPanel, $loginPanel, "right");
  });
});
