(function () {
  "use strict";

  var projects = [
    {
      slug: "sispatrimonio",
      index: "01",
      title: "SisPatrimonio",
      category: "Web",
      filter: "web",
      meta: "Sistema interno",
      summary:
        "Migração de um sistema de gestão de ativos do legado VB6 para o navegador, com C#, ASP.NET MVC e Razor.",
      stack: ["C#", "ASP.NET MVC", "Razor", "SQL Server", "Git"],
      coverClass: "cover-a",
      coverFlow: ["Sistema legado", "Migração para web", "Rotina no navegador"],
      coverNote: "C# · MVC · Razor",
      context:
        "O setor de TI usava um sistema de gestão de ativos em VB6, preso ao ambiente desktop.",
      problem:
        "Os usuários do setor reclamavam da usabilidade e do acesso limitado ao navegador, o que atrapalhava a rotina de gestão dos ativos.",
      solution:
        "Migrei o sistema para a web em C# com ASP.NET MVC e Razor, mantendo a base em SQL Server e o fluxo de cadastro e consulta de ativos.",
      role: "Desenvolvimento da migração, evolução e manutenção do sistema.",
      result:
        "A rotina do setor passou a ser feita pelo navegador, com uma interface mais simples e sem depender do ambiente legado.",
      learning:
        "Prática com migração de sistema legado, manutenção de software em uso real e evolução de interface.",
      flow: ["Navegador", "Razor Views", "ASP.NET MVC", "SQL Server"],
      links: []
    },
    {
      slug: "knowli",
      index: "02",
      title: "Knowli",
      category: "Acadêmico",
      filter: "academico",
      meta: "Hackathon 2026",
      summary:
        "Plataforma para centralizar materiais de estudo por curso, período e matéria, com perfis de aluno e administrador.",
      stack: [
        "C#",
        "ASP.NET Core 8",
        "Entity Framework Core 8",
        "SQL Server",
        "Razor",
        "Bootstrap 5"
      ],
      coverClass: "cover-b",
      coverFlow: ["Material disperso", "Organização por matéria", "Estudo centralizado"],
      coverNote: "ASP.NET Core 8",
      context: "Hackathon UGB 2026, equipe KnowLi com cinco integrantes.",
      problem:
        "Estudantes universitários não têm um lugar centralizado para encontrar resumos, listas e mapas mentais. O material existe, mas fica disperso em grupos de WhatsApp, drives pessoais e pastas sem estrutura.",
      solution:
        "A plataforma organiza o conteúdo por curso, período e matéria, com login por matrícula, upload e download de arquivos e perfis de acesso Aluno e Admin.",
      role: "Controle de acesso, separando permissões de aluno e administrador.",
      result:
        "MVP funcional apresentado no hackathon, com login, CRUD, upload e download e navegação por curso, período e matéria.",
      learning:
        "Trabalho em equipe sob prazo curto e implementação de autorização por perfil.",
      flow: [
        "Aluno ou admin",
        "Razor Views",
        "ASP.NET Core MVC",
        "EF Core",
        "SQL Server"
      ],
      links: [
        {
          label: "Repositório no GitHub",
          url: "https://github.com/UgoCoelho/KNOWLI-Hackathon-UGB"
        }
      ]
    },
    {
      slug: "automacao",
      index: "03",
      title: "Automação de rotinas",
      category: "Automação",
      filter: "automacao",
      meta: "Rotina interna",
      summary:
        "Scripts em Python para automatizar tarefas administrativas repetitivas e devolver tempo ao time.",
      stack: ["Python", "Processos administrativos"],
      coverClass: "cover-c",
      coverFlow: ["Tarefa manual", "Script em Python", "Rotina automática"],
      coverNote: "Python",
      context:
        "Tarefas administrativas manuais tomavam parte do dia e dependiam de repetição.",
      problem:
        "O trabalho repetitivo consumia tempo que poderia ser usado em atividades mais úteis.",
      solution:
        "Desenvolvi scripts em Python para executar essas rotinas de forma automática, com menos intervenção manual.",
      role: "Levantamento das tarefas e desenvolvimento dos scripts.",
      result:
        "Menos tempo gasto em trabalho manual e processos mais rápidos no dia a dia.",
      learning: "Automação de processos e leitura de rotinas operacionais.",
      flow: ["Entrada", "Script Python", "Saída"],
      links: []
    }
  ];

  var grid = document.querySelector("[data-projects-grid]");
  if (!grid) return;

  var tabs = Array.prototype.slice.call(
    document.querySelectorAll("[data-filter]")
  );
  var panel = document.getElementById("projects-panel");
  var count = document.getElementById("project-count");
  var emptyState = document.querySelector("[data-empty-state]");
  var clearButton = document.querySelector("[data-clear-filter]");
  var dialog = document.getElementById("case-dialog");
  var dialogContent = dialog
    ? dialog.querySelector("[data-case-content]")
    : null;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var state = { filter: "todos" };
  var lastTrigger = null;

  function findProject(slug) {
    return projects.filter(function (project) {
      return project.slug === slug;
    })[0];
  }

  function coverMarkup(project) {
    var flow = project.coverFlow
      .map(function (label, index) {
        var arrow =
          index < project.coverFlow.length - 1
            ? '<span class="arrow" aria-hidden="true">\u2192</span>'
            : "";
        return '<span class="flow-step">' + label + arrow + "</span>";
      })
      .join("");

    return (
      '<div class="cover ' +
      project.coverClass +
      '" aria-hidden="true">' +
      '<span class="cover-index mono">' +
      project.index +
      "</span>" +
      '<span class="cover-cat mono">' +
      project.category +
      "</span>" +
      '<span class="cover-flow mono">' +
      flow +
      "</span>" +
      '<span class="cover-note mono">' +
      project.coverNote +
      "</span>" +
      "</div>"
    );
  }

  function cardMarkup(project) {
    return (
      '<a class="project-card" href="#' +
      project.slug +
      '" data-slug="' +
      project.slug +
      '" style="view-transition-name: card-' +
      project.slug +
      '">' +
      coverMarkup(project) +
      '<div class="card-body">' +
      '<div class="card-meta mono"><span>' +
      project.category +
      "</span><span>" +
      project.meta +
      "</span></div>" +
      '<h3 class="card-title">' +
      project.title +
      "</h3>" +
      '<p class="card-summary">' +
      project.summary +
      "</p>" +
      '<p class="card-stack mono">' +
      project.stack.join(" · ") +
      "</p>" +
      '<span class="card-cta">Abrir case <span aria-hidden="true">\u2192</span></span>' +
      "</div></a>"
    );
  }

  function render() {
    var visible = projects.filter(function (project) {
      return state.filter === "todos" || project.filter === state.filter;
    });

    grid.innerHTML = visible.map(cardMarkup).join("");

    if (count) {
      count.textContent =
        visible.length + (visible.length === 1 ? " projeto" : " projetos");
    }

    if (emptyState) {
      emptyState.hidden = visible.length > 0;
    }

    document.dispatchEvent(new CustomEvent("projects:rendered"));
  }

  function activate(filter) {
    var valid = tabs.some(function (tab) {
      return tab.dataset.filter === filter;
    })
      ? filter
      : "todos";

    state.filter = valid;

    tabs.forEach(function (tab) {
      var selected = tab.dataset.filter === valid;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });

    if (panel) {
      panel.setAttribute("aria-labelledby", "tab-" + valid);
    }

    function update() {
      render();
    }

    if (document.startViewTransition && !reduceMotion.matches) {
      document.startViewTransition(update);
    } else {
      update();
    }
  }

  tabs.forEach(function (tab, index) {
    tab.addEventListener("click", function () {
      activate(tab.dataset.filter);
    });

    tab.addEventListener("keydown", function (event) {
      var nextIndex = null;

      if (event.key === "ArrowRight") {
        nextIndex = (index + 1) % tabs.length;
      } else if (event.key === "ArrowLeft") {
        nextIndex = (index - 1 + tabs.length) % tabs.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = tabs.length - 1;
      }

      if (nextIndex === null) return;

      event.preventDefault();
      tabs[nextIndex].focus();
      activate(tabs[nextIndex].dataset.filter);
    });
  });

  if (clearButton) {
    clearButton.addEventListener("click", function () {
      activate("todos");
      if (tabs[0]) tabs[0].focus();
    });
  }

  function slugFromHash() {
    var raw = window.location.hash.replace(/^#/, "");
    if (!raw) return "";
    try {
      return decodeURIComponent(raw);
    } catch (error) {
      return raw;
    }
  }

  function setHash(slug) {
    var target = slug ? "#" + slug : window.location.pathname + window.location.search;
    try {
      window.history.pushState(null, "", target);
    } catch (error) {
      window.location.hash = slug || "";
    }
  }

  function caseMarkup(project) {
    var flow = project.flow
      .map(function (step) {
        return "<li class=\"mono\">" + step + "</li>";
      })
      .join("");

    var links = project.links.length
      ? '<div class="case-links">' +
        project.links
          .map(function (link) {
            return (
              '<a class="btn btn-ghost" href="' +
              link.url +
              '" target="_blank" rel="noopener noreferrer">' +
              link.label +
              ' <span aria-hidden="true">\u2197</span>' +
              '<span class="sr-only"> (abre em nova aba)</span></a>'
            );
          })
          .join("") +
        "</div>"
      : "";

    return (
      '<div class="case-head">' +
      '<p class="case-kicker mono">' +
      project.index +
      " · " +
      project.category +
      " · " +
      project.meta +
      "</p>" +
      '<h2 id="case-title">' +
      project.title +
      "</h2>" +
      '<p class="case-summary">' +
      project.summary +
      "</p>" +
      "</div>" +
      '<div class="case-body">' +
      '<div class="case-section"><h3>Stack e papel</h3>' +
      '<dl class="case-facts">' +
      "<div><dt>Stack</dt><dd>" +
      project.stack.join(", ") +
      "</dd></div>" +
      "<div><dt>Meu papel</dt><dd>" +
      project.role +
      "</dd></div>" +
      "</dl></div>" +
      links +
      '<div class="case-section"><h3>Fluxo</h3>' +
      '<div class="case-flow" role="group" aria-label="Fluxo do projeto"><ol>' +
      flow +
      "</ol></div></div>" +
      '<div class="case-section"><h3>Contexto</h3><p>' +
      project.context +
      "</p></div>" +
      '<div class="case-section"><h3>Problema</h3><p>' +
      project.problem +
      "</p></div>" +
      '<div class="case-section"><h3>Solução</h3><p>' +
      project.solution +
      "</p></div>" +
      '<div class="case-section"><h3>Resultado</h3><p>' +
      project.result +
      "</p></div>" +
      '<div class="case-section"><h3>O que ficou</h3><p>' +
      project.learning +
      "</p></div>" +
      "</div>"
    );
  }

  function openCase(slug, updateHash) {
    var project = findProject(slug);
    if (!project || !dialog || !dialogContent) return;

    dialogContent.innerHTML = caseMarkup(project);
    dialogContent.scrollTop = 0;

    if (!dialog.open) {
      if (typeof dialog.showModal === "function") {
        dialog.showModal();
      } else {
        dialog.setAttribute("open", "");
      }
    }

    document.body.classList.add("dialog-open");

    if (updateHash && window.location.hash !== "#" + slug) {
      setHash(slug);
    }
  }

  function closeCase() {
    if (!dialog) return;
    if (dialog.open && typeof dialog.close === "function") {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
      document.body.classList.remove("dialog-open");
    }
  }

  grid.addEventListener("click", function (event) {
    var card = event.target.closest(".project-card");
    if (!card) return;
    event.preventDefault();
    lastTrigger = card;
    openCase(card.getAttribute("data-slug"), true);
  });

  if (dialog) {
    var closeButton = dialog.querySelector("[data-close-case]");

    if (closeButton) {
      closeButton.addEventListener("click", closeCase);
    }

    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) closeCase();
    });

    dialog.addEventListener("close", function () {
      document.body.classList.remove("dialog-open");

      var current = slugFromHash();
      if (current && findProject(current)) {
        setHash("");
      }

      if (lastTrigger && document.contains(lastTrigger)) {
        try {
          lastTrigger.focus({ preventScroll: true });
        } catch (error) {
          lastTrigger.focus();
        }
      }
      lastTrigger = null;
    });
  }

  window.addEventListener("hashchange", function () {
    var slug = slugFromHash();
    if (slug && findProject(slug)) {
      openCase(slug, false);
    } else if (dialog && dialog.open) {
      closeCase();
    }
  });

  render();

  var initial = slugFromHash();
  if (initial && findProject(initial)) {
    openCase(initial, false);
  }
})();
