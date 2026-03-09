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
// jQuery(document).ready(function ($) {
//   const $wrapper = $(".thha-presets-2");
//   const $container = $wrapper.find(".thha-lonin-wrapper");
//   const $signup = $wrapper.find("#thha-signup-btn");
//   const $signin = $wrapper.find("#thha-signin-btn");

//   $signup.on("click", function () {
//     $container.addClass("thha-right-active");
//   });

//   $signin.on("click", function () {
//     $container.removeClass("thha-right-active");
//   });
// });

// jQuery(document).ready(function ($) {
//   const $wrapper = $(".thha-presets-2");
//   const $container = $wrapper.find(".thha-lonin-wrapper");

//   const $signup = $wrapper.find("#thha-signup-btn");
//   const $signin = $wrapper.find("#thha-signin-btn");

//   const $mobileBtns = $wrapper.find(".thha-mobile-switch .thha-switch-btn");
//   const $switchBg = $wrapper.find(".thha-switch-bg");

//   const $btnIn = $mobileBtns.find(0);
//   const $btnUp = $mobileBtns.eq(1);

//   /* Desktop overlay switch */
//   $signup.on("click", function () {
//     $container.addClass("thha-right-active");
//   });

//   $signin.on("click", function () {
//     $container.removeClass("thha-right-active");
//   });

//   /* Mobile switch */

//   $btnIn.on("click", function () {
//     $mobileBtns.removeClass("active");
//     $(this).addClass("active");

//     $container.removeClass("thha-right-active");
//     $switchBg.removeClass("thha-switch-right");
//   });

//   $btnUp.on("click", function () {
//     $mobileBtns.removeClass("active");
//     $(this).addClass("active");

//     $container.addClass("thha-right-active");
//     $switchBg.addClass("thha-switch-right");
//   });

//   /* Password show/hide */

//   $wrapper.find(".thha-show-pass").on("click", function () {
//     const $btn = $(this);
//     const $input = $btn.closest(".thha-field-group").find("input");

//     if ($input.attr("type") === "password") {
//       $input.attr("type", "text");
//       $btn.addClass("showing");
//     } else {
//       $input.attr("type", "password");
//       $btn.removeClass("showing");
//     }
//   });
// });

jQuery(document).ready(function ($) {
  const $wrapper = $(".thha-presets-2");
  const $container = $wrapper.find(".thha-lonin-wrapper");

  const $signup = $wrapper.find("#thha-signup-btn");
  const $signin = $wrapper.find("#thha-signin-btn");

  const $mobileSwitch = $wrapper.find(".thha-mobile-switch");
  const $mobileBtns = $mobileSwitch.find(".thha-switch-btn");
  const $switchBg = $mobileSwitch.find(".thha-switch-bg");

  const $btnIn = $mobileSwitch.find(".thha-signin-btn");
  const $btnUp = $mobileSwitch.find(".thha-signup-btn");

  // Desktop overlay

  $signup.on("click", function () {
    $container.addClass("thha-right-active");
  });

  $signin.on("click", function () {
    $container.removeClass("thha-right-active");
  });

  // Mobile switch
  $btnIn.on("click", function () {
    $mobileBtns.removeClass("active");
    $(this).addClass("active");

    $container.removeClass("thha-right-active");
    $switchBg.removeClass("thha-switch-right");
  });

  $btnUp.on("click", function () {
    $mobileBtns.removeClass("active");
    $(this).addClass("active");

    $container.addClass("thha-right-active");
    $switchBg.addClass("thha-switch-right");
  });

  // Password toggle
  $wrapper.find(".thha-show-pass").on("click", function () {
    const $btn = $(this);
    const $input = $btn.closest(".thha-field-group").find("input");

    if ($input.attr("type") === "password") {
      $input.attr("type", "text");
      $btn.addClass("showing");
    } else {
      $input.attr("type", "password");
      $btn.removeClass("showing");
    }
  });
});
