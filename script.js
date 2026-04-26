async function load(name, containerId){
  const res = await fetch(`content/${name}.json`);
  const data = await res.json();

  const container = document.getElementById(containerId);

  data.forEach(item=>{
    container.innerHTML += `
      <div class="card">
        <h3>${item.name || item.title}</h3>
        <p>${item.role || item.date}</p>
      </div>
    `;
  });
}

load("members", "members");
load("events", "events");