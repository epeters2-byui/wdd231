// form-action.js — displays submitted form data on the action page

const resultsList = document.getElementById('form-results');

if (resultsList) {
  const params = new URLSearchParams(window.location.search);

  const fields = [
    { key: 'name', label: 'Full Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'region', label: 'Region' },
    { key: 'crop', label: 'Primary Crop' },
    { key: 'years', label: 'Years of Experience' },
    { key: 'description', label: 'Farm Description' }
  ];

  fields.forEach(f => {
    const value = params.get(f.key);
    if (value) {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${f.label}:</strong> ${value}`;
      resultsList.appendChild(li);
    }
  });

  if (resultsList.children.length === 0) {
    resultsList.innerHTML = '<li>No form data was provided.</li>';
  }
}