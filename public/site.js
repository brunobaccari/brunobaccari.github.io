const cards = [...document.querySelectorAll('.project-card')];
const buttons = [...document.querySelectorAll('[data-filter]')];
const search = document.querySelector('#project-search');
const count = document.querySelector('#project-count');
const empty = document.querySelector('#empty');
const framework = document.querySelector('#framework');
const reset = document.querySelector('#reset-filters');
let category = 'all';
const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

function filterProjects(updateUrl = true) {
  const words = normalize(search.value).split(/\s+/).filter(Boolean);
  let visible = 0;
  for (const card of cards) {
    card.hidden = !(category === 'all' || card.dataset.category === category)
      || (framework.value !== 'all' && !card.dataset.frameworks.split(' ').includes(framework.value))
      || !words.every(word => normalize(card.textContent + ' ' + card.dataset.frameworks).includes(word));
    if (!card.hidden) visible++;
  }
  count.textContent = document.documentElement.lang === 'en'
    ? `${visible} of ${cards.length} projects` : `${visible} de ${cards.length} projetos`;
  empty.hidden = visible > 0;
  reset.disabled = category === 'all' && framework.value === 'all' && !search.value;
  for (const button of buttons) button.setAttribute('aria-pressed', String(button.dataset.filter === category));
  if (updateUrl) {
    const url = new URL(location.href);
    for (const [key, value] of [['area', category], ['stack', framework.value], ['q', search.value.trim()]]) {
      if (value && value !== 'all') url.searchParams.set(key, value);
      else url.searchParams.delete(key);
    }
    history.replaceState(null, '', url);
  }
}
for (const button of buttons) {
  button.addEventListener('click', () => {
    category = button.dataset.filter;
    filterProjects();
  });
}
search.addEventListener('input', () => filterProjects());
framework.addEventListener('change', () => filterProjects());
reset.addEventListener('click', () => {
  category = 'all';
  search.value = '';
  framework.value = 'all';
  filterProjects();
  search.focus();
});
function restoreFilters() {
  const params = new URLSearchParams(location.search);
  category = buttons.some(button => button.dataset.filter === params.get('area')) ? params.get('area') : 'all';
  framework.value = [...framework.options].some(option => option.value === params.get('stack')) ? params.get('stack') : 'all';
  search.value = params.get('q') || '';
  filterProjects(false);
}
window.addEventListener('popstate', restoreFilters);
restoreFilters();

const themeButton = document.querySelector('.theme-toggle');
const systemTheme = matchMedia('(prefers-color-scheme: dark)');
const english = document.documentElement.lang === 'en';
function updateThemeButton() {
  const preference = document.documentElement.dataset.theme;
  const dark = preference === 'dark' || (preference === 'system' && systemTheme.matches);
  themeButton.dataset.current = dark ? 'dark' : 'light';
  const label = english ? (dark ? 'Switch to light theme' : 'Switch to dark theme') : (dark ? 'Ativar tema claro' : 'Ativar tema escuro');
  themeButton.setAttribute('aria-label', label);
  themeButton.title = label;
}
themeButton.addEventListener('click', () => {
  const value = themeButton.dataset.current === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = value;
  updateThemeButton();
  try { localStorage.setItem('portfolio-theme', value); } catch {}
});
systemTheme.addEventListener('change', updateThemeButton);
updateThemeButton();
const languageControl = document.querySelector('#language');
languageControl.value = english ? 'en' : 'pt';
languageControl.addEventListener('change', () => {
  const language = languageControl.value;
  try { localStorage.setItem('portfolio-language', language); } catch {}
  const url = new URL(location.href);
  url.pathname = language === 'pt' ? '/' : '/en/';
  if (language === 'pt') url.searchParams.set('lang', 'pt');
  else url.searchParams.delete('lang');
  location.assign(url);
});
