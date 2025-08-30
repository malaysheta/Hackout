# 🚀 Hydrogen Credits System - Complete Integration Setup

## 📋 Overview

This guide will help you set up the complete Hydrogen Credits system with backend, database, and blockchain integration.

## 🏗️ System Architecture

```
Frontend (React) ←→ Backend (Node.js/Express) ←→ Database (MongoDB)
                              ↓
                    Blockchain (Ethereum/Hardhat)
```

## 🛠️ Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Git

## 📦 Installation Steps

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd Hackout

# Install dependencies for all components
npm install
cd backend && npm install
cd ../frontend && npm install
cd ../blockchain && npm install
```

### 2. Database Setup

```bash
# Start MongoDB (if using local)
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in backend/.env
```

### 3. Environment Configuration

Create `backend/.env` file:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/hydrogen-credits

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Blockchain Configuration - MANDATORY
BLOCKCHAIN_NETWORK=localhost
BLOCKCHAIN_RPC_URL=http://127.0.0.1:8545
BLOCKCHAIN_PRIVATE_KEY=your-private-key-here
CONTRACT_ADDRESS=your-contract-address-here
```

### 4. Blockchain Setup - MANDATORY

```bash
# Navigate to blockchain directory
cd blockchain

# Compile contracts
npx hardhat compile

# Start local blockchain
npx hardhat node

# In another terminal, deploy contracts
npx hardhat run scripts/deploy.js --network localhost

# Copy the contract address to backend/.env
```

### 5. Database Seeding

```bash
# Navigate to backend
cd backend

# Seed initial data
npm run seed

# Seed producer and certifier data
npm run seed:producer-certifier
```

## 🧪 Testing Integration

### Run Integration Tests

```bash
cd backend
npm run test:integration
```

This will test:
- ✅ Database connection and models
- ✅ Data validation
- ✅ Metadata hash generation
- ✅ File hash generation
- ✅ Blockchain integration - MANDATORY

### Manual Testing

1. **Start Backend:**
   ```bash
   cd backend
   npm start
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm start
   ```

3. **Test Credit Request:**
   - Login as producer
   - Go to "Request Issuance" tab
   - Fill the form and submit
   - Check database for saved request

## 🔧 Troubleshooting

### Common Issues

1. **MongoDB Connection Error:**
   ```bash
   # Check if MongoDB is running
   mongod --version
   
   # Start MongoDB
   mongod
   ```

2. **Blockchain Connection Error:**
   ```bash
   # BLOCKCHAIN IS MANDATORY - System cannot function without blockchain
   # Start blockchain: cd blockchain && npx hardhat node
   # Deploy contract: npx hardhat run scripts/deploy.js --network localhost
   # Check blockchain/utils/blockchain.js for details
   ```

3. **Port Already in Use:**
   ```bash
   # Kill process on port 5000
   lsof -ti:5000 | xargs kill -9
   
   # Or change PORT in .env
   ```

4. **Module Not Found:**
   ```bash
   # Reinstall dependencies
   npm install
   ```

### Debug Mode

Enable debug logging:

```bash
# Backend debug
DEBUG=* npm start

# Frontend debug
REACT_APP_DEBUG=true npm start
```

## 📊 System Status Check

### Health Endpoints

- Backend Health: `http://localhost:5000/api/health`
- Test Endpoint: `http://localhost:5000/api/test`
- Producer Test: `http://localhost:5000/api/producer/test`

### Database Status

```bash
# Check MongoDB connection
mongo hydrogen-credits --eval "db.stats()"

# Check collections
mongo hydrogen-credits --eval "show collections"
```

## 🔄 Development Workflow

1. **Make Changes:**
   - Edit frontend code
   - Update backend routes
   - Modify smart contracts

2. **Test Changes:**
   ```bash
   # Run integration tests
   npm run test:integration
   
   # Manual testing
   # Submit credit request
   # Check database
   # Verify blockchain (if enabled)
   ```

3. **Deploy Updates:**
   - Restart backend: `npm start`
   - Restart frontend: `npm start`
   - Redeploy contracts (if changed): `npx hardhat run scripts/deploy.js`

## 📈 Production Deployment

### Environment Variables

Update `.env` for production:

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=very-secure-production-secret
BLOCKCHAIN_NETWORK=mainnet
CONTRACT_ADDRESS=deployed-contract-address
```

### Security Checklist

- [ ] Change JWT_SECRET
- [ ] Use HTTPS
- [ ] Enable rate limiting
- [ ] Set up monitoring
- [ ] Backup database
- [ ] Secure blockchain keys

## 🎯 Success Criteria

Your system is working correctly when:

1. ✅ Backend starts without errors
2. ✅ Frontend loads and connects to backend
3. ✅ Database stores credit requests
4. ✅ Form validation works
5. ✅ Error messages are clear
6. ✅ Blockchain integration - MANDATORY and working

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section
2. Run integration tests
3. Check console logs
4. Verify environment variables
5. Ensure all services are running

## 🎉 Congratulations!

You now have a fully integrated Hydrogen Credits system with:
- ✅ Frontend (React)
- ✅ Backend (Node.js/Express)
- ✅ Database (MongoDB)
- ✅ Blockchain (Ethereum/Hardhat)
- ✅ File upload support
- ✅ Authentication
- ✅ Role-based access control

The system is ready for development and testing! 🚀
