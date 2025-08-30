@echo off
echo 🧪 Testing Proxy Configuration
echo ===============================
echo.

echo 📋 Testing Backend Health...
curl -s http://localhost:5000/api/health
if %errorlevel% equ 0 (
    echo ✅ Backend is responding
) else (
    echo ❌ Backend is not responding
    echo Please start the backend first
    pause
    exit /b 1
)

echo.
echo 📋 Testing Frontend Proxy...
curl -s http://localhost:3000
if %errorlevel% equ 0 (
    echo ✅ Frontend is responding
) else (
    echo ❌ Frontend is not responding
    echo Please start the frontend first
    pause
    exit /b 1
)

echo.
echo 📋 Testing API through Proxy...
curl -s http://localhost:3000/api/health
if %errorlevel% equ 0 (
    echo ✅ Proxy is working correctly
) else (
    echo ❌ Proxy is not working
    echo Check the setupProxy.js configuration
)

echo.
echo 📋 Testing CORS Headers...
curl -s -H "Origin: http://localhost:3000" -H "Access-Control-Request-Method: GET" -H "Access-Control-Request-Headers: Content-Type" -X OPTIONS http://localhost:5000/api/health
if %errorlevel% equ 0 (
    echo ✅ CORS preflight is working
) else (
    echo ❌ CORS preflight failed
)

echo.
echo 🎯 Manual Testing Instructions:
echo    1. Open browser and go to http://localhost:3000
echo    2. Open Developer Tools (F12)
echo    3. Go to Network tab
echo    4. Try to login or register
echo    5. Check if API calls are successful
echo    6. Look for any CORS errors in Console
echo.

echo Press any key to exit...
pause >nul
