(function () {
  "use strict";

  var root = document.documentElement;
  var themeToggle = document.querySelector("[data-theme-toggle]");
  var themeMeta = document.querySelector('meta[name="theme-color"]');
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function setTheme(theme) {
    root.dataset.theme = theme;
    if (themeMeta) {
      themeMeta.setAttribute("content", theme === "light" ? "#F2F4EE" : "#0F1210");
    }
    if (themeToggle) {
      themeToggle.setAttribute(
        "aria-label",
        theme === "light" ? "Ativar tema escuro" : "Ativar tema claro"
      );
    }
  }

  if (themeToggle) {
    setTheme(root.dataset.theme === "light" ? "light" : "dark");

    themeToggle.addEventListener("click", function () {
      var next = root.dataset.theme === "light" ? "dark" : "light";
      setTheme(next);
      try {
        localStorage.setItem("theme", next);
      } catch (error) {
        /* navegação privada pode bloquear o armazenamento */
      }
    });
  }

  var menuToggle = document.querySelector("[data-menu-toggle]");
  var nav = document.getElementById("site-nav");

  function closeMenu() {
    if (!menuToggle || !nav) return;
    nav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", function () {
      var open = menuToggle.getAttribute("aria-expanded") === "true";
      if (open) {
        closeMenu();
      } else {
        nav.classList.add("is-open");
        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Fechar menu");
      }
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        closeMenu();
        menuToggle.focus();
      }
    });

    var desktop = window.matchMedia("(min-width: 900px)");
    desktop.addEventListener("change", function (event) {
      if (event.matches) closeMenu();
    });
  }

  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll(".site-nav a[data-nav]")
  );
  var spyMap = [
    { id: "inicio", key: "inicio" },
    { id: "experiencia", key: "experiencia" },
    { id: "contato", key: "contato" }
  ];
  var spyTargets = spyMap
    .map(function (item) {
      var element = document.getElementById(item.id);
      return element ? { id: item.id, key: item.key, element: element } : null;
    })
    .filter(Boolean);

  if (navLinks.length && spyTargets.length && "IntersectionObserver" in window) {
    var applyCurrent = function (key) {
      navLinks.forEach(function (link) {
        if (link.dataset.nav === key) {
          link.setAttribute("aria-current", key === "inicio" ? "page" : "true");
        } else if (link.hasAttribute("aria-current")) {
          link.removeAttribute("aria-current");
        }
      });
    };

    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var target = spyTargets.filter(function (item) {
            return item.element === entry.target;
          })[0];
          if (target) applyCurrent(target.key);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    spyTargets.forEach(function (item) {
      spy.observe(item.element);
    });
  }

  var revealItems = Array.prototype.slice.call(
    document.querySelectorAll("[data-reveal]")
  );

  if (revealItems.length) {
    if (!("IntersectionObserver" in window) || reduceMotion.matches) {
      revealItems.forEach(function (element) {
        element.classList.add("is-in");
      });
    } else {
      var revealer = new IntersectionObserver(
        function (entries, observer) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
      );

      revealItems.forEach(function (element) {
        revealer.observe(element);
      });
    }
  }

  var copyButton = document.querySelector("[data-copy-email]");
  var copyStatus = document.querySelector("[data-copy-status]");

  if (copyButton && copyStatus) {
    var copyTimer;

    copyButton.addEventListener("click", function () {
      var email = copyButton.getAttribute("data-copy-email") || "";
      var copied = false;

      function announce(success) {
        copyStatus.textContent = success
          ? "E-mail copiado."
          : "Não foi possível copiar. Use o link de e-mail.";
        window.clearTimeout(copyTimer);
        copyTimer = window.setTimeout(function () {
          copyStatus.textContent = "";
        }, 4000);
      }

      function fallbackCopy() {
        var field = document.createElement("textarea");
        field.value = email;
        field.setAttribute("readonly", "");
        field.style.position = "fixed";
        field.style.opacity = "0";
        document.body.appendChild(field);
        field.select();
        try {
          copied = document.execCommand("copy");
        } catch (error) {
          copied = false;
        }
        field.remove();
        announce(copied);
      }

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard
          .writeText(email)
          .then(function () {
            announce(true);
          })
          .catch(fallbackCopy);
      } else {
        fallbackCopy();
      }
    });
  }

  document.querySelectorAll("[data-year]").forEach(function (element) {
    element.textContent = String(new Date().getFullYear());
  });
})();
