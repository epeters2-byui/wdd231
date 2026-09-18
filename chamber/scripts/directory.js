const url = 'data/members.json';
const membersContainer = document.querySelector('#members');
const menuBtn = document.getElementById('menu');
const nav = document.querySelector('.navigation');

// Footer dates
document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent = document.lastModified;

// Hamburger toggle
menuBtn.addEventListener('click', () => {
  menuBtn.classList.toggle('open');
  nav.classList.toggle('open');
});

// Close menu when link clicked
nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    menuBtn.classList.remove('open');
    nav.classList.remove('open');
  });
});

// Fetch and display members
async function getMembers() {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch members');
    const data = await response.json();
    displayMembers(data);
  } catch (error) {
    console.error('Error loading members:', error);
    membersContainer.innerHTML = '<p>Member data unavailable.</p>';
  }
}

function displayMembers(members) {
  membersContainer.innerHTML = '';

  members.forEach(member => {
    const card = document.createElement('article');
    card.classList.add('member-card');

    const cleanWebsite = member.website.replace(/^https?:\/\//, '');

    card.innerHTML = `
      <img src="images/${member.image}" alt="${member.name} logo" loading="lazy">
      <h3>${member.name}</h3>
      <p>${member.address}</p>
      <p>${member.phone}</p>
      <a href="${member.website}" target="_blank" rel="noopener">${cleanWebsite}</a>
    `;

    membersContainer.appendChild(card);
  });
}

getMembers();