// join.js — handles footer dates, hamburger menu, modals, and form timestamp

// =================== FOOTER DATES ===================
const yearEl = document.getElementById('year');
const lastModEl = document.getElementById('lastModified');
if (yearEl) yearEl.textContent = new Date().getFullYear();
if (lastModEl) lastModEl.textContent = document.lastModified;

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

// =================== HIDDEN TIMESTAMP ===================
const timestampField = document.getElementById('timestamp');
if (timestampField) {
  timestampField.value = new Date().toLocaleString();
}

// =================== MODALS ===================
document.querySelectorAll('[data-modal]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const modalId = link.getAttribute('data-modal');
    const modal = document.getElementById(modalId);
    if (modal) modal.showModal();
  });
});

document.querySelectorAll('.modal-close').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('dialog').close();
  });
});

// =================== THANK YOU PAGE ===================
const submittedList = document.getElementById('submitted-info');
if (submittedList) {
  const params = new URLSearchParams(window.location.search);
  const fields = [
    { key: 'fname', label: 'First Name' },
    { key: 'lname', label: 'Last Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Mobile Phone' },
    { key: 'organization', label: 'Business / Organization' },
    { key: 'timestamp', label: 'Submitted On' },
  ];

  fields.forEach(f => {
    const value = params.get(f.key);
    if (value) {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${f.label}:</strong> ${value}`;
      submittedList.appendChild(li);
    }
  });
}