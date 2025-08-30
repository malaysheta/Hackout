@echo off
echo 🚀 Starting Hydrogen Credits Integrated System...
echo.

echo 📋 Checking prerequisites...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if MongoDB is running
echo 🔍 Checking MongoDB...
netstat -an | find "27017" >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️ MongoDB is not running. Starting MongoDB...
    start "MongoDB" mongod
    timeout /t 3 /nobreak >nul
)

echo ✅ Prerequisites check complete
echo.

echo 🧪 Running integration tests...
cd backend
call npm run test:integration
if %errorlevel% neq 0 (
    echo ❌ Integration tests failed
    pause
    exit /b 1
)
cd ..

echo.
echo 🚀 Starting services...

REM Start backend
echo 📡 Starting Backend...
start "Backend" cmd /k "cd backend && npm start"

REM Wait for backend to start
timeout /t 5 /nobreak >nul

REM Start frontend
echo 🌐 Starting Frontend...
start "Frontend" cmd /k "cd frontend && npm start"

echo.
echo ✅ All services started!
echo.
echo 📊 System Status:
echo    Backend: http://localhost:5000
echo    Frontend: http://localhost:3000
echo    Health Check: http://localhost:5000/api/health
echo.
echo 🎯 Test the system:
echo    1. Open http://localhost:3000
echo    2. Login as producer
echo    3. Submit a credit request
echo    4. Check database for saved data
echo.
echo Press any key to exit...
pause >nul
