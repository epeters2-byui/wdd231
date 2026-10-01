// home.js - Chamber Home Page (weather + spotlights)

// =================== FOOTER DATES ===================
document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent = document.lastModified;

// =================== HAMBURGER MENU ===================
const menuBtn = document.getElementById('menu');
const nav = document.querySelector('.navigation');

if (menuBtn && nav) {
  menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('open');
    nav.classList.toggle('open');
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuBtn.classList.remove('open');
      nav.classList.remove('open');
    });
  });
}

// =================== WEATHER ===================
const myKey = '64678828079c521a90c8d6268b97ed30';
const myLat = '6.30';
const myLon = '-10.80';
const myUnits = '';

const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${myLat}&lon=${myLon}&units=${myUnits}&appid=${myKey}`;
const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${myLat}&lon=${myLon}&units=${myUnits}&appid=${myKey}`;

const currentTemp = document.querySelector('#current-temp');
const weatherDesc = document.querySelector('#weather-desc');
const weatherIcon = document.querySelector('#weather-icon');
const captionDesc = document.querySelector('figcaption');
const forecastBox = document.querySelector('#forecast');

async function getCurrentWeather() {
  try {
    const response = await fetch(currentUrl);
    if (!response.ok) throw new Error('Current weather fetch failed');
    const data = await response.json();
    displayCurrentWeather(data);
  } catch (error) {
    console.error('Weather error:', error);
    if (currentTemp) currentTemp.textContent = '—';
    if (weatherDesc) weatherDesc.textContent = 'Unavailable';
  }
}

function displayCurrentWeather(data) {
  const temp = Math.round(data.main.temp);
  const desc = data.weather[0].description;
  const iconCode = data.weather[0].icon;
  const iconSrc = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  currentTemp.textContent = `${temp}°F`;
  weatherDesc.textContent = desc.charAt(0).toUpperCase() + desc.slice(1);
  weatherIcon.setAttribute('src', iconSrc);
  weatherIcon.setAttribute('alt', desc);
  captionDesc.textContent = desc;
}

async function getForecast() {
  try {
    const response = await fetch(forecastUrl);
    if (!response.ok) throw new Error('Forecast fetch failed');
    const data = await response.json();
    displayForecast(data);
  } catch (error) {
    console.error('Forecast error:', error);
    if (forecastBox) forecastBox.innerHTML = '<p>Forecast unavailable</p>';
  }
}

function displayForecast(data) {
  forecastBox.innerHTML = '';

  // Group entries by date — pick one entry per day (preferring noon)
  const daily = {};
  data.list.forEach(item => {
    const date = item.dt_txt.split(' ')[0];
    const hour = item.dt_txt.split(' ')[1];
    if (!daily[date] || hour === '12:00:00') {
      daily[date] = item;
    }
  });

  // Take the first 3 dates starting from today
  const days = Object.keys(daily).slice(0, 3);

  days.forEach(dateStr => {
    const item = daily[dateStr];
    const dateObj = new Date(item.dt * 1000);
    const label = dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
    const temp = Math.round(item.main.temp);
    const desc = item.weather[0].description;
    const icon = item.weather[0].icon;

    const card = document.createElement('div');
    card.classList.add('forecast-card');
    card.innerHTML = `
      <p class="forecast-day">${label}</p>
      <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${desc}" width="50" height="50">
      <p class="forecast-temp">${temp}°F</p>
      <p class="forecast-desc">${desc}</p>
    `;
    forecastBox.appendChild(card);
  });
}

getCurrentWeather();
getForecast();

// =================== SPOTLIGHTS ===================
const membersUrl = 'data/members.json';
const spotlightContainer = document.querySelector('#spotlight-container');

async function getSpotlights() {
  try {
    const response = await fetch(membersUrl);
    if (!response.ok) throw new Error('Members fetch failed');
    const members = await response.json();

    // Only Gold (3) or Silver (2)
    const qualified = members.filter(m => m.membership === 2 || m.membership === 3);

    // Shuffle
    const shuffled = qualified.sort(() => 0.5 - Math.random());

    // Random 2 or 3
    const count = Math.floor(Math.random() * 2) + 2;
    const chosen = shuffled.slice(0, count);

    displaySpotlights(chosen);
  } catch (error) {
    console.error('Spotlight error:', error);
    if (spotlightContainer) spotlightContainer.innerHTML = '<p>Spotlights unavailable</p>';
  }
}

function displaySpotlights(members) {
  spotlightContainer.innerHTML = '';

  members.forEach(member => {
    let levelLabel = 'Member';
    if (member.membership === 3) levelLabel = 'Gold';
    else if (member.membership === 2) levelLabel = 'Silver';

    const cleanWebsite = member.website.replace(/^https?:\/\//, '');

    const card = document.createElement('article');
    card.classList.add('spotlight-card');
    card.innerHTML = `
      <img src="images/${member.image}" alt="${member.name} logo" loading="lazy" width="100" height="100">
      <h3>${member.name}</h3>
      <p>${member.address}</p>
      <p>${member.phone}</p>
      <p><a href="${member.website}" target="_blank" rel="noopener">${cleanWebsite}</a></p>
      <span class="membership level-${member.membership}">${levelLabel}</span>
    `;
    spotlightContainer.appendChild(card);
  });
}

getSpotlights();