const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();

app.use(cors());

app.use('/api', createProxyMiddleware({
  target: 'https://api.consumet.org/anime/gogoanime',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '',
  },
}));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});