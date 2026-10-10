// discover.js — renders the 8 items of interest and the localStorage visitor message

import { itemsOfInterest } from '../data/discover.mjs';

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

// =================== VISITOR MESSAGE (localStorage) ===================
const visitorMsg = document.getElementById('visitor-message');
const LAST_VISIT_KEY = 'lidi-chamber-lastVisit';
const MS_PER_DAY = 1000 * 60 * 60 * 24;

function showVisitorMessage() {
  const now = Date.now();
  const lastVisit = localStorage.getItem(LAST_VISIT_KEY);

  if (!lastVisit) {
    visitorMsg.textContent = 'Welcome! Let us know if you have any questions.';
  } else {
    const msSinceLast = now - Number(lastVisit);
    const daysSince = Math.floor(msSinceLast / MS_PER_DAY);

    if (msSinceLast < MS_PER_DAY) {
      visitorMsg.textContent = 'Back so soon! Awesome!';
    } else if (daysSince === 1) {
      visitorMsg.textContent = 'You last visited 1 day ago.';
    } else {
      visitorMsg.textContent = `You last visited ${daysSince} days ago.`;
    }
  }

  localStorage.setItem(LAST_VISIT_KEY, now);
}

showVisitorMessage();

// =================== RENDER THE 8 CARDS ===================
const grid = document.getElementById('discover-grid');

function displayItems(items) {
  grid.innerHTML = '';

  items.forEach((item, index) => {
    const card = document.createElement('article');
    card.classList.add('discover-card');
    card.style.gridArea = `card${index + 1}`;

    card.innerHTML = `
      <h2>${item.name}</h2>
      <figure>
        <img src="images/${item.image}" alt="${item.name}" loading="lazy" width="300" height="200">
      </figure>
      <address>${item.address}</address>
      <p>${item.description}</p>
      <button type="button" class="learn-more">Learn More</button>
    `;

    grid.appendChild(card);
  });
}

displayItems(itemsOfInterest);

// =================== LEARN MORE MODAL ===================
const modal = document.getElementById('item-modal');
const modalTitle = document.getElementById('modal-title');
const modalAddress = document.getElementById('modal-address');
const modalDescription = document.getElementById('modal-description');

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('learn-more')) {
    const card = e.target.closest('.discover-card');
    const index = Array.from(grid.children).indexOf(card);
    const item = itemsOfInterest[index];

    modalTitle.textContent = item.name;
    modalAddress.textContent = item.address;
    modalDescription.textContent = item.description;
    modal.showModal();
  }
});

document.querySelectorAll('.modal-close').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('dialog').close();
  });
});