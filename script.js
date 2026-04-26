async function loadCollection(folder, containerId) {
  const url = `https://api.github.com/repos/mmisk-coder/linnmar-poms/contents/${folder}`;
  
  const res = await fetch(url);
  const files = await res.json();

  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  for (const file of files) {
    if (file.name.endsWith(".md")) {
      const contentRes = await fetch(file.download_url);
      const text = await contentRes.text();

      const titleMatch = text.match(/title:\s*(.*)/);
      const nameMatch = text.match(/name:\s*(.*)/);

      const title = titleMatch ? titleMatch[1] : nameMatch ? nameMatch[1] : "Item";

      container.innerHTML += `
        <div class="card">
          <h3>${title}</h3>
        </div>
      `;
    }
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
