// home.js — LIDI home page: weather + featured farmers (both use fetch + try/catch)

const myKey = 'bdfa95979671e9db647faf830faa6a15';
const myLat = '6.30';
const myLon = '-10.80';
const myUnits = 'imperial';

const currentUrl  = `https://api.openweathermap.org/data/2.5/weather?lat=${myLat}&lon=${myLon}&units=${myUnits}&appid=${myKey}`;
const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${myLat}&lon=${myLon}&units=${myUnits}&appid=${myKey}`;

// =================== WEATHER ===================
async function getCurrentWeather() {
  try {
    const response = await fetch(currentUrl);
    if (!response.ok) throw new Error('Current weather fetch failed');
    const data = await response.json();
    displayCurrentWeather(data);
  } catch (error) {
    console.error('Weather error:', error);
    const el = document.querySelector('#current-temp');
    if (el) el.textContent = 'Unavailable';
  }
}

function displayCurrentWeather(data) {
  const temp = Math.round(data.main.temp);
  const high = Math.round(data.main.temp_max);
  const low  = Math.round(data.main.temp_min);
  const desc = data.weather[0].description;
  const iconCode = data.weather[0].icon;

  document.querySelector('#current-temp').textContent = `${temp}°F`;
  document.querySelector('#weather-desc').textContent = desc.charAt(0).toUpperCase() + desc.slice(1);
  document.querySelector('#temp-high').textContent = `${high}°F`;
  document.querySelector('#temp-low').textContent  = `${low}°F`;
  document.querySelector('#humidity').textContent = `${data.main.humidity}%`;

  const sunrise = new Date(data.sys.sunrise * 1000);
  const sunset  = new Date(data.sys.sunset * 1000);
  document.querySelector('#sunrise').textContent = sunrise.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  document.querySelector('#sunset').textContent  = sunset.toLocaleTimeString('en-US',  { hour: 'numeric', minute: '2-digit' });

  const icon = document.querySelector('#weather-icon');
  icon.setAttribute('src', `https://openweathermap.org/img/wn/${iconCode}@2x.png`);
  icon.setAttribute('alt', desc);
  document.querySelector('figcaption').textContent = desc;
}

async function getForecast() {
  try {
    const response = await fetch(forecastUrl);
    if (!response.ok) throw new Error('Forecast fetch failed');
    const data = await response.json();
    displayForecast(data);
  } catch (error) {
    console.error('Forecast error:', error);
    const box = document.querySelector('#forecast');
    if (box) box.innerHTML = '<p>Forecast unavailable</p>';
  }
}

function displayForecast(data) {
  const box = document.querySelector('#forecast');
  box.innerHTML = '';

  const daily = {};
  data.list.forEach(item => {
    const date = item.dt_txt.split(' ')[0];
    const hour = item.dt_txt.split(' ')[1];
    if (!daily[date] || hour === '12:00:00') daily[date] = item;
  });

  Object.keys(daily).slice(0, 3).forEach(dateStr => {
    const item = daily[dateStr];
    const label = new Date(item.dt * 1000).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
    const temp = Math.round(item.main.temp);
    const desc = item.weather[0].description;
    const icon = item.weather[0].icon;
    const iconSrc = `https://openweathermap.org/img/wn/${icon}.png`;

    const row = document.createElement('div');
    row.classList.add('forecast-row');
    row.innerHTML = `
      <span class="forecast-day">${label}:</span>
      <img class="forecast-icon" src="${iconSrc}" alt="${desc}" width="40" height="40">
      <span class="forecast-temp">${temp}°F</span>
    `;
    box.appendChild(row);
  });
}

// =================== FEATURED FARMERS (fetch farmers.json) ===================
async function getFeaturedFarmers() {
  try {
    const response = await fetch('data/farmers.json');
    if (!response.ok) throw new Error('Farmers fetch failed');
    const farmers = await response.json();
    displayFeaturedFarmers(farmers);
  } catch (error) {
    console.error('Featured farmers error:', error);
    const c = document.getElementById('featured-farmers');
    if (c) c.innerHTML = '<p>Featured farmers unavailable.</p>';
  }
}

function displayFeaturedFarmers(farmers) {
  const container = document.getElementById('featured-farmers');
  if (!container) return;

  const shuffled = [...farmers].sort(() => 0.5 - Math.random());
  const chosen = shuffled.slice(0, 3);

  container.innerHTML = '';
  chosen.forEach(farmer => {
    const card = document.createElement('article');
    card.classList.add('farmer-card');
    card.innerHTML = `
      <img src="images/farmer-${farmer.id}.webp" alt="Photo of ${farmer.name}" loading="lazy" width="300" height="180">
      <h3>${farmer.name}</h3>
      <p class="region">${farmer.region}</p>
      <p class="crop">${farmer.primaryCrop}</p>
    `;
    container.appendChild(card);
  });
}

// Run only if we're on the home page (elements exist)
if (document.querySelector('#current-temp')) {
  getCurrentWeather();
  getForecast();
}
if (document.getElementById('featured-farmers')) {
  getFeaturedFarmers();
}