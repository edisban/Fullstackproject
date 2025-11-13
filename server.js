// Minimal static server with SPA fallback for Vite build
// Uses CommonJS so it runs even with "type": "module" in package.json

const express = require('express');
const path = require('path');
const history = require('connect-history-api-fallback');

const app = express();
const PORT = 5176;
const HOST = 'localhost';

const distPath = path.join(__dirname, 'dist');

// HTML5 history API fallback (so /login, /dashboard refresh won't 404)
app.use(history({
  disableDotRule: true,
  verbose: false,
}));

// Serve static assets from dist
app.use(express.static(distPath, {
  setHeaders: (res, filePath) => {
    // Basic caching for assets; index.html no-cache
    if (/(\.js|\.css|\.svg|\.png|\.jpg|\.jpeg|\.gif|\.woff2?)$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (/index\.html$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'no-store');
    }
  }
}));

app.listen(PORT, HOST, () => {
  console.log(`SPA server running at http://${HOST}:${PORT}`);
});
