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

Somente `public/` é publicado. Cada push em `main` passa pelas verificações antes do deploy. Depois, a pipeline compara o HTML, os assets, robots.txt e sitemap servidos no endereço público com os arquivos publicados.

SEO inclui canonical, hreflang, sitemap e ProfilePage/Person, com a mesma identidade nas duas versões e referências ao GitHub e LinkedIn. O conteúdo está no HTML, sem exigir execução de JavaScript para ler os projetos. Isso permite rastreamento, mas não comprova indexação nem garante posição em buscas ou recomendações de IA. [Orientação do Google sobre recursos de IA](https://developers.google.com/search/docs/appearance/ai-features).

[Publicação oficial do GitHub Pages por Actions](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
