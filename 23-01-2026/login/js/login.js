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

// presets 4
jQuery(document).ready(function ($) {
  $(".thha-presets-4").each(function () {
    const $wrapper = $(this);

    if (!$wrapper.find(".thha-auth-wrapper").length) {
      return;
    }

    function thhaSwitch(tab) {
      $wrapper.find(".thha-tab").removeClass("thha-active");
      $wrapper
        .find('.thha-tab[data-tab="' + tab + '"]')
        .addClass("thha-active");

      if (tab === "signup") {
        $wrapper
          .find(".thha-tab-indicator")
          .css("transform", "translateX(100%)");
      } else {
        $wrapper.find(".thha-tab-indicator").css("transform", "translateX(0)");
      }

      $wrapper.find(".thha-form").removeClass("thha-active");
      $wrapper.find("#" + tab).addClass("thha-active");

      if (tab === "signup") {
        $wrapper.find(".thha-open-signup").hide();
        $wrapper.find(".thha-open-signin").show();
      } else {
        $wrapper.find(".thha-open-signup").show();
        $wrapper.find(".thha-open-signin").hide();
      }
    }

    $wrapper.find(".thha-tab").on("click", function (e) {
      e.preventDefault();
      const tab = $(this).data("tab");
      thhaSwitch(tab);
    });

    $wrapper.find(".thha-open-signup").on("click", function (e) {
      e.preventDefault();
      thhaSwitch("signup");
    });

    $wrapper.find(".thha-open-signin").on("click", function (e) {
      e.preventDefault();
      thhaSwitch("signin");
    });

    $wrapper.find(".thha-open-signin").hide();
  });
});

// presets 5
jQuery(document).ready(function ($) {
  const $wrapper = $(".thha-presets-5");

  const $auth = $wrapper.find(".thha-auth-wrapper");

  function thhaUpdateHeight() {
    const $active = $wrapper.find(".thha-panel:visible");
    const height = $active.outerHeight(true);

    $auth.stop().animate(
      {
        height: height,
      },
      400,
    );
  }

  setTimeout(thhaUpdateHeight, 100);

  $wrapper.find(".thha-open-signup").click(function () {
    $auth.addClass("thha-flip");

    setTimeout(function () {
      $wrapper.find(".thha-signin").hide();
      $wrapper.find(".thha-signup").show();
      thhaUpdateHeight();
    }, 350);
  });

  $wrapper.find(".thha-open-signin").click(function () {
    $auth.removeClass("thha-flip");

    setTimeout(function () {
      $wrapper.find(".thha-signup").hide();
      $wrapper.find(".thha-signin").show();
      thhaUpdateHeight();
    }, 350);
  });
});
