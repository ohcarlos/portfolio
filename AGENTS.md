# AGENTS.md

## Project state

Personal portfolio site for Carlos Eduardo de Ataide Pedro (Sistemas de Informação, Volta Redonda, RJ). It is a static two-page site with no `package.json`, bundler, build step, test suite, or lint config. Open the HTML directly in a browser; do not scaffold Next.js/Vite/Tailwind or add tooling unless asked.

Pages:

- `index.html`: hero, profile card, about, stack, featured projects, experience timeline, education, languages, skills, contact.
- `projetos.html`: projects catalog with category filter tabs (ARIA tablist) and a native `<dialog>` case study per project, deep-linked by hash (`#sispatrimonio`, `#knowli`, `#automacao`).

Supporting files:

- `assets/css/style.css`: all styling, dark theme by default plus a light variant via `[data-theme="light"]`, tokens at the top.
- `assets/js/site.js`: theme toggle and `localStorage` persistence, mobile menu, scrollspy, reveal animations, copy-email, footer year.
- `assets/js/projects.js`: project data (single source of truth for cards and cases), rendering, filters, dialog and hash/history handling.
- `assets/fonts/`: self-hosted Geist and Geist Mono variable WOFF2 plus the OFL license. No CDN calls.
- `assets/img/logos/`: Simple Icons SVGs used as CSS masks in the stack strip. SQL Server, Power BI and Razor have no logo and appear as text only.
- `assets/CV_Carlos_Eduardo.pdf`: downloadable CV.
- `assets/img/favicon.svg`: favicon.

Constraints:

- All visible copy is Brazilian Portuguese and contains no em dashes.
- No photos and no screenshots anywhere, by explicit request. Project covers are typographic flow diagrams, and architecture is shown as honest text flows instead of fake UI.
- No phone number on the site. Only e-mail, GitHub and LinkedIn.
- Projects are SisPatrimonio (VB6 to web migration in C# MVC + Razor), Knowli (Hackathon UGB 2026, access control) and Python automation. Do not add a "portfolio site" project.
- Keep `localStorage` theme persistence, keyboard support for tabs and the dialog, and the `#main-content` skip link intact.

Not a git repository: no branches, PR flow, CI, or `git diff` to rely on.

## Frontend design skill

`frontend-design` is installed at `.agents/skills/frontend-design/` (source `vudovn/ag-kit`, tracked in `skills-lock.json`) and is available as skill id `frontend-design`.

- Its `SKILL.md` §3 defaults to React/Next.js + Tailwind. That conflicts with this repo's plain-HTML setup — follow its design rules, but ignore the stack defaults unless a framework is actually introduced.
- Read `style-minimalist.md`, `style-brutalist.md`, or `redesign.md` only when the brief calls for it.
- The `blocks/` directory it references does not exist; generate patterns inline as the skill instructs.
- The skill's pre-flight checklist (§14) is mandatory before calling UI work done (zero em dashes, one theme, one accent color, real images, no `h-screen`, etc.).
- Treat `.agents/skills/**` and `skills-lock.json` as vendored: reinstall to update, do not hand-edit content or the `computedHash`.

## Verification

No tests. Static audits use Python 3.12 and must run from the repo root:

```powershell
py -3.12 .agents/skills/frontend-design/scripts/ux_audit.py index.html        # add --json for machine output
py -3.12 .agents/skills/frontend-design/scripts/ux_audit.py projetos.html
py -3.12 .agents/skills/frontend-design/scripts/accessibility_checker.py .    # pass a DIRECTORY
```

- `ux_audit.py` reports warnings that are mostly generic heuristics for marketing sites; it exits 0 with warnings and non-zero on real problems.
- `accessibility_checker.py` rejects a file argument ("Directory not found", exit 2); pass `.` and it scans all HTML/JSX/TSX.
- `accessibility_checker.py` only recognizes skip links pointing at `#main` or `#main-content`, which is why the target is `#main-content`.
- Both exit non-zero when they find problems.
- Plain `py <script>` fails here with "Python was not found…" because the scripts' `#!/usr/bin/env python3` shebang makes the launcher look for `python3`, which resolves to the Microsoft Store stub. Always pin `py -3.12` (or use the full path `%LOCALAPPDATA%\Programs\Python\Python312\python.exe`).
- Manual check: open both pages over `file://`, confirm no console errors, no horizontal scroll at 320, 390, 768 and 1440 px, filters and arrow keys work, and a case opens from a hash deep link and closes with Escape.
