// Local preview server (dev only — not used by GitHub Pages).
// Also accepts POST /__save?file=assets/og.jpg (data URL body) to save the OG image from tools/og.html.
const http = require("http");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const port = process.env.PORT || 5500;
const types = {
  ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript",
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml",
  ".mp3": "audio/mpeg", ".ics": "text/calendar",
};

http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");

  if (req.method === "POST" && url.pathname === "/__save") {
    const file = path.resolve(root, url.searchParams.get("file") || "");
    if (!file.startsWith(path.join(root, "assets"))) { res.writeHead(400); return res.end(); }
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => {
      fs.writeFileSync(file, Buffer.from(body.split(",")[1], "base64"));
      res.end("saved " + file);
    });
    return;
  }

  let file = path.join(root, decodeURIComponent(url.pathname));
  if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  fs.readFile(file, (e, data) => {
    if (e) { res.writeHead(404); return res.end("not found"); }
    res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
    res.end(data);
  });
}).listen(port, () => console.log(`Card preview: http://localhost:${port}`));
