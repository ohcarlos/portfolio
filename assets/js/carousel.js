(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var roots = [];
  var SPEED = 40;

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
    var toggle = root.querySelector("[data-carousel-toggle]");
    var autoEnabled = root.hasAttribute("data-carousel-auto");

    var state = {
      auto: false,
      paused: false,
      hovering: false,
      focusWithin: false,
      visible: !("IntersectionObserver" in window),
      raf: null,
      last: 0,
      step: 0,
      loop: 0,
      originals: 0
    };

    function isPaused() {
      return (
        state.paused ||
        state.hovering ||
        state.focusWithin ||
        !state.visible ||
        document.hidden
      );
    }

    function measureLoop() {
      if (!state.originals) {
        state.loop = 0;
        return;
      }

      var first = track.children[0];
      var cloneStart = track.children[state.originals];

      state.loop = cloneStart ? cloneStart.offsetLeft - first.offsetLeft : 0;
    }

    function addClones() {
      state.originals = track.children.length;
      if (!state.originals) return;

      var originals = Array.prototype.slice.call(track.children);
      var styles = window.getComputedStyle(track);
      var gap = parseFloat(styles.columnGap || styles.gap || "") || 0;
      var setWidth = gap * (originals.length - 1);

      originals.forEach(function (card) {
        setWidth += card.getBoundingClientRect().width;
      });

      if (setWidth <= 0) return;

      var copies = Math.max(
        2,
        Math.ceil((track.clientWidth + setWidth) / setWidth)
      );

      for (var copy = 1; copy < copies; copy += 1) {
        originals.forEach(function (card) {
          var clone = card.cloneNode(true);
          clone.setAttribute("aria-hidden", "true");
          clone.setAttribute("tabindex", "-1");
          track.appendChild(clone);
        });
      }

      measureLoop();
    }

    function removeClones() {
      if (!state.originals) return;

      Array.prototype.slice
        .call(track.children, state.originals)
        .forEach(function (node) {
          node.parentNode.removeChild(node);
        });

      state.originals = 0;
      state.loop = 0;
    }

    function setToggle() {
      if (!toggle) return;

      toggle.setAttribute("aria-pressed", String(state.paused));
      toggle.setAttribute(
        "aria-label",
        state.paused ? "Retomar movimento" : "Pausar movimento"
      );
    }

    function tick(now) {
      if (!state.last) state.last = now;

      var delta = Math.min(now - state.last, 80) / 1000;
      state.last = now;

      if (!isPaused() && state.loop > 0) {
        state.step += SPEED * delta;
        var advance = Math.floor(state.step);

        if (advance > 0) {
          state.step -= advance;

          var left = track.scrollLeft + advance;

          while (left >= state.loop) {
            left -= state.loop;
          }

          track.scrollLeft = left;
        }
      }

      state.raf = window.requestAnimationFrame(tick);
    }

    function startAuto() {
      if (!autoEnabled || reduceMotion.matches || state.auto) return;
      if (!track.children.length) return;

      state.auto = true;
      root.classList.add("is-auto");
      addClones();
      setToggle();
      state.last = 0;
      state.raf = window.requestAnimationFrame(tick);
      update(root);
    }

    function stopAuto() {
      if (!state.auto) return;

      state.auto = false;
      root.classList.remove("is-auto");

      if (state.raf) {
        window.cancelAnimationFrame(state.raf);
        state.raf = null;
      }

      removeClones();
      track.scrollLeft = 0;
      update(root);
    }

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

    if (toggle) {
      toggle.addEventListener("click", function () {
        state.paused = !state.paused;
        setToggle();
      });
    }

    root.addEventListener("pointerenter", function () {
      state.hovering = true;
    });

    root.addEventListener("pointerleave", function () {
      state.hovering = false;
    });

    track.addEventListener("focusin", function () {
      state.focusWithin = true;
    });

    track.addEventListener("focusout", function () {
      window.setTimeout(function () {
        state.focusWithin = track.contains(document.activeElement);
      }, 0);
    });

    track.addEventListener(
      "scroll",
      function () {
        update(root);
      },
      { passive: true }
    );

    if ("ResizeObserver" in window) {
      var observer = new ResizeObserver(function () {
        measureLoop();
        update(root);
      });
      observer.observe(track);
    }

    if ("IntersectionObserver" in window) {
      var watcher = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            state.visible = entry.isIntersecting;
          });
        },
        { rootMargin: "100px" }
      );
      watcher.observe(root);
    }

    if (reduceMotion.addEventListener) {
      reduceMotion.addEventListener("change", function () {
        if (reduceMotion.matches) {
          stopAuto();
        } else {
          startAuto();
        }
      });
    }

    update(root);
    startAuto();
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
