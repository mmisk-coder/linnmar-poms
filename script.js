const BASE = "/linnmar-poms";

async function loadCollection(folder, containerId) {
  try {
    const container = document.getElementById(containerId);
    if (!container) return;

    const res = await fetch(`${BASE}/${folder}/index.json`);
    const items = await res.json();

    container.innerHTML = "";

    let varsity = "";
    let jv = "";

    items.forEach(item => {
      const name = item.name || item.title || "Item";
      const role = item.role || "";
      const date = item.date || "";
      const image = item.image ? `${BASE}${item.image}` : "";
      const email = item.email || "";
      const bio = item.bio || "";
      const team = item.team || "";

      // 📸 PHOTO GALLERY (LIGHTBOX ENABLED)
      if (containerId === "photos") {
        container.innerHTML += `
          <div class="gallery-item fade-up">
            ${image ? `<img src="${image}" onclick="openLightbox('${image}')" alt="photo">` : ""}
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

    // Coaches split
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

//
// 🔥 LIGHTBOX FUNCTIONS
//
function openLightbox(src) {
  document.getElementById("lightbox-img").src = src;
  document.getElementById("lightbox").style.display = "flex";
}

function closeLightbox() {
  document.getElementById("lightbox").style.display = "none";
}

//
// 🔥 MOBILE NAV
//
function toggleMenu() {
  document.getElementById("navMenu").classList.toggle("show");
}

//
// 🔥 MODAL FUNCTIONS (coach bio)
//
function openModal(name, bio) {
  document.getElementById("modal-name").innerText = name;
  document.getElementById("modal-bio").innerText = bio;
  document.getElementById("modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

//
// 🔥 ANIMATIONS
//
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

//
// 🔥 LOAD DATA (AUTO LOAD BASED ON PAGE)
//
document.addEventListener("DOMContentLoaded", () => {
  loadCollection("content/members", "members");
  loadCollection("content/coaches", "coaches");
  loadCollection("content/photos", "photos");
  loadCollection("content/events", "events");
  loadCollection("content/tryouts", "tryouts");
  loadCollection("content/state", "state");
  loadCollection("content/community", "community");
});
