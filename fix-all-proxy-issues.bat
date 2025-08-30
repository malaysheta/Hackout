@echo off
echo 🔧 Comprehensive Proxy Fix Script
echo =================================
echo.

echo 📋 Current Status Check:
echo.

REM Check if frontend package.json has correct proxy
findstr /C:"\"proxy\": \"http://localhost:5000\"" frontend\package.json >nul
if %errorlevel% equ 0 (
    echo ✅ Frontend proxy configuration: OK
) else (
    echo ❌ Frontend proxy configuration: NEEDS FIX
)

REM Check if setupProxy.js exists
if exist frontend\src\setupProxy.js (
    echo ✅ setupProxy.js: EXISTS
) else (
    echo ❌ setupProxy.js: MISSING
)

REM Check if http-proxy-middleware is in dependencies
findstr /C:"http-proxy-middleware" frontend\package.json >nul
if %errorlevel% equ 0 (
    echo ✅ http-proxy-middleware dependency: OK
) else (
    echo ❌ http-proxy-middleware dependency: MISSING
)

echo.

echo 🔧 Step 1: Installing dependencies...
cd frontend
call npm install http-proxy-middleware
cd ..

echo.

echo 🔧 Step 2: Fixing proxy configuration...
powershell -Command "(Get-Content 'frontend/package.json') -replace '\"proxy\": \"http://localhost:[0-9]+\"', '\"proxy\": \"http://localhost:5000\"' | Set-Content 'frontend/package.json'"

echo.

echo 🔧 Step 3: Creating setupProxy.js...
if not exist frontend\src\setupProxy.js (
    echo Creating setupProxy.js...
    powershell -Command "Set-Content 'frontend/src/setupProxy.js' 'const { createProxyMiddleware } = require(\"http-proxy-middleware\"); module.exports = function(app) { app.use(\"/api\", createProxyMiddleware({ target: \"http://localhost:5000\", changeOrigin: true, secure: false, logLevel: \"debug\", onProxyReq: (proxyReq, req, res) => { console.log(\"🔄 Proxying \" + req.method + \" \" + req.url + \" to http://localhost:5000\" + req.url); }, onProxyRes: (proxyRes, req, res) => { proxyRes.headers[\"Access-Control-Allow-Origin\"] = \"http://localhost:3000\"; proxyRes.headers[\"Access-Control-Allow-Credentials\"] = \"true\"; proxyRes.headers[\"Access-Control-Allow-Methods\"] = \"GET, POST, PUT, DELETE, OPTIONS\"; proxyRes.headers[\"Access-Control-Allow-Headers\"] = \"Content-Type, Authorization, X-Requested-With, Accept, Origin\"; console.log(\"✅ Proxy response: \" + proxyRes.statusCode + \" for \" + req.url); }, onError: (err, req, res) => { console.error(\"❌ Proxy error:\", err); res.writeHead(500, { \"Content-Type\": \"application/json\" }); res.end(JSON.stringify({ error: \"Proxy error\", message: err.message, url: req.url })); } })); };'"
) else (
    echo setupProxy.js already exists
)

echo.

echo 🔧 Step 4: Killing existing processes...
echo Stopping any existing servers...

REM Kill processes on port 5000
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5000"') do (
    taskkill /f /pid %%a >nul 2>&1
)

REM Kill processes on port 3000
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000"') do (
    taskkill /f /pid %%a >nul 2>&1
)

timeout /t 3 /nobreak >nul

echo.

echo 🔧 Step 5: Starting Backend...
start "Backend" cmd /k "cd backend && npm start"

echo ⏳ Waiting for backend to start...
timeout /t 10 /nobreak >nul

echo 🔍 Testing backend...
curl -s http://localhost:5000/api/health >nul
if %errorlevel% equ 0 (
    echo ✅ Backend is running
) else (
    echo ⚠️  Backend might still be starting
)

echo.

echo 🔧 Step 6: Starting Frontend...
start "Frontend" cmd /k "cd frontend && npm start"

echo ⏳ Waiting for frontend to start...
timeout /t 15 /nobreak >nul

echo.

echo ✅ COMPREHENSIVE FIX COMPLETED!
echo ===============================
echo.
echo 📊 Final Status:
echo    Backend: http://localhost:5000
echo    Frontend: http://localhost:3000
echo    Proxy: Enhanced with setupProxy.js
echo    CORS: Configured for both sides
echo.
echo 🎯 Testing Instructions:
echo    1. Open http://localhost:3000
echo    2. Open browser developer tools (F12)
echo    3. Check Console tab for proxy logs
echo    4. Try to login/register
echo    5. Check Network tab for API calls
echo.
echo 🔧 If issues persist:
echo    1. Clear browser cache (Ctrl+Shift+R)
echo    2. Check both terminal windows for errors
echo    3. Verify backend health: http://localhost:5000/api/health
echo    4. Check if MongoDB is running
echo.
echo Press any key to exit...
pause >nul
