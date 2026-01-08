// Minimal static server with SPA fallback for Vite build (CommonJS)
const express = require('express');
const path = require('path');
const history = require('connect-history-api-fallback');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 5176;
const HOST = process.env.HOST || '0.0.0.0';
const API_TARGET = process.env.API_TARGET || 'http://localhost:8080';

const distPath = path.join(__dirname, 'dist');

app.use('/api', createProxyMiddleware({
  target: API_TARGET,
  changeOrigin: true,
  secure: false,
  proxyTimeout: 15000,
  onError(err, req, res) {
    console.error('[proxy] backend unreachable', err.message);
    if (!res.headersSent) {
      res.status(502).json({ message: 'Backend unavailable', detail: err.message });
    }
  },
}));

app.use(history({ disableDotRule: true, verbose: false }));

app.use(express.static(distPath, {
  setHeaders: (res, filePath) => {
    if (/\.(js|css|svg|png|jpg|jpeg|gif|woff2?)$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (/index\.html$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'no-store');
    }
  }
}));

app.listen(PORT, HOST, () => {
  const hostForLog = HOST === '0.0.0.0' ? 'localhost' : HOST;
  console.log(`SPA server running at http://${hostForLog}:${PORT}`);
  console.log(`Proxying /api -> ${API_TARGET}`);
});
