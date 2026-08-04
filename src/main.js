const starterCountries = [];

const recommendations = [
  { name: 'Islandia', code: 'IS', place: 'Kraina ognia i lodu', recommended: true, image: 'https://images.unsplash.com/photo-1504829857797-ddff29c27927?auto=format&fit=crop&w=900&q=85' },
  { name: 'Grecja', code: 'GR', place: 'Cyklady', recommended: true, image: 'https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?auto=format&fit=crop&w=900&q=85' },
  { name: 'Maroko', code: 'MA', place: 'Marrakesz', recommended: true, image: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&w=900&q=85' }
];

const countryCodes = `AF AL DZ AD AO AG AR AM AU AT AZ BS BH BD BB BY BE BZ BJ BT BO BA BW BR BN BG BF BI CV KH CM CA CF TD CL CN CO KM CG CD CR CI HR CU CY CZ DK DJ DM DO EC EG SV GQ ER EE SZ ET FJ FI FR GA GM GE DE GH GR GD GT GN GW GY HT HN HU IS IN ID IR IQ IE IL IT JM JP JO KZ KE KI KP KR KW KG LA LV LB LS LR LY LI LT LU MG MW MY MV ML MT MH MR MU MX FM MD MC MN ME MA MZ MM NA NR NP NL NZ NI NE NG MK NO OM PK PW PS PA PG PY PE PH PL PT QA RO RU RW KN LC VC WS SM ST SA SN RS SC SL SG SK SI SB SO ZA SS ES LK SD SR SE CH SY TJ TZ TH TL TG TO TT TN TR TM TV UG UA AE GB US UY UZ VU VA VE VN YE ZM ZW`.split(' ');
const localCities = {
  PL: ['Warszawa', 'Kraków', 'Gdańsk', 'Wrocław', 'Poznań', 'Łódź', 'Szczecin', 'Katowice', 'Lublin', 'Toruń'],
  BR: ['Brasília', 'São Paulo', 'Rio de Janeiro', 'Salvador', 'Fortaleza', 'Recife', 'Manaus', 'Curitiba'],
  PT: ['Lizbona', 'Porto', 'Braga', 'Coimbra', 'Faro'], IT: ['Rzym', 'Mediolan', 'Wenecja', 'Florencja', 'Neapol', 'Bolonia'],
  ES: ['Madryt', 'Barcelona', 'Walencja', 'Sewilla', 'Malaga'], FR: ['Paryż', 'Lyon', 'Marsylia', 'Nicea', 'Bordeaux'],
  DE: ['Berlin', 'Monachium', 'Hamburg', 'Kolonia', 'Frankfurt nad Menem'], GB: ['Londyn', 'Edynburg', 'Manchester', 'Liverpool', 'Bristol'],
  US: ['Nowy Jork', 'Los Angeles', 'Chicago', 'San Francisco', 'Miami', 'Boston', 'Seattle'], CA: ['Toronto', 'Vancouver', 'Montreal', 'Ottawa', 'Calgary'],
  JP: ['Tokio', 'Kioto', 'Osaka', 'Nara', 'Sapporo', 'Hiroshima'], GR: ['Ateny', 'Saloniki', 'Heraklion', 'Chania', 'Rodos'],
  IS: ['Reykjavík', 'Akureyri', 'Vík', 'Húsavík'], MA: ['Marrakesz', 'Casablanca', 'Fez', 'Rabat', 'Agadir'],
  CZ: ['Praga', 'Brno', 'Ostrawa'], AT: ['Wiedeń', 'Salzburg', 'Innsbruck', 'Graz'], HR: ['Zagrzeb', 'Split', 'Dubrownik', 'Zadar'],
  TR: ['Stambuł', 'Ankara', 'Antalya', 'Izmir'], EG: ['Kair', 'Aleksandria', 'Luksor', 'Asuan'], TH: ['Bangkok', 'Chiang Mai', 'Phuket', 'Pattaya'],
  VN: ['Hanoi', 'Ho Chi Minh', 'Đà Nẵng', 'Hội An'], AU: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'],
  NZ: ['Auckland', 'Wellington', 'Christchurch', 'Queenstown'], MX: ['Meksyk', 'Cancún', 'Guadalajara', 'Oaxaca'],
  AR: ['Buenos Aires', 'Córdoba', 'Mendoza', 'Ushuaia'], CL: ['Santiago', 'Valparaíso', 'Punta Arenas'], PE: ['Lima', 'Cusco', 'Arequipa'],
  NO: ['Oslo', 'Bergen', 'Tromsø', 'Stavanger'], SE: ['Sztokholm', 'Göteborg', 'Malmö'], FI: ['Helsinki', 'Turku', 'Tampere'],
  DK: ['Kopenhaga', 'Aarhus', 'Odense'], NL: ['Amsterdam', 'Rotterdam', 'Haga', 'Utrecht'], BE: ['Bruksela', 'Antwerpia', 'Gandawa'],
  IE: ['Dublin', 'Cork', 'Galway'], CH: ['Zurych', 'Genewa', 'Berno', 'Lucerna'], IN: ['Delhi', 'Mumbaj', 'Agra', 'Jaipur', 'Bengaluru'],
  ID: ['Dżakarta', 'Ubud', 'Denpasar', 'Yogyakarta'], KR: ['Seul', 'Busan', 'Incheon'], SG: ['Singapur'], AE: ['Dubaj', 'Abu Zabi'],
  ZA: ['Kapsztad', 'Johannesburg', 'Durban', 'Pretoria'], KE: ['Nairobi', 'Mombasa'], TZ: ['Dodoma', 'Dar es Salaam', 'Arusza']
};
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
const cityInput = $('#cityInput');
const cityHint = $('#cityHint');
const citySuggestions = $('#citySuggestions');
let visibleCards = visitedCountries;
let worldMap = null;
let verifiedCity = null;

const escapeHtml = value => String(value).replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
const flagUrl = code => `https://flagsapi.com/${code}/flat/64.png`;
const currentMonth = new Date().toISOString().slice(0, 7);
const monthNames = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
$('#tripMonth').innerHTML = monthNames.map((month, index) => `<option value="${String(index + 1).padStart(2, '0')}">${month}</option>`).join('');
$('#tripYear').innerHTML = Array.from({ length: 16 }, (_, index) => new Date().getFullYear() - 5 + index).map(year => `<option value="${year}">${year}</option>`).join('');
$('#tripMonth').value = currentMonth.slice(5);
$('#tripYear').value = currentMonth.slice(0, 4);
const syncTripDate = () => { $('#tripDate').value = `${$('#tripYear').value}-${$('#tripMonth').value}`; };
$('#tripMonth').addEventListener('change', syncTripDate);
$('#tripYear').addEventListener('change', syncTripDate);
syncTripDate();

const getTripMonth = trip => trip.date || `${trip.year || new Date().getFullYear()}-01`;
const isCompleted = trip => getTripMonth(trip) <= currentMonth;
const formatMonth = trip => new Intl.DateTimeFormat('pl', { month: 'long', year: 'numeric' }).format(new Date(`${getTripMonth(trip)}-02T12:00:00`));

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 3000);
}

function updateStats() {
  const completedTrips = visitedCountries.filter(isCompleted);
  const unique = new Set(completedTrips.map(country => country.code)).size;
  $('#countryCount').textContent = unique;
  document.querySelector('.globe-icon + div strong').textContent = `${Math.round(unique / 195 * 100)}%`;
  const year = String(new Date().getFullYear());
  const thisYear = new Set(completedTrips.filter(country => getTripMonth(country).startsWith(year)).map(country => country.code)).size;
  document.querySelector('.trend').textContent = `+${thisYear} krajów w tym roku`;
  const nextTrip = visitedCountries.filter(country => !isCompleted(country)).sort((a, b) => getTripMonth(a).localeCompare(getTripMonth(b)))[0];
  $('#nextTripCountry').textContent = nextTrip?.name || 'Brak planów';
  $('#nextTripDate').textContent = nextTrip ? formatMonth(nextTrip) : 'Dodaj przyszłą podróż';
  renderMap();
}

function renderMap() {
  const visitedCodes = [...new Set(visitedCountries.filter(isCompleted).map(country => country.code))];
  if (worldMap) {
    worldMap.clearSelectedRegions();
    worldMap.setSelectedRegions(visitedCodes);
    return;
  }
  if (!window.jsVectorMap) {
    $('#worldMap').classList.add('fallback-active');
    return;
  }
  $('#worldMap').classList.add('vector-active');
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
      const discovered = visitedCountries.some(country => country.code === code && isCompleted(country));
      tooltip.text(`${regionNames.of(code)}${discovered ? ' · odwiedzone' : ' · do odkrycia'}`);
    },
    onRegionClick(event, code) {
      openCountryFromMap(code);
    }
  });
}

function openCountryFromMap(code) {
  const trips = visitedCountries.filter(country => country.code === code);
  if (trips.length) {
    visibleCards = visitedCountries;
    showCountryDetails(code);
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
      <div class="card-copy"><span>${country.recommended ? 'POLECANE DLA CIEBIE' : `${isCompleted(country) ? 'ODWIEDZONE' : 'ZAPLANOWANE'} · ${escapeHtml(formatMonth(country))}`}</span><h3>${escapeHtml(country.name)}</h3><p>${escapeHtml(country.place)}</p></div>
      <button type="button" aria-label="Zobacz szczegóły: ${escapeHtml(country.name)}">↗</button>
    </article>`).join('');
}

function showDetails(index) {
  const country = visibleCards[index];
  if (country.recommended) {
    $('#detailsImage').src = country.image;
    $('#detailsImage').alt = `${country.place}, ${country.name}`;
    $('#detailsYear').textContent = 'REKOMENDACJA';
    $('#detailsCountry').textContent = country.name;
    $('#detailsCity').innerHTML = `<img src="${flagUrl(country.code)}" alt="" /> ${escapeHtml(country.place)}`;
    $('#countryTrips').innerHTML = '';
    $('#detailsModal').showModal();
    return;
  }
  showCountryDetails(country.code, country);
}

function showCountryDetails(code, featuredTrip) {
  const trips = visitedCountries.filter(country => country.code === code).sort((a, b) => getTripMonth(b).localeCompare(getTripMonth(a)));
  const country = featuredTrip || trips[0];
  $('#detailsImage').src = country.image;
  $('#detailsImage').alt = `${country.place}, ${country.name}`;
  $('#detailsYear').textContent = `${trips.length} ${trips.length === 1 ? 'podróż' : 'podróże'}`;
  $('#detailsCountry').textContent = country.name;
  $('#detailsCity').innerHTML = `<img src="${flagUrl(country.code)}" alt="" /> Wszystkie zapisane miasta`;
  $('#countryTrips').innerHTML = trips.map(trip => {
    const index = visitedCountries.indexOf(trip);
    return `<div class="trip-row"><div><strong>${escapeHtml(trip.place)}</strong><span>${isCompleted(trip) ? 'Odbyta' : 'Planowana'} · ${escapeHtml(formatMonth(trip))}</span></div><button type="button" data-delete-trip="${index}" aria-label="Usuń podróż do miasta ${escapeHtml(trip.place)}">Usuń</button></div>`;
  }).join('');
  $('#detailsModal').showModal();
}

async function verifyCity(city, countryCode) {
  if (verifiedCity && verifiedCity.toLocaleLowerCase('pl') === city.toLocaleLowerCase('pl')) return verifiedCity;
  const localMatch = (localCities[countryCode] || []).find(item => item.toLocaleLowerCase('pl') === city.toLocaleLowerCase('pl'));
  if (localMatch) return localMatch;
  cityHint.textContent = 'Sprawdzam miasto…';
  cityHint.className = 'field-hint checking';
  const params = new URLSearchParams({ city, countrycodes: countryCode.toLowerCase(), format: 'json', addressdetails: '1', limit: '1', 'accept-language': 'pl' });
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`);
    if (!response.ok) throw new Error('city lookup failed');
    const [result] = await response.json();
    if (!result) {
      cityHint.textContent = 'Nie znaleźliśmy takiego miasta w wybranym kraju.';
      cityHint.className = 'field-hint error';
      return null;
    }
    const address = result.address || {};
    const canonicalName = address.city || address.town || address.village || address.municipality || city;
    cityHint.textContent = `Znaleziono: ${canonicalName}`;
    cityHint.className = 'field-hint success';
    return canonicalName;
  } catch {
    cityHint.textContent = 'Nie udało się sprawdzić miasta. Spróbuj ponownie.';
    cityHint.className = 'field-hint error';
    return null;
  }
}

function showCitySuggestions(cities) {
  const unique = [...new Set(cities)].slice(0, 8);
  citySuggestions.innerHTML = unique.map(city => `<button type="button" data-city="${escapeHtml(city)}">${escapeHtml(city)}</button>`).join('');
  citySuggestions.hidden = !unique.length;
}

async function searchCities(query) {
  const code = codeInput.value;
  if (!code) {
    cityHint.textContent = 'Najpierw wybierz kraj.';
    cityHint.className = 'field-hint error';
    showCitySuggestions([]);
    return;
  }
  const normalized = query.trim().toLocaleLowerCase('pl');
  const localMatches = (localCities[code] || []).filter(city => city.toLocaleLowerCase('pl').includes(normalized));
  showCitySuggestions(localMatches);
  if (query.trim().length < 2) return;
  const params = new URLSearchParams({ city: query.trim(), countrycodes: code.toLowerCase(), format: 'json', addressdetails: '1', limit: '8', 'accept-language': 'pl' });
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`);
    if (!response.ok) return;
    const results = await response.json();
    const remoteMatches = results.map(result => {
      const address = result.address || {};
      return address.city || address.town || address.village || address.municipality;
    }).filter(Boolean);
    showCitySuggestions([...localMatches, ...remoteMatches]);
  } catch {
    // Lokalne podpowiedzi pozostają dostępne bez połączenia z API.
  }
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
  cityInput.value = '';
  verifiedCity = null;
  showCitySuggestions(localCities[country.code] || []);
  cityHint.textContent = 'Wybierz miasto z podpowiedzi.';
  cityHint.className = 'field-hint';
  closePicker();
});
cityInput.addEventListener('input', () => {
  verifiedCity = null;
  window.clearTimeout(searchCities.timer);
  searchCities.timer = window.setTimeout(() => searchCities(cityInput.value), 300);
});
cityInput.addEventListener('focus', () => searchCities(cityInput.value));
citySuggestions.addEventListener('click', event => {
  const button = event.target.closest('[data-city]');
  if (!button) return;
  verifiedCity = button.dataset.city;
  cityInput.value = verifiedCity;
  citySuggestions.hidden = true;
  cityHint.textContent = `Wybrano: ${verifiedCity}`;
  cityHint.className = 'field-hint success';
});
document.addEventListener('click', event => { if (!event.target.closest('#countryPicker')) closePicker(); });

$('#openModal').addEventListener('click', () => modal.showModal());
document.querySelectorAll('[data-close-country]').forEach(button => button.addEventListener('click', () => modal.close()));
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (!codeInput.value) { showToast('Najpierw wybierz kraj z listy'); trigger.focus(); return; }
  const data = new FormData(form);
  const code = codeInput.value;
  const name = regionNames.of(code);
  const city = await verifyCity(data.get('city').trim(), code);
  if (!city) { cityInput.focus(); return; }
  const date = data.get('date');
  visitedCountries.unshift({ name, code, place: city, date, year: date.slice(0, 4), image: `https://loremflickr.com/900/700/${encodeURIComponent(city)},${encodeURIComponent(name)},travel/all` });
  localStorage.setItem('travia-countries', JSON.stringify(visitedCountries));
  renderCards(); updateStats(); modal.close(); form.reset(); codeInput.value = '';
  trigger.querySelector('.selected-flag').textContent = '◎';
  trigger.querySelector('.selected-country').textContent = 'Wyszukaj kraj…';
  $('#tripMonth').value = currentMonth.slice(5);
  $('#tripYear').value = currentMonth.slice(0, 4);
  syncTripDate();
  verifiedCity = null;
  cityHint.textContent = 'Sprawdzimy, czy miasto znajduje się w wybranym kraju.';
  cityHint.className = 'field-hint';
  showToast(`${name} · ${city} zapisano w kolekcji ✓`);
});

grid.addEventListener('click', event => { const card = event.target.closest('[data-card-index]'); if (card) showDetails(Number(card.dataset.cardIndex)); });
grid.addEventListener('keydown', event => { if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('[data-card-index]')) showDetails(Number(event.target.dataset.cardIndex)); });
$('#closeDetails').addEventListener('click', () => $('#detailsModal').close());
$('#countryTrips').addEventListener('click', event => {
  const button = event.target.closest('[data-delete-trip]');
  if (!button) return;
  const [removed] = visitedCountries.splice(Number(button.dataset.deleteTrip), 1);
  localStorage.setItem('travia-countries', JSON.stringify(visitedCountries));
  $('#detailsModal').close();
  renderCards();
  updateStats();
  showToast(`${removed.name} · ${removed.place} usunięto z kolekcji`);
});
$('#profileButton').addEventListener('click', () => showToast(`Ola, masz ${new Set(visitedCountries.filter(isCompleted).map(country => country.code)).size} odwiedzonych krajów`));
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
