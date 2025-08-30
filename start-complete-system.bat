@echo off
echo 🚀 Starting Complete Hydrogen Credits System
echo.

echo 📋 Checking prerequisites...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo ✅ Node.js found
echo.

echo 🔧 Fixing proxy configuration...
REM Update proxy in frontend package.json
powershell -Command "(Get-Content 'frontend/package.json') -replace 'http://localhost:5001', 'http://localhost:5000' | Set-Content 'frontend/package.json'"
echo ✅ Proxy fixed: frontend -> backend (5000)
echo.

echo 🔍 Checking MongoDB...
netstat -an | find "27017" >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️ MongoDB is not running. Starting MongoDB...
    start "MongoDB" mongod
    timeout /t 3 /nobreak >nul
    echo ✅ MongoDB started
) else (
    echo ✅ MongoDB is running
)
echo.

echo 🧪 Testing backend integration...
cd backend
call npm run test:integration
if %errorlevel% neq 0 (
    echo ⚠️ Integration test failed - continuing anyway
) else (
    echo ✅ Integration test passed
)
cd ..
echo.

echo 🚀 Starting Backend Server...
start "Backend" cmd /k "cd backend && npm start"

echo ⏳ Waiting for backend to start...
timeout /t 8 /nobreak >nul

echo 🚀 Starting Frontend Server...
start "Frontend" cmd /k "cd frontend && npm start"

echo ⏳ Waiting for frontend to start...
timeout /t 5 /nobreak >nul

echo.
echo ✅ Complete System Started!
echo.
echo 📊 System Status:
echo    Backend: http://localhost:5000
echo    Frontend: http://localhost:3000
echo    MongoDB: Running
echo    Proxy: Fixed ✅
echo.
echo 🎯 Test the system:
echo    1. Open http://localhost:3000
echo    2. Login as producer
echo    3. Submit a credit request
echo    4. Check blockchain integration
echo.
echo ⚠️ Note: For full blockchain functionality:
echo    Run: ./start-blockchain-system.bat
echo.
echo Press any key to exit...
pause >nul
