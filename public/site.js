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
  const languageLink = document.querySelector('.language');
  const languageUrl = new URL(languageLink.href);
  languageUrl.search = location.search;
  if (languageLink.lang === 'pt-BR') languageUrl.searchParams.set('lang', 'pt');
  else languageUrl.searchParams.delete('lang');
  languageLink.href = languageUrl.href;
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

const themeButtons = [...document.querySelectorAll('[data-theme-choice]')];
function setTheme(value) {
  document.documentElement.dataset.theme = value;
  for (const button of themeButtons) button.setAttribute('aria-pressed', String(button.dataset.themeChoice === value));
}
for (const button of themeButtons) button.addEventListener('click', () => {
  setTheme(button.dataset.themeChoice);
  try { localStorage.setItem('portfolio-theme', button.dataset.themeChoice); } catch {}
});
setTheme(document.documentElement.dataset.theme || 'system');
document.querySelector('.language').addEventListener('click', event => {
  try { localStorage.setItem('portfolio-language', event.currentTarget.lang === 'en' ? 'en' : 'pt'); } catch {}
});
