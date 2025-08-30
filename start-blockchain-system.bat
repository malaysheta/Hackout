@echo off
echo 🚀 Starting Hydrogen Credits Blockchain System - MANDATORY
echo.

echo 📋 Checking blockchain prerequisites...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if Hardhat is installed
cd blockchain
npx hardhat --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Hardhat is not installed. Installing Hardhat...
    npm install --save-dev hardhat
)

echo ✅ Prerequisites check complete
echo.

echo 🔧 Compiling smart contracts...
call npx hardhat compile
if %errorlevel% neq 0 (
    echo ❌ Contract compilation failed
    pause
    exit /b 1
)

echo ✅ Contracts compiled successfully
echo.

echo 🚀 Starting local blockchain node...
start "Hardhat Node" cmd /k "npx hardhat node"

REM Wait for node to start
echo ⏳ Waiting for blockchain node to start...
timeout /t 10 /nobreak >nul

echo ✅ Blockchain node started
echo.

echo 🔧 Deploying smart contract...
call npx hardhat run scripts/deploy.js --network localhost
if %errorlevel% neq 0 (
    echo ❌ Contract deployment failed
    pause
    exit /b 1
)

echo ✅ Contract deployed successfully
echo.

cd ..

echo 🧪 Testing blockchain integration...
cd backend
call npm run test:integration
if %errorlevel% neq 0 (
    echo ❌ Blockchain integration test failed
    pause
    exit /b 1
)

cd ..

echo.
echo ✅ Blockchain system is ready!
echo.
echo 📊 System Status:
echo    Blockchain Node: http://localhost:8545
echo    Contract: Deployed and verified
echo    Integration: ✅ Working
echo.
echo 🎯 Next Steps:
echo    1. Start backend: cd backend && npm start
echo    2. Start frontend: cd frontend && npm start
echo    3. Test credit request submission
echo.
echo ⚠️ WARNING: Keep blockchain node running!
echo    System will NOT work without blockchain!
echo.
echo Press any key to exit...
pause >nul
