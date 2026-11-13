(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var roots = [];

  function update(root) {
    var track = root.querySelector("[data-carousel-track]");
    if (!track) return;

    var prev = root.querySelector("[data-carousel-prev]");
    var next = root.querySelector("[data-carousel-next]");
    var max = track.scrollWidth - track.clientWidth;
    var overflow = max > 2;

    root.classList.toggle("has-overflow", overflow);

    if (prev) prev.disabled = !overflow || track.scrollLeft <= 2;
    if (next) next.disabled = !overflow || track.scrollLeft >= max - 2;
  }

  function cardStep(track) {
    var card = track.firstElementChild;
    if (!card) return track.clientWidth;

    var styles = window.getComputedStyle(track);
    var gap = parseFloat(styles.columnGap || styles.gap || "") || 0;

    return card.getBoundingClientRect().width + gap;
  }

  function nudge(root, direction) {
    var track = root.querySelector("[data-carousel-track]");
    if (!track) return;

    track.scrollBy({
      left: direction * cardStep(track),
      behavior: reduceMotion.matches ? "auto" : "smooth"
    });
  }

  function setup(root) {
    if (root.dataset.carouselReady === "true") return;

    var track = root.querySelector("[data-carousel-track]");
    if (!track) return;

    root.dataset.carouselReady = "true";

    var prev = root.querySelector("[data-carousel-prev]");
    var next = root.querySelector("[data-carousel-next]");

    if (prev) {
      prev.addEventListener("click", function () {
        nudge(root, -1);
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        nudge(root, 1);
      });
    }

    track.addEventListener(
      "scroll",
      function () {
        update(root);
      },
      { passive: true }
    );

    if ("ResizeObserver" in window) {
      var observer = new ResizeObserver(function () {
        update(root);
      });
      observer.observe(track);
    }

    update(root);
  }

  function initAll() {
    roots = Array.prototype.slice.call(
      document.querySelectorAll("[data-carousel]")
    );
    roots.forEach(setup);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }

  window.addEventListener("resize", function () {
    roots.forEach(update);
  });

  document.addEventListener("projects:rendered", function () {
    roots.forEach(function (root) {
      var track = root.querySelector("[data-carousel-track]");
      if (track) track.scrollLeft = 0;
      update(root);
    });
  });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      roots.forEach(update);
    });
  }
})();
