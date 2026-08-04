const visitedCountries = [
  { name: 'Włochy', code: 'IT', place: 'Toskania', year: '2025', image: 'https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=900&q=85' },
  { name: 'Japonia', code: 'JP', place: 'Kioto', year: '2024', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=85' },
  { name: 'Portugalia', code: 'PT', place: 'Lizbona', year: '2024', image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=900&q=85' }
];

// Kody 195 państw uznawanych przez ONZ. Select nie pozwala dodać fikcyjnej nazwy.
const countryCodes = `AF AL DZ AD AO AG AR AM AU AT AZ BS BH BD BB BY BE BZ BJ BT BO BA BW BR BN BG BF BI CV KH CM CA CF TD CL CN CO KM CG CD CR CI HR CU CY CZ DK DJ DM DO EC EG SV GQ ER EE SZ ET FJ FI FR GA GM GE DE GH GR GD GT GN GW GY HT HN HU IS IN ID IR IQ IE IL IT JM JP JO KZ KE KI KP KR KW KG LA LV LB LS LR LY LI LT LU MG MW MY MV ML MT MH MR MU MX FM MD MC MN ME MA MZ MM NA NR NP NL NZ NI NE NG MK NO OM PK PW PS PA PG PY PE PH PL PT QA RO RU RW KN LC VC WS SM ST SA SN RS SC SL SG SK SI SB SO ZA SS ES LK SD SR SE CH SY TJ TZ TH TL TG TO TT TN TR TM TV UG UA AE GB US UY UZ VU VA VE VN YE ZM ZW`.split(' ');
const regionNames = new Intl.DisplayNames(['pl'], { type: 'region' });
const grid = document.querySelector('#countryGrid');
const modal = document.querySelector('#countryModal');
const form = document.querySelector('#countryForm');
const toast = document.querySelector('#toast');
const countrySelect = document.querySelector('#countrySelect');

countryCodes
  .map(code => ({ code, name: regionNames.of(code) }))
  .sort((a, b) => a.name.localeCompare(b.name, 'pl'))
  .forEach(({ code, name }) => countrySelect.add(new Option(name, code)));

const escapeHtml = value => String(value).replace(/[&<>'"]/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
})[character]);
const flagUrl = code => `https://flagsapi.com/${code}/flat/64.png`;

function renderCards(items = visitedCountries) {
  grid.innerHTML = items.map((country, index) => `
    <article class="country-card" style="--delay:${index * 80}ms">
      <img src="${country.image}" alt="${escapeHtml(country.place)}, ${escapeHtml(country.name)}" />
      <div class="card-shade"></div>
      <span class="flag"><img src="${flagUrl(country.code)}" alt="Flaga kraju ${escapeHtml(country.name)}" /></span>
      <div class="card-copy"><span>${escapeHtml(country.year)}</span><h3>${escapeHtml(country.name)}</h3><p>${escapeHtml(country.place)}</p></div>
      <button aria-label="Zobacz wspomnienia z kraju ${escapeHtml(country.name)}">↗</button>
    </article>`).join('');
}

renderCards();

document.querySelector('#openModal').addEventListener('click', () => modal.showModal());
form.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(form);
  const code = data.get('countryCode');
  const name = regionNames.of(code);
  const city = data.get('city').trim();
  const photoTags = `${encodeURIComponent(city)},${encodeURIComponent(name)},travel`;

  visitedCountries.unshift({
    name,
    code,
    place: city,
    year: data.get('year'),
    image: `https://loremflickr.com/900/700/${photoTags}/all`
  });
  renderCards();
  document.querySelector('#countryCount').textContent = 12 + (visitedCountries.length - 3);
  modal.close();
  form.reset();
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
});

document.querySelectorAll('[data-tab]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-tab]').forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  const recommendations = button.dataset.tab === 'recommendations';
  document.querySelector('.content-section .mini-label').textContent = recommendations ? 'WYBRANE DLA CIEBIE' : 'KOLEKCJA WSPOMNIEŃ';
  document.querySelector('.section-heading h2').textContent = recommendations ? 'Kierunki warte odkrycia' : 'Twoje ostatnie podróże';
  if (recommendations) {
    renderCards([
      { name: 'Islandia', code: 'IS', place: 'Kraina ognia i lodu', year: 'TOP 1', image: 'https://images.unsplash.com/photo-1504829857797-ddff29c27927?auto=format&fit=crop&w=900&q=85' },
      { name: 'Grecja', code: 'GR', place: 'Cyklady', year: 'TOP 2', image: 'https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?auto=format&fit=crop&w=900&q=85' },
      { name: 'Maroko', code: 'MA', place: 'Marrakesz', year: 'TOP 3', image: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&w=900&q=85' }
    ]);
  } else {
    renderCards();
  }
  document.querySelector('.content-section').scrollIntoView({ behavior: 'smooth' });
}));
