// marketplace.js — loads farmers.json via fetch, renders, filters, modal, localStorage

const grid = document.getElementById('farmer-grid');
const regionFilter = document.getElementById('region-filter');
const cropFilter = document.getElementById('crop-filter');
const summary = document.getElementById('filter-summary');
const modal = document.getElementById('farmer-modal');

const STORAGE_KEY = 'lidi-saved-farmers';
let allFarmers = [];

// =================== LOCALSTORAGE HELPERS ===================
function getSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Saved farmers read error:', err);
    return [];
  }
}

function isSaved(id) { return getSaved().includes(id); }

function toggleSaved(id) {
  const saved = getSaved();
  const idx = saved.indexOf(id);
  if (idx === -1) saved.push(id);
  else saved.splice(idx, 1);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
}

// =================== FETCH FARMERS ===================
async function loadFarmers() {
  try {
    const response = await fetch('data/farmers.json');
    if (!response.ok) throw new Error('Failed to load farmers.json');
    allFarmers = await response.json();
    populateFilters();
    displayFarmers();
  } catch (error) {
    console.error('Marketplace error:', error);
    grid.innerHTML = '<p>Unable to load farmers. Please try again later.</p>';
  }
}

// =================== FILTERS ===================
function populateFilters() {
  const regions = [...new Set(allFarmers.map(f => f.region))].sort();
  const crops = [...new Set(allFarmers.map(f => f.primaryCrop))].sort();

  regions.forEach(r => {
    const opt = document.createElement('option');
    opt.value = r; opt.textContent = r;
    regionFilter.appendChild(opt);
  });

  crops.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c; opt.textContent = c;
    cropFilter.appendChild(opt);
  });
}

function getFiltered() {
  const r = regionFilter.value;
  const c = cropFilter.value;
  return allFarmers.filter(f =>
    (r === 'all' || f.region === r) &&
    (c === 'all' || f.primaryCrop === c)
  );
}

// =================== RENDER CARDS ===================
function renderCard(farmer) {
  const card = document.createElement('article');
  card.classList.add('farmer-card');

  const saved = isSaved(farmer.id);

  card.innerHTML = `
    <img src="images/farmer-${farmer.id}.webp" alt="Photo of ${farmer.name}" loading="lazy" width="300" height="180">
    <h2>${farmer.name}</h2>
    <p class="region">Region: ${farmer.region}</p>
    <p class="crop">Primary Crop: ${farmer.primaryCrop}</p>
    <p class="years">Experience: ${farmer.yearsExperience} years</p>
    <div class="farmer-actions">
      <button class="view-btn" data-id="${farmer.id}">View Details</button>
      <button class="save-btn ${saved ? 'saved' : ''}" data-id="${farmer.id}">
        ${saved ? '★ Saved' : '☆ Save'}
      </button>
    </div>
  `;
  return card;
}

function displayFarmers() {
  const filtered = getFiltered();
  grid.innerHTML = '';

  if (filtered.length === 0) {
    grid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">No farmers match your filters.</p>';
    summary.textContent = '0 farmers found';
    return;
  }

  filtered.forEach(farmer => grid.appendChild(renderCard(farmer)));
  summary.textContent = `Showing ${filtered.length} farmer${filtered.length !== 1 ? 's' : ''}`;
}

// =================== MODAL ===================
function openModal(id) {
  const farmer = allFarmers.find(f => f.id === Number(id));
  if (!farmer) return;
  document.getElementById('modal-farmer-name').textContent = farmer.name;
  document.getElementById('modal-region').textContent = farmer.region;
  document.getElementById('modal-crop').textContent = farmer.primaryCrop;
  document.getElementById('modal-years').textContent = farmer.yearsExperience;
  document.getElementById('modal-phone').textContent = farmer.phone;
  document.getElementById('modal-bio').textContent = farmer.bio;
  modal.showModal();
}

// =================== EVENT HANDLERS ===================
grid.addEventListener('click', (e) => {
  const viewBtn = e.target.closest('.view-btn');
  const saveBtn = e.target.closest('.save-btn');

  if (viewBtn) openModal(viewBtn.dataset.id);

  if (saveBtn) {
    const id = Number(saveBtn.dataset.id);
    toggleSaved(id);
    const saved = isSaved(id);
    saveBtn.textContent = saved ? '★ Saved' : '☆ Save';
    saveBtn.classList.toggle('saved', saved);
  }
});

document.querySelector('.modal-close')?.addEventListener('click', () => modal.close());

regionFilter.addEventListener('change', displayFarmers);
cropFilter.addEventListener('change', displayFarmers);

// =================== INIT ===================
loadFarmers();