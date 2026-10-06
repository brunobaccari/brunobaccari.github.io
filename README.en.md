# Bruno Baccari's portfolio

[Website](https://brunobaccari.github.io/en/) · [Versão em português](README.md)

A static Portuguese/English site with public QA projects, category filters, search, code and run links. HTML, CSS and JavaScript; no backend, form or analytics. Fonts load from Google Fonts and the portrait from the public GitHub profile.

## Edit and verify

- `public/index.html` and `public/en/index.html`: equivalent content and projects in both languages.
- `public/styles.css`: visual identity and responsive layouts.
- `public/site.js`: filters and search without API calls.

```bash
python -m http.server 8771 --bind 127.0.0.1 --directory public
```

Open `http://127.0.0.1:8771`. To verify with Node 24 and Python 3:

```bash
npm ci
npx playwright install chromium
npm test
```

CI checks both languages on desktop and mobile: combined filters, empty state, navigation, link destinations, overflow and axe. Six tests; failures, skips or incomplete reports block deployment. Summary, JUnit, HTML and failure traces are retained as artifacts for 14 days. Automated accessibility checks do not certify full compliance.

Only `public/` is deployed. Every push to `main` must pass verification before publishing. SEO includes canonical URLs, hreflang, a sitemap and factual Person structured data; it does not guarantee search rankings.

[Official GitHub Pages Actions workflow](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
