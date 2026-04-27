// 🔥 LOAD LOCAL FILES INSTEAD OF GITHUB API
async function loadCollection(folder, containerId) {
  try {
    const container = document.getElementById(containerId);
    if (!container) return;

    // 👇 IMPORTANT: load from local index.json (we'll create this next)
    const res = await fetch(`/${folder}/index.json`);
    const items = await res.json();

    container.innerHTML = "";

    let varsity = "";
    let jv = "";

    items.forEach(item => {
      const name = item.name || item.title || "Item";
      const role = item.role || "";
      const date = item.date || "";
      const image = item.image || "";
      const email = item.email || "";
      const bio = item.bio || "";
      const team = item.team || "";

      // 📸 PHOTO GALLERY
      if (containerId === "photos") {
        container.innerHTML += `
          <div class="gallery-item">
            ${image ? `<img src="${image}" alt="photo">` : ""}
          </div>
        `;
        return;
      }

      const isRoster = containerId === "members" || containerId === "coaches";

      const card = `
        <div class="${isRoster ? "roster-card" : "card"} fade-up"
             ${bio ? `onclick="openModal('${escapeQuotes(name)}','${escapeQuotes(bio)}')"` : ""}>

          ${image ? `<img src="${image}" alt="${name}">` : ""}

          <h3>${name}</h3>
          ${role ? `<p>${role}</p>` : ""}
          ${date ? `<p>${date}</p>` : ""}

          ${email ? `<a href="mailto:${email}" class="email-btn" onclick="event.stopPropagation()">Email</a>` : ""}
        </div>
      `;

      if (containerId === "coaches") {
        if (team === "Varsity") {
          varsity += card;
        } else {
          jv += card;
        }
      } else {
        container.innerHTML += card;
      }
    });

    if (containerId === "coaches") {
      container.innerHTML = `
        <h3>Varsity Coaches</h3>
        <div class="section-grid">${varsity || "<p>No varsity coaches yet.</p>"}</div>

        <h3 style="margin-top:40px;">JV Coaches</h3>
        <div class="section-grid">${jv || "<p>No JV coaches yet.</p>"}</div>
      `;
    }

    applyAnimations();

  } catch (err) {
    console.error("Static load error:", folder, err);
  }
}

// HELPERS
function escapeQuotes(str) {
  if (!str) return "";
  return str.replace(/'/g, "\\'").replace(/"/g, '\\"');
}

function openModal(name, bio) {
  document.getElementById("modal-name").innerText = name;
  document.getElementById("modal-bio").innerText = bio;
  document.getElementById("modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

function applyAnimations() {
  const elements = document.querySelectorAll(".fade-up");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  });

  elements.forEach(el => observer.observe(el));
}

// LOAD DATA
loadCollection("content/members", "members");
loadCollection("content/coaches", "coaches");
loadCollection("content/photos", "photos");
loadCollection("content/events", "events");
