async function loadCollection(folder, containerId) {
  const url = `https://api.github.com/repos/mmisk-coder/linnmar-poms/contents/${folder}`;
  
  try {
    const res = await fetch(url);
    const files = await res.json();

    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";

    for (const file of files) {
      if (file.name.endsWith(".md")) {
        const contentRes = await fetch(file.download_url);
        const text = await contentRes.text();

        // Extract fields
        const name = (text.match(/name:\s*(.*)/) || [])[1];
        const title = (text.match(/title:\s*(.*)/) || [])[1];
        const role = (text.match(/role:\s*(.*)/) || [])[1];
        const date = (text.match(/date:\s*(.*)/) || [])[1];
        const image = (text.match(/image:\s*(.*)/) || [])[1];

        const displayTitle = name || title || "Item";

        container.innerHTML += `
          <div class="card">
            ${image ? `<img src="${image}" alt="${displayTitle}">` : ""}
            <h3>${displayTitle}</h3>
            ${role ? `<p>${role}</p>` : ""}
            ${date ? `<p>${date}</p>` : ""}
          </div>
        `;
      }
    }
  } catch (err) {
    console.error("Error loading collection:", folder, err);
  }
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
