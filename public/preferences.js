(() => {
  const url = new URL(location.href);
  let language;
  let theme;
  try {
    language = localStorage.getItem('portfolio-language');
    theme = localStorage.getItem('portfolio-theme');
    if (url.searchParams.get('lang') === 'pt') {
      language = 'pt';
      localStorage.setItem('portfolio-language', language);
    }
  } catch {}
  document.documentElement.dataset.theme = ['light', 'dark'].includes(theme) ? theme : 'system';
  if (url.pathname === '/' && url.searchParams.get('lang') !== 'pt') {
    const preferred = language || ((navigator.language || '').toLowerCase().startsWith('pt') ? 'pt' : 'en');
    if (preferred === 'en') {
      url.pathname = '/en/';
      location.replace(url);
    }
  }
})();
