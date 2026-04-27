const fs = require("fs");
const path = require("path");

function parseFrontmatter(content) {
  const match = content.match(/---([\s\S]*?)---/);
  if (!match) return {};

  const lines = match[1].split("\n");
  const data = {};

  lines.forEach(line => {
    const [key, ...rest] = line.split(":");
    if (!key) return;
    data[key.trim()] = rest.join(":").trim();
  });

  return data;
}

function buildCollection(folderPath) {
  const files = fs.readdirSync(folderPath).filter(f => f.endsWith(".md"));

  const items = files.map(file => {
    const content = fs.readFileSync(path.join(folderPath, file), "utf8");
    return parseFrontmatter(content);
  });

  fs.writeFileSync(
    path.join(folderPath, "index.json"),
    JSON.stringify(items, null, 2)
  );
}

exports.handler = async () => {
  const contentDir = path.join(process.cwd(), "content");

  fs.readdirSync(contentDir).forEach(folder => {
    const folderPath = path.join(contentDir, folder);
    if (fs.lstatSync(folderPath).isDirectory()) {
      buildCollection(folderPath);
    }
  });

  return { statusCode: 200 };
};
