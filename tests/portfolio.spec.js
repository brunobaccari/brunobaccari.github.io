const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

for (const [path, lang, ai, all] of [['/', 'pt-BR', 'IA', 'Todos'], ['/en/', 'en', 'AI', 'All']]) {
  test(`catalog, filters and accessibility: ${lang}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
    const canonical = `https://brunobaccari.github.io${path}`;
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical);
    await expect(page.locator('link[hreflang="pt-BR"]')).toHaveAttribute('href', 'https://brunobaccari.github.io/');
    await expect(page.locator('link[hreflang="en"]')).toHaveAttribute('href', 'https://brunobaccari.github.io/en/');
    const profile = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
    expect(profile).toMatchObject({ '@type': 'ProfilePage', url: canonical, inLanguage: lang,
      mainEntity: { '@type': 'Person', '@id': 'https://brunobaccari.github.io/#bruno-baccari', name: 'Bruno Baccari',
        sameAs: ['https://github.com/brunobaccari', 'https://www.linkedin.com/in/baccari/'] } });
    await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);
    await expect(page.locator('.project-card:visible')).toHaveCount(19);
    await page.getByRole('button', { name: ai, exact: true }).click();
    await expect(page.locator('.project-card:visible')).toHaveCount(2);
    await page.getByRole('searchbox').fill('langchain');
    await expect(page.locator('.project-card:visible')).toHaveCount(1);
    await page.getByRole('searchbox').fill('no-matching-project');
    await expect(page.locator('.project-card:visible')).toHaveCount(0);
    await expect(page.locator('#empty')).toBeVisible();
    await page.getByRole('button', { name: all, exact: true }).click();
    await page.getByRole('searchbox').fill('');
    await expect(page.locator('.project-card:visible')).toHaveCount(19);
    await expect(page.locator('#empty')).toBeHidden();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const audit = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    expect(audit.violations).toEqual([]);
  });
}

test('language navigation and project destinations', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Read in English' }).click();
  await expect(page).toHaveURL(/\/en\/$/);
  await page.getByRole('link', { name: 'Ler em português' }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  const links = await page.locator('.project-card .card-links a').evaluateAll(elements => elements.map(e => e.href));
  expect(links).toHaveLength(38);
  for (const link of links) expect(link).toMatch(/^https:\/\/github\.com\/brunobaccari\/[a-zA-Z0-9-]+(?:\/actions)?$/);
});
