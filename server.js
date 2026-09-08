const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};

function send(res, code, filePath) {
  res.writeHead(code, {
    "Content-Type": MIME[path.extname(filePath).toLowerCase()] || "application/octet-stream",
  });
  fs.createReadStream(filePath).pipe(res);
}

http
  .createServer((req, res) => {
    let urlPath;
    try {
      urlPath = decodeURIComponent(req.url.split("?")[0]);
    } catch (e) {
      send(res, 404, path.join(ROOT, "404.html"));
      return;
    }

    if (urlPath === "/") urlPath = "/index.html";

    const filePath = path.join(ROOT, path.normalize(urlPath));
    if (!filePath.startsWith(ROOT)) {
      send(res, 404, path.join(ROOT, "404.html"));
      return;
    }

    fs.stat(filePath, (err, stat) => {
      if (err || !stat.isFile()) {
        send(res, 404, path.join(ROOT, "404.html"));
        return;
      }
      send(res, 200, filePath);
    });
  })
  .listen(PORT, () => {
    console.log(`CampusEats running at http://localhost:${PORT}`);
  });