const countries = [
  { name: 'Włochy', place: 'Toskania', year: '2025', flag: '🇮🇹', image: 'https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=900&q=85' },
  { name: 'Japonia', place: 'Kioto', year: '2024', flag: '🇯🇵', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=85' },
  { name: 'Portugalia', place: 'Lizbona', year: '2024', flag: '🇵🇹', image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=900&q=85' }
];

const grid = document.querySelector('#countryGrid');
const modal = document.querySelector('#countryModal');
const form = document.querySelector('#countryForm');
const toast = document.querySelector('#toast');

function renderCards(items = countries) {
  grid.innerHTML = items.map((country, index) => `
    <article class="country-card" style="--delay:${index * 80}ms">
      <img src="${country.image}" alt="${country.place}, ${country.name}" />
      <div class="card-shade"></div><span class="flag">${country.flag}</span>
      <div class="card-copy"><span>${country.year}</span><h3>${country.name}</h3><p>${country.place}</p></div>
      <button aria-label="Zobacz wspomnienia z kraju ${country.name}">↗</button>
    </article>`).join('');
}

renderCards();

document.querySelector('#openModal').addEventListener('click', () => modal.showModal());
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  countries.unshift({ name: data.get('country'), place: 'Nowe wspomnienie', year: data.get('year'), flag: '✦', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=85' });
  renderCards();
  document.querySelector('#countryCount').textContent = 12 + (countries.length - 3);
  modal.close(); form.reset();
  toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 3000);
});

document.querySelectorAll('[data-tab]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-tab]').forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  const recommendations = button.dataset.tab === 'recommendations';
  document.querySelector('.mini-label').textContent = recommendations ? 'WYBRANE DLA CIEBIE' : 'KOLEKCJA WSPOMNIEŃ';
  document.querySelector('.section-heading h2').textContent = recommendations ? 'Kierunki warte odkrycia' : 'Twoje ostatnie podróże';
  if (recommendations) {
    renderCards([
      { name: 'Islandia', place: 'Kraina ognia i lodu', year: 'TOP 1', flag: '🇮🇸', image: 'https://images.unsplash.com/photo-1504829857797-ddff29c27927?auto=format&fit=crop&w=900&q=85' },
      { name: 'Grecja', place: 'Cyklady', year: 'TOP 2', flag: '🇬🇷', image: 'https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?auto=format&fit=crop&w=900&q=85' },
      { name: 'Maroko', place: 'Marrakesz', year: 'TOP 3', flag: '🇲🇦', image: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&w=900&q=85' }
    ]);
  } else renderCards();
  document.querySelector('.content-section').scrollIntoView({ behavior: 'smooth' });
}));
