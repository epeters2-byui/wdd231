const membersContainer = document.getElementById("members");
const gridBtn = document.getElementById("gridViewBtn");
const listBtn = document.getElementById("listViewBtn");

const membershipNames = { 1: "Member", 2: "Silver", 3: "Gold" };

async function loadMembers() {
  try {
    const resp = await fetch("data/members.json");
    if (!resp.ok) throw new Error("Failed to load members");
    const members = await resp.json();
    displayMembers(members);
  } catch (err) {
    console.error(err);
    membersContainer.innerHTML = "<p>Failed to load members.</p>";
  }
}

function displayMembers(members) {
  membersContainer.innerHTML = "";
  members.forEach((m) => {
    const card = document.createElement("div");
    card.className = `member-card ${getLevelClass(m.membership)}`;
    card.innerHTML = `
      <img src="images/${m.image}" alt="${m.name} Logo" loading="lazy" />
      <div class="info">
        <h3>${m.name}</h3>
        <p>${m.address}</p>
        <p>${m.phone}</p>
        <p><a href="${m.website}" target="_blank">Visit Website</a></p>
        <span class="level-badge">${membershipNames[m.membership]}</span>
      </div>
    `;
    membersContainer.appendChild(card);
  });
}

function getLevelClass(level) {
  return level === 3 ? "gold" : level === 2 ? "silver" : "member";
}

gridBtn.addEventListener("click", () => {
  membersContainer.classList.replace("list-view", "grid-view");
});

listBtn.addEventListener("click", () => {
  membersContainer.classList.replace("grid-view", "list-view");
});

document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("lastModified").textContent = document.lastModified;

loadMembers();
