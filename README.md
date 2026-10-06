# Portfólio de Bruno Baccari

[Site](https://brunobaccari.github.io/) · [English version](README.en.md)

Site estático em português e inglês, com projetos públicos de QA, filtros por área, busca e links para código e execuções. HTML, CSS e JavaScript; sem backend, formulário ou analytics. Fontes vêm do Google Fonts e a foto, do perfil público do GitHub.

## Editar e verificar

- `public/index.html` e `public/en/index.html`: conteúdo e projetos, equivalentes nos dois idiomas.
- `public/styles.css`: identidade visual e layouts responsivos.
- `public/site.js`: filtro e busca, sem chamadas de API.

```bash
python -m http.server 8771 --bind 127.0.0.1 --directory public
```

Abra `http://127.0.0.1:8771`. Para verificar com Node 24 e Python 3:

```bash
npm ci
npx playwright install chromium
npm test
```

O CI verifica os dois idiomas em desktop e mobile: filtros combinados, estado vazio, navegação, destinos dos links, overflow e axe. Seis testes; falha, skip ou relatório incompleto bloqueiam a publicação. Summary, JUnit, HTML e traces de falhas ficam nos artifacts por 14 dias. A verificação automatizada de acessibilidade não certifica conformidade completa.

Somente `public/` é publicado. Cada push em `main` passa pelas verificações antes do deploy. SEO inclui canonical, hreflang, sitemap e dados estruturados factuais de pessoa; isso não garante posição em buscas.

[Publicação oficial do GitHub Pages por Actions](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
