# Hydrogen Credit System

A comprehensive blockchain-based system for managing green hydrogen credits with Producer and Certifier panels.

## 🌟 New Features Added

### Producer Panel
- **Dashboard**: Overview of total credits, pending requests, active credits, retired credits
- **Credit Request Submission**: Submit new credit issuance requests with detailed production data
- **Credit Management**: View, transfer, and manage your hydrogen credits
- **Request Tracking**: Monitor the status of submitted requests
- **Transaction History**: Complete audit trail of all transactions
- **File Upload**: Upload proof documents (renewable source logs, electrolyzer logs, etc.)

### Certifier Panel
- **Dashboard**: Overview of pending requests, approved credits, rejected requests
- **Request Review**: Review and approve/reject credit issuance requests
- **Credit Monitoring**: Track all issued credits and their current status
- **Audit Trail**: Complete history of all approvals and rejections
- **Compliance Checks**: Verify renewable energy sources and documentation
- **Statistics**: Detailed analytics and reporting

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Hackout
```

2. **Backend Setup**
```bash
cd backend
npm install
npm run seed:producer-certifier  # Seed test data
npm run dev
```

3. **Frontend Setup**
```bash
cd frontend
npm install
npm start
```

4. **Blockchain Setup**
```bash
cd blockchain
npm install
npx hardhat node
# In another terminal
npx hardhat run scripts/deploy.js --network localhost
```

## 🔑 Test Accounts

### Certifiers
- **Certifier 1**: certifier1@example.com / password123
- **Certifier 2**: certifier2@example.com / password123

### Producers
- **Producer 1**: producer1@example.com / password123
- **Producer 2**: producer2@example.com / password123
- **Producer 3**: producer3@example.com / password123

## 📋 Features

### Producer Features
- Submit credit issuance requests
- Upload proof documents
- Track request status
- Manage credit inventory
- Transfer credits to other users
- View transaction history
- Profile and compliance management

### Certifier Features
- Review pending requests
- Approve/reject requests with reasons
- Monitor issued credits
- View audit trail
- Generate reports
- Compliance verification

### System Features
- Role-based access control
- JWT authentication
- File upload and validation
- Real-time notifications
- Blockchain integration
- Audit logging

## 🏗️ Architecture

### Backend (Node.js + Express)
- RESTful API with role-based access
- MongoDB for data persistence
- JWT authentication
- File upload handling
- Blockchain integration

### Frontend (React + Tailwind CSS)
- Modern, responsive UI
- Role-based navigation
- Real-time data updates
- File upload interface
- Dashboard analytics

### Blockchain (Solidity + Hardhat)
- ERC-1155 token standard
- Role-based permissions
- Event logging
- Metadata storage

## 📁 Project Structure

```
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Credit.js
│   │   └── CreditRequest.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── producer.js
│   │   ├── certifier.js
│   │   └── credits.js
│   └── scripts/
│       └── seedProducerCertifierData.js
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── ProducerPortal.js
│   │   │   └── CertifierPortal.js
│   │   └── components/
│   └── public/
└── blockchain/
    ├── contracts/
    │   └── HydrogenCredit.sol
    └── scripts/
        └── deploy.js
```

## 🔧 Configuration

### Environment Variables

Create `.env` files in the backend directory:

```env
# Backend .env
MONGODB_URI=mongodb://localhost:27017/hydrogen-credits
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:3000
PORT=5000
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Smart Contract Tests
```bash
cd blockchain
npx hardhat test
```

## 📚 API Documentation

### Producer Endpoints
- `GET /api/producer/dashboard` - Dashboard statistics
- `POST /api/producer/requestCredit` - Submit credit request
- `GET /api/producer/credits` - List producer credits
- `GET /api/producer/requests` - List producer requests
- `POST /api/producer/transferCredits` - Transfer credits
- `GET /api/producer/history` - Transaction history

### Certifier Endpoints
- `GET /api/certifier/dashboard` - Dashboard statistics
- `GET /api/certifier/pendingRequests` - List pending requests
- `POST /api/certifier/approveRequest` - Approve request
- `POST /api/certifier/rejectRequest` - Reject request
- `GET /api/certifier/credits` - List issued credits
- `GET /api/certifier/auditTrail` - Audit trail

## 🚀 Deployment

### Backend Deployment
```bash
cd backend
npm run build
npm start
```

### Frontend Deployment
```bash
cd frontend
npm run build
# Deploy build folder to your hosting service
```

### Smart Contract Deployment
```bash
cd blockchain
npx hardhat run scripts/deploy.js --network mainnet
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
1. Check the documentation
2. Review the troubleshooting guide
3. Open an issue on GitHub

## 🔮 Future Enhancements

- IPFS integration for decentralized file storage
- Advanced analytics and reporting
- Mobile application
- Multi-chain support
- Advanced compliance features
- Real-time notifications
- API rate limiting and caching
