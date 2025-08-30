const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
      secure: false,
      logLevel: 'debug',
      onProxyReq: (proxyReq, req, res) => {
        // Log proxy requests for debugging
        console.log(`🔄 Proxying ${req.method} ${req.url} to http://localhost:5000${req.url}`);
      },
      onProxyRes: (proxyRes, req, res) => {
        // Add CORS headers
        proxyRes.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000';
        proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
        proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
        proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With, Accept, Origin';
        
        console.log(`✅ Proxy response: ${proxyRes.statusCode} for ${req.url}`);
      },
      onError: (err, req, res) => {
        console.error('❌ Proxy error:', err);
        res.writeHead(500, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ 
          error: 'Proxy error', 
          message: err.message,
          url: req.url 
        }));
      }
    })
  );
};
