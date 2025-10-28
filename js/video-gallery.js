// video modal
$(document).ready(function () {
  function createModal() {
    if ($("#thha-video-modal").length) return;

    const modal = `
      <div class="thha-Video-modal" id="thha-video-modal" role="dialog" aria-modal="true" aria-hidden="true">
        <div class="thha-Video-modal-inner"">
          <div class="thha-Video-modal-content" id="thha-modal-content">
            <button class="thha-Video-close" id="thha-modal-close" aria-label="Close video">
              <svg viewBox="0 0 24 24">
                <path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7a1 1 0 0 0-1.41 1.41L10.59 12l-4.9 4.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.9a1 1 0 0 0 1.41-1.41L13.41 12l4.9-4.89a1 1 0 0 0 0-1.4z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>`;
    $("body").append(modal);
  }

  function getEmbedUrl(url) {
    try {
      if (url.includes("youtu.be/")) {
        const videoId = url.split("youtu.be/")[1].split("?")[0];
        return `https://www.youtube.com/embed/${videoId}`;
      }

      if (url.includes("watch?v=")) {
        const videoId = url.split("watch?v=")[1].split("&")[0];
        return `https://www.youtube.com/embed/${videoId}`;
      }

      if (url.includes("/embed/")) return url;
    } catch (e) {
      console.warn("Invalid YouTube URL:", url);
    }
    return url;
  }

  function openModal(videoUrl) {
    createModal();

    const $modal = $("#thha-video-modal");
    const $modalContent = $("#thha-modal-content");
    const embedUrl = getEmbedUrl(videoUrl);

    const src = `${embedUrl}?autoplay=1&rel=0&showinfo=0`;

    const $iframe = $("<iframe>", {
      src,
      allow:
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
      allowfullscreen: true,
      title: "Embedded YouTube video",
    });

    $modalContent.find("iframe").remove();
    $modalContent.append($iframe);
    $modal.addClass("thha-Video-open").attr("aria-hidden", "false");
  }

  function closeModal() {
    const $modal = $("#thha-video-modal");
    $modal.removeClass("thha-Video-open").attr("aria-hidden", "true");
    $("#thha-modal-content iframe").remove();
  }

  $(".thha-video-card").on("click", function () {
    const url = $(this).attr("data-video");
    if (!url) return;
    openModal(url);
  });

  $(document).on("click", "#thha-modal-close", closeModal);
  $(document).on("click", "#thha-video-modal", function (e) {
    if (e.target === this) closeModal();
  });
  $(document).on("keydown", function (e) {
    if (
      e.key === "Escape" &&
      $("#thha-video-modal").hasClass("thha-Video-open")
    )
      closeModal();
  });
});

// video filters button

// $(document).ready(function () {
//   const filters = document.querySelectorAll(".thha-filter-btn");
//   const videoCard = document.querySelectorAll(".thha-video-card");
//   let activeFilter = "all";

//   filters.forEach((btn) => {
//     btn.addEventListener("click", () => {
//       filters.forEach((f) => f.classList.remove("active"));
//       btn.classList.add("active");
//       activeFilter = btn.dataset.filter;
//       filterVideos();
//     });
//   });

//   function filterVideos() {
//     videoCard.forEach((card) => {
//       const tags = card.dataset.tags.toLowerCase();
//       if (activeFilter === "all" || tags.includes(activeFilter)) {
//         card.style.display = "";
//       } else {
//         card.style.display = "none";
//       }
//     });
//   }
// });

$(document).ready(function () {
  const gallery = document.querySelector("#thha-filter-video-gallerys");

  if (!gallery) return; // stop if gallery not found

  const filters = gallery.querySelectorAll(".thha-filter-btn");
  const videoCards = gallery.querySelectorAll(".thha-video-card");
  let activeFilter = "all";

  filters.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      filters.forEach((f) => f.classList.remove("active"));
      btn.classList.add("active");
      activeFilter = btn.dataset.filter || "all";
      filterVideos();
    });
  });

  function filterVideos() {
    videoCards.forEach((card) => {
      const tags = (card.dataset.tags || "").toLowerCase();
      if (activeFilter === "all" || tags.includes(activeFilter)) {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }
    });
  }
});
