const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './tests', retries: 0, workers: 1, forbidOnly: !!process.env.CI,
  use: { baseURL: 'http://127.0.0.1:8771', locale: 'pt-BR', colorScheme: 'light', screenshot: 'only-on-failure', trace: 'retain-on-failure' },
  reporter: [['list'], ['junit', { outputFile: 'test-results/junit.xml' }], ['html', { open: 'never' }]],
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 1000 } } },
    { name: 'mobile', use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
  ],
  webServer: { command: 'python -m http.server 8771 --bind 127.0.0.1 --directory public', url: 'http://127.0.0.1:8771', reuseExistingServer: !process.env.CI },
});
