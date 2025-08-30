# Proxy Issues Fix Guide

## 🔧 समस्या का विवरण

आपको proxy error आ रही है क्योंकि:

1. **Frontend और Backend के बीच CORS issues**
2. **Proxy configuration में mismatch**
3. **Port conflicts**
4. **Missing dependencies**

## 🛠️ समाधान

### तुरंत समाधान के लिए:

1. **Comprehensive Fix Script चलाएं:**
   ```bash
   fix-all-proxy-issues.bat
   ```

2. **या Basic Fix Script:**
   ```bash
   fix-proxy.bat
   ```

### मैनुअल समाधान:

#### Step 1: Dependencies Install करें
```bash
cd frontend
npm install http-proxy-middleware
cd ..
```

#### Step 2: setupProxy.js बनाएं
`frontend/src/setupProxy.js` में यह code डालें:
```javascript
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
        console.log(`🔄 Proxying ${req.method} ${req.url} to http://localhost:5000${req.url}`);
      },
      onProxyRes: (proxyRes, req, res) => {
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
```

#### Step 3: package.json में proxy configuration
`frontend/package.json` में यह line होनी चाहिए:
```json
"proxy": "http://localhost:5000"
```

#### Step 4: Backend CORS configuration
`backend/server.js` में CORS configuration update करें।

## 🧪 Testing

### Automated Testing:
```bash
test-proxy.bat
```

### Manual Testing:
1. Backend start करें: `cd backend && npm start`
2. Frontend start करें: `cd frontend && npm start`
3. Browser में जाएं: `http://localhost:3000`
4. Developer Tools खोलें (F12)
5. Console में proxy logs देखें
6. Network tab में API calls check करें

## 🔍 Common Issues और Solutions

### Issue 1: "Proxy error: ECONNREFUSED"
**Solution:** Backend server start नहीं हुआ है
```bash
cd backend && npm start
```

### Issue 2: "CORS error"
**Solution:** setupProxy.js file missing है
```bash
fix-all-proxy-issues.bat
```

### Issue 3: "Port already in use"
**Solution:** Existing processes को kill करें
```bash
# Windows में
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Issue 4: "Module not found: http-proxy-middleware"
**Solution:** Dependency install करें
```bash
cd frontend && npm install http-proxy-middleware
```

## 📊 System Architecture

```
Frontend (Port 3000) 
    ↓ (Proxy)
Backend (Port 5000)
    ↓
MongoDB (Port 27017)
```

## 🎯 Expected Behavior

✅ Frontend: http://localhost:3000 पर accessible
✅ Backend: http://localhost:5000 पर accessible  
✅ API calls: Frontend से Backend तक proxy के through
✅ CORS: No errors in browser console
✅ Authentication: Login/Register working

## 🚨 Troubleshooting

अगर अभी भी issues हैं:

1. **Browser cache clear करें** (Ctrl+Shift+R)
2. **Node modules reinstall करें:**
   ```bash
   cd frontend && rm -rf node_modules && npm install
   cd ../backend && rm -rf node_modules && npm install
   ```
3. **MongoDB check करें** कि running है
4. **Firewall settings** check करें
5. **Antivirus software** को temporarily disable करें

## 📞 Support

अगर कोई और issue है तो:
1. Browser console में error messages copy करें
2. Network tab में failed requests का screenshot लें
3. Backend और Frontend terminal output share करें
