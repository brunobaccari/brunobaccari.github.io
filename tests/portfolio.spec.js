const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

for (const [path, lang, ai, all] of [['/', 'pt-BR', 'IA', 'Todos'], ['/en/', 'en', 'AI', 'All']]) {
  test(`catalog, filters and accessibility: ${lang}`, async ({ page }, testInfo) => {
    await page.goto(path);
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
    await expect(page.locator('.theme-toggle')).toHaveCount(1);
    await expect(page.locator('#language')).toHaveValue(lang === 'en' ? 'en' : 'pt');
    await expect(page.locator('.timeline > li')).toHaveCount(4);
    await expect(page.locator('.timeline h3')).toHaveText(['Mouts TI', 'Blis AI', 'MB Labs', 'BRK Ambiental']);
    const canonical = `https://brunobaccari.github.io${path}`;
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical);
    await expect(page.locator('link[hreflang="pt-BR"]')).toHaveAttribute('href', 'https://brunobaccari.github.io/');
    await expect(page.locator('link[hreflang="en"]')).toHaveAttribute('href', 'https://brunobaccari.github.io/en/');
    await expect(page.locator('link[rel="describedby"]')).toHaveAttribute('href', '/llms.txt');
    const profile = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
    expect(profile).toMatchObject({ '@type': 'ProfilePage', url: canonical, inLanguage: lang,
      mainEntity: { '@type': 'Person', '@id': 'https://brunobaccari.github.io/#bruno-baccari', name: 'Bruno Baccari',
        sameAs: ['https://github.com/brunobaccari', 'https://www.linkedin.com/in/baccari/'] } });
    await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);
    await expect(page.locator('.project-card:visible')).toHaveCount(20);
    await expect(page.locator('.project-card .project-logos')).toHaveCount(20);
    for (const logo of await page.locator('.project-logos img, .feature-logo').all()) {
      await logo.scrollIntoViewIfNeeded();
      await expect.poll(() => logo.evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
      await expect(logo).toHaveAttribute('alt', '');
    }
    await page.locator('#projects').scrollIntoViewIfNeeded();
    await page.screenshot({ path: testInfo.outputPath('frameworks.png'), fullPage: true });
    await page.getByRole('button', { name: ai, exact: true }).click();
    await expect(page.locator('.project-card:visible')).toHaveCount(2);
    await page.getByRole('searchbox').fill('langchain');
    await expect(page.locator('.project-card:visible')).toHaveCount(1);
    await page.getByRole('searchbox').fill('no-matching-project');
    await expect(page.locator('.project-card:visible')).toHaveCount(0);
    await expect(page.locator('#empty')).toBeVisible();
    await page.getByRole('button', { name: all, exact: true }).click();
    await page.getByRole('searchbox').fill('');
    await expect(page.locator('.project-card:visible')).toHaveCount(20);
    await expect(page.locator('#empty')).toBeHidden();
    await page.locator('#framework').selectOption('robotframework');
    await expect(page.locator('.project-card:visible')).toHaveCount(2);
    await page.getByRole('button', { name: 'Mobile', exact: true }).click();
    await expect(page.locator('.project-card:visible')).toHaveCount(1);
    await expect(page.locator('.project-card:visible h3')).toContainText('Appium');
    await page.reload();
    await expect(page.locator('#framework')).toHaveValue('robotframework');
    await expect(page.locator('[data-filter=mobile]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.project-card:visible')).toHaveCount(1);
    await page.locator('#reset-filters').click();
    await expect(page.locator('.project-card:visible')).toHaveCount(20);
    await expect(page.getByRole('searchbox')).toBeFocused();
    await expect(page.locator('#reset-filters')).toBeDisabled();
    await page.getByRole('searchbox').fill('robot framework');
    await expect(page.locator('.project-card:visible')).toHaveCount(2);
    await page.locator('#reset-filters').click();
    await page.locator('.needs a[href="?area=ai#projects"]').click();
    await expect(page.locator('.project-card:visible')).toHaveCount(2);
    await page.locator('#language').selectOption(lang === 'en' ? 'pt' : 'en');
    await expect(page.locator('.project-card:visible')).toHaveCount(2);
    await page.locator('#language').selectOption(lang === 'en' ? 'en' : 'pt');
    await page.locator('#reset-filters').click();
    await page.locator('.nav-contact').click();
    await expect(page.locator('#contact')).toBeInViewport();
    await expect(page.locator('#contact .button')).toHaveAttribute('href', 'https://www.linkedin.com/in/baccari/');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    expect(await page.locator('.board').evaluate(el => getComputedStyle(el).animationName)).toBe('none');
    if (testInfo.project.name === 'mobile') await page.setViewportSize({ width: 320, height: 740 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const audit = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    expect(audit.violations).toEqual([]);
    await page.locator('.theme-toggle').click();
    await expect(page.locator('.theme-toggle')).toHaveAttribute('data-current', 'dark');
    for (const strip of await page.locator('.project-logos').all()) {
      expect(await strip.evaluate(el => getComputedStyle(el).backgroundImage)).toBe('none');
      expect(await strip.evaluate(el => getComputedStyle(el).backgroundColor)).toBe('rgba(0, 0, 0, 0)');
    }
    await page.screenshot({ path: testInfo.outputPath('dark-theme.png'), fullPage: true });
    const darkAudit = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    expect(darkAudit.violations).toEqual([]);
  });
}

test('language navigation, project destinations and agent index', async ({ page, request }) => {
  await page.goto('/');
  await page.locator('#language').selectOption('en');
  await expect(page).toHaveURL(/\/en\/$/);
  await page.locator('#language').selectOption('pt');
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  const links = await page.locator('.project-card .card-links a').evaluateAll(elements => elements.map(e => e.href));
  expect(links).toHaveLength(40);
  for (const link of links) expect(link).toMatch(/^https:\/\/github\.com\/brunobaccari\/[a-zA-Z0-9-]+(?:\/actions)?$/);
  const response = await request.get('/llms.txt');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('text/plain');
  const index = await response.text();
  expect(index).toMatch(/^# Bruno Baccari/);
  for (const link of links.filter(url => !url.endsWith('/actions'))) expect(index).toContain(`](${link})`);
});

test('browser language, manual choice and persistent color themes', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ locale: 'en-US', colorScheme: 'dark', baseURL });
  const page = await context.newPage();
  await page.goto('/?area=mobile#projects');
  await expect(page).toHaveURL(/\/en\/\?area=mobile#projects$/);
  await expect(page.locator('.project-card:visible')).toHaveCount(4);
  expect(await page.locator('html').evaluate(el => getComputedStyle(el).colorScheme)).toBe('dark');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'system');
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(page.locator('.theme-toggle')).toHaveAttribute('data-current', 'light');
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('.theme-toggle')).toHaveAttribute('data-current', 'dark');
  await page.locator('.theme-toggle').click();
  await page.reload();
  await expect(page.locator('.theme-toggle')).toHaveAttribute('data-current', 'light');
  expect(await page.locator('html').evaluate(el => getComputedStyle(el).colorScheme)).toBe('light');
  await page.locator('#language').selectOption('pt');
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  await page.emulateMedia({ colorScheme: 'light' });
  expect(await page.locator('html').evaluate(el => getComputedStyle(el).colorScheme)).toBe('light');
  await page.emulateMedia({ colorScheme: 'dark' });
  expect(await page.locator('html').evaluate(el => getComputedStyle(el).colorScheme)).toBe('light');
  await context.close();
});
