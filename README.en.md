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

CI checks both languages on desktop and mobile: combined filters, empty state, navigation, link destinations, overflow and axe. Eight tests; failures, skips or incomplete reports block deployment. Summary, JUnit, HTML and failure traces are retained as artifacts for 14 days. Automated accessibility checks do not certify full compliance.

Only `public/` is deployed. Every push to `main` must pass verification before publishing. After deployment, the pipeline compares the public HTML, assets, robots.txt and sitemap with the published files.

SEO includes canonical URLs, hreflang, a sitemap and ProfilePage/Person data, with a shared identity across both languages and references to GitHub and LinkedIn. Project content is present in the HTML and does not require JavaScript to read. This supports crawling, but does not prove indexing or guarantee search rankings or AI recommendations. [Google guidance for AI features](https://developers.google.com/search/docs/appearance/ai-features).

[Official GitHub Pages Actions workflow](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

`public/llms.txt` provides identity, official sources and a project index for agents supporting the [llms.txt proposal](https://llmstxt.org/). Both pages reference it through `rel="describedby"`. Update this index when projects change; it is not a guaranteed ranking signal and does not replace the sitemap or indexing monitoring in Search Console.

## Navigation and visual references

Area and technology filters combine with search. The URL keeps `area`, `stack` and `q`, including language switches; Clear filters restores the catalog. Need-based shortcuts use the same search. Contact is available in the hero, sticky header and closing section. Animation respects `prefers-reduced-motion`.

Visual references reviewed on October 7, 2026: [David Ho](https://dswho2.github.io/) (identity and contact) and [Adam Lim](https://jung028.github.io/) (specialty categories). Original layout and content, keeping the cream, blue and dark palette.

At `/`, browser language selects Portuguese for `pt` and English for other languages. Manual choice is stored in localStorage; `/?lang=pt` forces Portuguese and `/en/` opens English directly. Query and fragment are preserved. Both HTML pages remain accessible without JavaScript. The theme follows the system on first visit; one button toggles light/dark and saves the choice locally. The language selector shows the displayed version. Career history and education follow the resumes published in `public/cv/`.

[Sagar Gupta](https://sagargupta.online/portfolio-react/) also informed the layered dark surfaces and ambient glow.
