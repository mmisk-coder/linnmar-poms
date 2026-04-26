async function loadCollection(folder, containerId) {
  const url = `https://api.github.com/repos/mmisk-coder/linnmar-poms/contents/${folder}`;
  
  try {
    const res = await fetch(url);
    const files = await res.json();

    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";

    let varsity = "";
    let jv = "";

    for (const file of files) {
      if (!file.name.endsWith(".md")) continue;

      const contentRes = await fetch(file.download_url);
      const text = await contentRes.text();

      // Extract fields
      const name = (text.match(/name:\s*(.*)/) || [])[1];
      const title = (text.match(/title:\s*(.*)/) || [])[1];
      const role = (text.match(/role:\s*(.*)/) || [])[1];
      const date = (text.match(/date:\s*(.*)/) || [])[1];
      const image = (text.match(/image:\s*(.*)/) || [])[1];
      const email = (text.match(/email:\s*(.*)/) || [])[1];
      const bio = (text.match(/bio:\s*(.*)/) || [])[1];
      const team = (text.match(/team:\s*(.*)/) || [])[1];

      const displayTitle = name || title || "Item";

      // 📸 PHOTO GALLERY
      if (containerId === "photos") {
        container.innerHTML += `
          <div class="gallery-item">
            ${image ? `<img src="${image}" alt="photo">` : ""}
          </div>
        `;
        continue;
      }

      // 👥 ROSTER STYLE (members + coaches)
      const isRoster = containerId === "members" || containerId === "coaches";

      const card = `
        <div class="${isRoster ? "roster-card" : "card"} fade-up"
             ${bio ? `onclick="openModal('${escapeQuotes(displayTitle)}','${escapeQuotes(bio)}')"` : ""}>

          ${image ? `<img src="${image}" alt="${displayTitle}">` : ""}

          <h3>${displayTitle}</h3>

          ${role ? `<p>${role}</p>` : ""}
          ${date ? `<p>${date}</p>` : ""}

          ${email ? `<a href="mailto:${email}" class="email-btn" onclick="event.stopPropagation()">Email</a>` : ""}

        </div>
      `;

      // 🎯 COACHES: split Varsity / JV (with fallback)
      if (containerId === "coaches") {
        if (team === "Varsity") {
          varsity += card;
        } else {
          jv += card;
        }
      } else {
        container.innerHTML += card;
      }
    }

    // Render grouped coaches
    if (containerId === "coaches") {
      container.innerHTML = `
        <h3>Varsity Coaches</h3>
        <div class="section-grid">${varsity || "<p>No varsity coaches added yet.</p>"}</div>

        <h3 style="margin-top:40px;">JV Coaches</h3>
        <div class="section-grid">${jv || "<p>No JV coaches added yet.</p>"}</div>
      `;
    }

    // 🔥 Apply animation after content loads
    applyAnimations();

  } catch (err) {
    console.error("Error loading collection:", folder, err);
  }
}

// 🧠 Prevent broken quotes in modal
function escapeQuotes(str) {
  if (!str) return "";
  return str.replace(/'/g, "\\'").replace(/"/g, '\\"');
}

// 🎬 MODAL FUNCTIONS
function openModal(name, bio) {
  document.getElementById("modal-name").innerText = name;
  document.getElementById("modal-bio").innerText = bio;
  document.getElementById("modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

// 🔥 SCROLL ANIMATIONS (D1 polish)
function applyAnimations() {
  const elements = document.querySelectorAll(".fade-up");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => observer.observe(el));
}

// LOAD ALL SECTIONS
loadCollection("content/members", "members");
loadCollection("content/events", "events");
loadCollection("content/alumni", "alumni");
loadCollection("content/coaches", "coaches");
loadCollection("content/tryouts", "tryouts");
loadCollection("content/state", "state");
loadCollection("content/photos", "photos");
loadCollection("content/community", "community");
loadCollection("content/history", "history");
loadCollection("content/lion-lineage", "lion_lineage");
loadCollection("content/fundraisers", "fundraisers");
loadCollection("content/clinics", "clinics");
loadCollection("content/sponsors", "sponsors");
loadCollection("content/memorials", "memorials");
