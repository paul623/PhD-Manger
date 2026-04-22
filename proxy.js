/**
 * PhD Workspace · 本地 CORS 代理
 * 解决浏览器 → 坚果云 WebDAV 的跨域限制
 *
 * 用法：
 *   1. cd phd-pwa && npm install
 *   2. node proxy.js
 *   3. 用 http://localhost:9876 打开工作台
 *
 * 浏览器访问 localhost:9876 → 代理自动返回 HTML
 * 浏览器请求 /dav/*        → 代理转发到坚果云，自动加 CORS 头
 */

const http = require('http');
const httpProxy = require('http-proxy');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 9876;
const WEBDAV_PREFIX = '/dav/';

const proxy = httpProxy.createProxyServer({ changeOrigin: true, secure: true });

// 代理出错时返回可读信息，而不是崩掉
proxy.on('error', (err, req, res) => {
  console.error(`[proxy error] ${req.method} ${req.url} → ${err.message}`);
  if (!res.headersSent) {
    res.writeHead(502, { 'Content-Type': 'application/json' });
  }
  res.end(JSON.stringify({ error: err.message }));
});

// MIME 类型映射
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
};

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  const pathname = decodeURIComponent(parsed.pathname);

  // ===== WebDAV 代理 =====
  if (pathname.startsWith(WEBDAV_PREFIX)) {
    // 把 /dav/xxx 转发到 https://dav.jianguoyun.com/dav/xxx
    const targetPath = pathname.replace(WEBDAV_PREFIX, '');
    const targetUrl = `https://dav.jianguoyun.com/dav/${targetPath}`;

    // 响应完成后加 CORS 头（proxyRes 事件）
    proxy.once('proxyRes', (proxyRes) => {
      proxyRes.headers['access-control-allow-origin'] = '*';
      proxyRes.headers['access-control-allow-methods'] = 'GET,HEAD,PUT,POST,DELETE,MKCOL,PROPFIND,COPY,MOVE';
      proxyRes.headers['access-control-allow-headers'] = 'authorization,content-type,depth,destination,overwrite';
      proxyRes.headers['access-control-expose-headers'] = 'content-length';
    });

    proxy.web(req, res, { target: targetUrl, ignorePath: true });
    return;
  }

  // ===== 静态文件服务 =====
  // 把根目录映射到 proxy.js 所在目录
  let filePath = path.join(__dirname, pathname === '/' ? '/博士工作台2.0.html' : pathname);

  // 安全检查：防止路径穿越
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  });
});

// 处理浏览器预检请求
server.on('connect', (req, socket) => {
  socket.end();
});

server.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════╗
║  PhD Workspace 代理已启动                ║
║                                          ║
║  👉  http://localhost:${PORT}               ║
║                                          ║
║  WebDAV 请求会自动转发到坚果云           ║
║  关闭此窗口 = 停止代理                   ║
╚══════════════════════════════════════════╝
  `);
});
