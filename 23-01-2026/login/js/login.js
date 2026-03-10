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

// presets 3
jQuery(document).ready(function ($) {
  const $wrapper = $(".thha-presets-3");

  function thhaUpdateHeight() {
    const $active = $wrapper.find(".thha-form.thha-active");
    const height = $active.outerHeight();

    $wrapper.find(".thha-form-area").height(height);
  }

  thhaUpdateHeight();

  function thhaSwitchForm(showForm, hideForm, direction) {
    hideForm.removeClass("thha-active");

    if (direction === "left") {
      hideForm.addClass("thha-exit-left");
    } else {
      hideForm.addClass("thha-exit-right");
    }

    setTimeout(function () {
      hideForm.removeClass("thha-exit-left thha-exit-right");
      showForm.addClass("thha-active");

      thhaUpdateHeight();
    }, 200);
  }

  $wrapper.find(".thha-open-signup").on("click", function () {
    thhaSwitchForm(
      $wrapper.find("#thha-signup"),
      $wrapper.find("#thha-signin"),
      "left",
    );
  });

  $wrapper.find(".thha-open-signin").on("click", function () {
    thhaSwitchForm(
      $wrapper.find("#thha-signin"),
      $wrapper.find("#thha-signup"),
      "right",
    );
  });

  $wrapper.find(".thha-pass-toggle").on("click", function () {
    let input = $(this).siblings(".thha-password");

    if (input.attr("type") === "password") {
      input.attr("type", "text");
      $(this).text("🙈");
    } else {
      input.attr("type", "password");
      $(this).text("👁");
    }
  });
});
