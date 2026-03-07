// presets 1
jQuery(document).ready(function ($) {
  var $loginPanel = $("#thha-login-panel");
  var $signupPanel = $("#thha-signup-panel");
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

  $("#thha-go-signup").on("click", function (e) {
    e.preventDefault();
    thhaSwitch($loginPanel, $signupPanel, "left");
  });

  $("#thha-go-login").on("click", function (e) {
    e.preventDefault();
    thhaSwitch($signupPanel, $loginPanel, "right");
  });
});

// presets 2
jQuery(document).ready(function ($) {
  const $wrapper = $(".thha-presets-2");
  const $container = $wrapper.find(".thha-lonin-wrapper");
  const $signup = $wrapper.find("#thha-signup-btn");
  const $signin = $wrapper.find("#thha-signin-btn");

  $signup.on("click", function () {
    $container.addClass("thha-right-active");
  });

  $signin.on("click", function () {
    $container.removeClass("thha-right-active");
  });
});
