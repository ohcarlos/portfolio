# Portfólio

Site pessoal de **Carlos Eduardo de Ataide Pedro**, estudante de Sistemas de Informação em Volta Redonda, RJ.

Site no ar: <https://ohcarlos.github.io/portfolio/>.

Duas páginas estáticas, sem build e sem dependências externas:

- `index.html`: apresentação, stack, projetos em destaque, experiência, formação e contato.
- `projetos.html`: catálogo com filtros e cases em `<dialog>`, com links diretos por hash.

## Como abrir

Basta abrir `index.html` no navegador. Para servir por HTTP:

```powershell
py -3.12 -m http.server 8000
```

Depois acesse `http://localhost:8000`.

## Estrutura

```
index.html
projetos.html
assets/
  css/style.css
  js/site.js
  js/projects.js
  fonts/            Geist e Geist Mono, servidas localmente
  img/              favicon e logos do stack
  CV_Carlos_Eduardo.pdf
```

Os dados dos projetos ficam em `assets/js/projects.js`, que alimenta tanto os cards quanto os cases.

## Detalhes

- Tema escuro e claro, com preferência salva em `localStorage`.
- Layout responsivo, navegação por teclado nos filtros e no dialog.
- Conteúdo em português, sem imagens de tela e sem telefone.

## Contato

- GitHub: [github.com/ohcarlos](https://github.com/ohcarlos)
- LinkedIn: [carlos-eduardo-ataide-pedro](https://www.linkedin.com/in/carlos-eduardo-ataide-pedro-3435bb248/)
- E-mail: eduardofilho268@outlook.com
