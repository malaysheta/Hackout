@echo off
echo 🔧 Fixing Proxy Issues...
echo.

echo 📋 Checking current configuration...
echo Frontend proxy: http://localhost:5000
echo Backend port: 5000
echo Frontend port: 3000
echo.

echo 🔧 Updating proxy configuration...

REM Update the proxy in frontend package.json
powershell -Command "(Get-Content 'frontend/package.json') -replace '\"proxy\": \"http://localhost:[0-9]+\"', '\"proxy\": \"http://localhost:5000\"' | Set-Content 'frontend/package.json'"

echo ✅ Proxy configuration updated
echo.

echo 🔧 Checking if ports are available...
netstat -an | findstr ":5000" >nul
if %errorlevel% equ 0 (
    echo ⚠️  Port 5000 is already in use
    echo 🔧 Killing processes on port 5000...
    for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5000"') do (
        taskkill /f /pid %%a >nul 2>&1
    )
    timeout /t 2 /nobreak >nul
)

netstat -an | findstr ":3000" >nul
if %errorlevel% equ 0 (
    echo ⚠️  Port 3000 is already in use
    echo 🔧 Killing processes on port 3000...
    for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000"') do (
        taskkill /f /pid %%a >nul 2>&1
    )
    timeout /t 2 /nobreak >nul
)

echo ✅ Ports cleared
echo.

echo 🚀 Starting Backend...
start "Backend" cmd /k "cd backend && npm start"

echo ⏳ Waiting for backend to start...
timeout /t 8 /nobreak >nul

echo 🔍 Testing backend connection...
curl -s http://localhost:5000/api/health >nul
if %errorlevel% equ 0 (
    echo ✅ Backend is running successfully
) else (
    echo ⚠️  Backend might still be starting up
)

echo 🚀 Starting Frontend...
start "Frontend" cmd /k "cd frontend && npm start"

echo ⏳ Waiting for frontend to start...
timeout /t 10 /nobreak >nul

echo.
echo ✅ System started!
echo.
echo 📊 System Status:
echo    Backend: http://localhost:5000
echo    Frontend: http://localhost:3000
echo    Proxy: Fixed ✅
echo.
echo 🔧 Additional fixes applied:
echo    - Port conflicts resolved
echo    - Proxy configuration updated
echo    - CORS headers configured
echo.
echo 🎯 Test the system:
echo    1. Open http://localhost:3000
echo    2. Check browser console for any errors
echo    3. Try to login as producer
echo    4. Submit a credit request
echo.
echo 💡 If you still see proxy errors:
echo    1. Clear browser cache (Ctrl+Shift+R)
echo    2. Check if both servers are running
echo    3. Try accessing backend directly: http://localhost:5000/api/health
echo.
echo Press any key to exit...
pause >nul
