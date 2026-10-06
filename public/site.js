const cards = [...document.querySelectorAll('.project-card')];
const buttons = [...document.querySelectorAll('[data-filter]')];
const search = document.querySelector('#project-search');
const count = document.querySelector('#project-count');
const empty = document.querySelector('#empty');
let category = 'all';
const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

function filterProjects() {
  const query = normalize(search.value);
  let visible = 0;
  for (const card of cards) {
    card.hidden = !(category === 'all' || card.dataset.category === category)
      || !normalize(card.textContent).includes(query);
    if (!card.hidden) visible++;
  }
  count.textContent = document.documentElement.lang === 'en'
    ? `${visible} of ${cards.length} projects` : `${visible} de ${cards.length} projetos`;
  empty.hidden = visible > 0;
}
for (const button of buttons) {
  button.addEventListener('click', () => {
    category = button.dataset.filter;
    for (const other of buttons) other.setAttribute('aria-pressed', String(other === button));
    filterProjects();
  });
}
search.addEventListener('input', filterProjects);
filterProjects();
