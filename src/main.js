const starterCountries = [];

const recommendations = [
  { name: 'Islandia', code: 'IS', place: 'Kraina ognia i lodu', year: 'POLECANE', image: 'https://images.unsplash.com/photo-1504829857797-ddff29c27927?auto=format&fit=crop&w=900&q=85' },
  { name: 'Grecja', code: 'GR', place: 'Cyklady', year: 'POLECANE', image: 'https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?auto=format&fit=crop&w=900&q=85' },
  { name: 'Maroko', code: 'MA', place: 'Marrakesz', year: 'POLECANE', image: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&w=900&q=85' }
];

const countryCodes = `AF AL DZ AD AO AG AR AM AU AT AZ BS BH BD BB BY BE BZ BJ BT BO BA BW BR BN BG BF BI CV KH CM CA CF TD CL CN CO KM CG CD CR CI HR CU CY CZ DK DJ DM DO EC EG SV GQ ER EE SZ ET FJ FI FR GA GM GE DE GH GR GD GT GN GW GY HT HN HU IS IN ID IR IQ IE IL IT JM JP JO KZ KE KI KP KR KW KG LA LV LB LS LR LY LI LT LU MG MW MY MV ML MT MH MR MU MX FM MD MC MN ME MA MZ MM NA NR NP NL NZ NI NE NG MK NO OM PK PW PS PA PG PY PE PH PL PT QA RO RU RW KN LC VC WS SM ST SA SN RS SC SL SG SK SI SB SO ZA SS ES LK SD SR SE CH SY TJ TZ TH TL TG TO TT TN TR TM TV UG UA AE GB US UY UZ VU VA VE VN YE ZM ZW`.split(' ');
const regionNames = new Intl.DisplayNames(['pl'], { type: 'region' });
const availableCountries = countryCodes.map(code => ({ code, name: regionNames.of(code) })).sort((a, b) => a.name.localeCompare(b.name, 'pl'));
let saved = null;
try {
  saved = JSON.parse(localStorage.getItem('travia-countries') || 'null');
} catch {
  localStorage.removeItem('travia-countries');
}
const visitedCountries = Array.isArray(saved) ? saved : starterCountries;

const $ = selector => document.querySelector(selector);
const grid = $('#countryGrid');
const modal = $('#countryModal');
const form = $('#countryForm');
const toast = $('#toast');
const trigger = $('#countryTrigger');
const menu = $('#countryMenu');
const search = $('#countrySearch');
const options = $('#countryOptions');
const codeInput = $('#countryCode');
let visibleCards = visitedCountries;
let selectedCountry = null;
let worldMap = null;

const escapeHtml = value => String(value).replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
const flagUrl = code => `https://flagsapi.com/${code}/flat/64.png`;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 3000);
}

function updateStats() {
  const unique = new Set(visitedCountries.map(country => country.code)).size;
  $('#countryCount').textContent = unique;
  document.querySelector('.globe-icon + div strong').textContent = `${Math.round(unique / 195 * 100)}%`;
  const thisYear = visitedCountries.filter(country => String(country.year) === String(new Date().getFullYear())).length;
  document.querySelector('.trend').textContent = `+${thisYear} w tym roku`;
  renderMap();
}

function renderMap() {
  const visitedCodes = [...new Set(visitedCountries.map(country => country.code))];
  if (worldMap) {
    worldMap.clearSelectedRegions();
    worldMap.setSelectedRegions(visitedCodes);
    return;
  }
  if (!window.jsVectorMap) {
    $('#worldMap').innerHTML = '<p class="map-error">Nie udało się załadować mapy. Sprawdź połączenie z internetem.</p>';
    return;
  }
  worldMap = new window.jsVectorMap({
    selector: '#worldMap',
    map: 'world',
    backgroundColor: 'transparent',
    zoomButtons: true,
    zoomOnScroll: false,
    selectedRegions: visitedCodes,
    regionStyle: {
      initial: { fill: '#60766c', stroke: '#173f31', strokeWidth: 0.7 },
      hover: { fill: '#8fa399', cursor: 'pointer' },
      selected: { fill: '#d9f34a' },
      selectedHover: { fill: '#e8fa78' }
    },
    onRegionTooltipShow(event, tooltip, code) {
      tooltip.text(`${regionNames.of(code)}${visitedCodes.includes(code) ? ' · odwiedzone' : ' · do odkrycia'}`);
    },
    onRegionClick(event, code) {
      openCountryFromMap(code);
    }
  });
}

function openCountryFromMap(code) {
  const visit = visitedCountries.find(country => country.code === code);
  if (visit) {
    visibleCards = visitedCountries;
    showDetails(visitedCountries.indexOf(visit));
  } else {
    showToast(`${regionNames.of(code)} wciąż czeka na odkrycie`);
  }
}

function renderCards(items = visitedCountries) {
  visibleCards = items;
  if (!items.length) {
    grid.innerHTML = `<div class="empty-collection"><span>＋</span><h3>Twoja mapa czeka na pierwszą podróż</h3><p>Użyj przycisku plus i dodaj pierwszy odwiedzony kraj.</p><button type="button" id="emptyAddButton">Dodaj pierwszy kraj</button></div>`;
    $('#emptyAddButton').addEventListener('click', () => modal.showModal());
    return;
  }
  grid.innerHTML = items.map((country, index) => `
    <article class="country-card" style="--delay:${index * 80}ms" tabindex="0" data-card-index="${index}">
      <img src="${country.image}" alt="${escapeHtml(country.place)}, ${escapeHtml(country.name)}" />
      <div class="card-shade"></div>
      <span class="flag"><img src="${flagUrl(country.code)}" alt="Flaga kraju ${escapeHtml(country.name)}" /></span>
      <div class="card-copy"><span>${escapeHtml(country.year)}</span><h3>${escapeHtml(country.name)}</h3><p>${escapeHtml(country.place)}</p></div>
      <button type="button" aria-label="Zobacz szczegóły: ${escapeHtml(country.name)}">↗</button>
    </article>`).join('');
}

function showDetails(index) {
  const country = visibleCards[index];
  selectedCountry = country;
  $('#detailsImage').src = country.image;
  $('#detailsImage').alt = `${country.place}, ${country.name}`;
  $('#detailsYear').textContent = country.year;
  $('#detailsCountry').textContent = country.name;
  $('#detailsCity').innerHTML = `<img src="${flagUrl(country.code)}" alt="" /> ${escapeHtml(country.place)}`;
  $('#deleteCountry').hidden = !visitedCountries.includes(country);
  $('#detailsModal').showModal();
}

function renderCountryOptions(query = '') {
  const normalized = query.trim().toLocaleLowerCase('pl');
  const matches = availableCountries.filter(country => country.name.toLocaleLowerCase('pl').includes(normalized));
  options.innerHTML = matches.map(country => `<button type="button" role="option" data-code="${country.code}"><img src="${flagUrl(country.code)}" alt=""/><span>${escapeHtml(country.name)}</span></button>`).join('') || '<p class="empty-options">Nie znaleziono kraju</p>';
}

function closePicker() {
  menu.hidden = true;
  trigger.setAttribute('aria-expanded', 'false');
}

trigger.addEventListener('click', () => {
  menu.hidden = !menu.hidden;
  trigger.setAttribute('aria-expanded', String(!menu.hidden));
  if (!menu.hidden) { renderCountryOptions(); search.focus(); }
});
search.addEventListener('input', () => renderCountryOptions(search.value));
options.addEventListener('click', event => {
  const option = event.target.closest('[data-code]');
  if (!option) return;
  const country = availableCountries.find(item => item.code === option.dataset.code);
  codeInput.value = country.code;
  trigger.querySelector('.selected-flag').innerHTML = `<img src="${flagUrl(country.code)}" alt="" />`;
  trigger.querySelector('.selected-country').textContent = country.name;
  closePicker();
});
document.addEventListener('click', event => { if (!event.target.closest('#countryPicker')) closePicker(); });

$('#openModal').addEventListener('click', () => modal.showModal());
document.querySelectorAll('[data-close-country]').forEach(button => button.addEventListener('click', () => modal.close()));
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!codeInput.value) { showToast('Najpierw wybierz kraj z listy'); trigger.focus(); return; }
  const data = new FormData(form);
  const code = codeInput.value;
  const name = regionNames.of(code);
  const city = data.get('city').trim();
  visitedCountries.unshift({ name, code, place: city, year: data.get('year'), image: `https://loremflickr.com/900/700/${encodeURIComponent(city)},${encodeURIComponent(name)},travel/all` });
  localStorage.setItem('travia-countries', JSON.stringify(visitedCountries));
  renderCards(); updateStats(); modal.close(); form.reset(); codeInput.value = '';
  trigger.querySelector('.selected-flag').textContent = '◎';
  trigger.querySelector('.selected-country').textContent = 'Wyszukaj kraj…';
  showToast(`${name} został dodany do Twojej kolekcji ✓`);
});

grid.addEventListener('click', event => { const card = event.target.closest('[data-card-index]'); if (card) showDetails(Number(card.dataset.cardIndex)); });
grid.addEventListener('keydown', event => { if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('[data-card-index]')) showDetails(Number(event.target.dataset.cardIndex)); });
$('#closeDetails').addEventListener('click', () => $('#detailsModal').close());
$('#deleteCountry').addEventListener('click', () => {
  const index = visitedCountries.indexOf(selectedCountry);
  if (index < 0) return;
  const [removed] = visitedCountries.splice(index, 1);
  localStorage.setItem('travia-countries', JSON.stringify(visitedCountries));
  $('#detailsModal').close();
  renderCards();
  updateStats();
  showToast(`${removed.name} usunięto z odwiedzonych`);
});
$('#profileButton').addEventListener('click', () => showToast(`Ola, masz ${new Set(visitedCountries.map(country => country.code)).size} krajów w kolekcji`));
$('#showAllButton').addEventListener('click', () => { document.querySelector('[data-tab="visited"]').click(); showToast('Wyświetlam wszystkie odwiedzone kraje'); });

document.querySelectorAll('[data-tab]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-tab]').forEach(item => item.classList.toggle('active', item === button));
  const recommended = button.dataset.tab === 'recommendations';
  document.querySelector('.content-section .mini-label').textContent = recommended ? 'WYBRANE DLA CIEBIE' : 'KOLEKCJA WSPOMNIEŃ';
  $('.section-heading h2').textContent = recommended ? 'Kierunki warte odkrycia' : 'Twoje ostatnie podróże';
  renderCards(recommended ? recommendations.filter(item => !visitedCountries.some(country => country.code === item.code)) : visitedCountries);
  $('.content-section').scrollIntoView({ behavior: 'smooth' });
}));

renderCards();
updateStats();
