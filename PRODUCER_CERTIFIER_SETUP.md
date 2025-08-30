# Producer & Certifier Panel Setup Instructions

## Overview
इस प्रोजेक्ट में Producer Panel और Certifier Panel के साथ Hydrogen Credit System को अपडेट किया गया है। यह सिस्टम hydrogen producers को credit issuance requests submit करने और certifiers को उन्हें review और approve करने की सुविधा प्रदान करता है।

## Features Added

### Producer Panel Features
1. **Dashboard**: Total credits, pending requests, active credits, retired credits का overview
2. **Request Credit Issuance**: 
   - Batch ID, Hydrogen Produced, Plant Location, Start/End Dates
   - Energy Source dropdown (Solar, Wind, Hydro, etc.)
   - File upload section (proof documents)
   - Submit to certifier for review
3. **Credit Inventory**: Table with Credit ID, Amount, Status, Actions
4. **Transfer Credits**: Select credit, enter buyer wallet + amount, blockchain transfer
5. **History/Audit Log**: All lifecycle events with filters and export
6. **Profile & Compliance**: Organization profile and compliance certificates

### Certifier Panel Features
1. **Dashboard**: Pending requests, approved credits, rejected requests, notifications
2. **Review Requests**: 
   - List pending issuance requests from producers
   - View metadata + uploaded proof documents
   - Approve/Reject with reasons
3. **Credits Monitoring**: View all issued credits with status tracking
4. **Audit Trail**: All approvals/rejections with timestamps + transaction hashes

## Backend API Updates

### New Models
- `CreditRequest.js`: Credit issuance requests को store करने के लिए
- `User.js`: Updated with role-based access control

### New Routes
- `/api/producer/*`: Producer-specific endpoints
- `/api/certifier/*`: Certifier-specific endpoints

### Key Endpoints

#### Producer Endpoints
- `GET /api/producer/dashboard` - Dashboard statistics
- `POST /api/producer/requestCredit` - Submit credit request
- `GET /api/producer/credits` - List producer credits
- `GET /api/producer/requests` - List producer requests
- `POST /api/producer/transferCredits` - Transfer credits
- `GET /api/producer/history` - Transaction history
- `GET /api/producer/certifiers` - Available certifiers

#### Certifier Endpoints
- `GET /api/certifier/dashboard` - Dashboard statistics
- `GET /api/certifier/pendingRequests` - List pending requests
- `GET /api/certifier/request/:requestId` - Get request details
- `POST /api/certifier/approveRequest` - Approve request
- `POST /api/certifier/rejectRequest` - Reject request
- `GET /api/certifier/credits` - List issued credits
- `GET /api/certifier/requests` - List all requests
- `GET /api/certifier/auditTrail` - Audit trail
- `GET /api/certifier/statistics` - Detailed statistics

## Smart Contract Updates

### New Events
- `CreditRequested`: When producer submits request
- `CreditRejected`: When certifier rejects request

### Updated Functions
- `issueCredit`: Only certifiers can call
- Credits linked to metadata hash (batchHash)

## Frontend Updates

### New Components
- `ProducerPortal.js`: Complete producer interface
- `CertifierPortal.js`: Complete certifier interface

### Features
- Tab-based navigation
- File upload interface (ready for implementation)
- Real-time data loading
- Role-based access control
- Responsive design with Tailwind CSS

## Setup Instructions

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create uploads directory
mkdir -p uploads/producer

# Set environment variables
cp .env.example .env
# Edit .env with your configuration

# Start the server
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

### 3. Database Setup

```bash
# MongoDB should be running
# The application will create necessary collections automatically
```

### 4. Blockchain Setup

```bash
cd blockchain

# Install dependencies
npm install

# Deploy smart contract
npx hardhat run scripts/deploy.js --network localhost

# Start local blockchain
npx hardhat node
```

## Usage Instructions

### For Producers

1. **Register/Login**: Create account with PRODUCER role
2. **Dashboard**: View your credit statistics and recent activity
3. **Request Issuance**: 
   - Fill in production details
   - Upload proof documents
   - Select certifier
   - Submit request
4. **Monitor Requests**: Track status of submitted requests
5. **Manage Credits**: View, transfer, or retire your credits

### For Certifiers

1. **Register/Login**: Create account with CERTIFIER role
2. **Dashboard**: View pending requests and statistics
3. **Review Requests**:
   - View pending requests
   - Review submitted documents
   - Approve or reject with reasons
4. **Monitor Credits**: Track all issued credits
5. **Audit Trail**: View complete history of decisions

## File Structure

```
backend/
├── models/
│   ├── User.js (updated)
│   ├── Credit.js (updated)
│   └── CreditRequest.js (new)
├── routes/
│   ├── producer.js (new)
│   └── certifier.js (new)
└── server.js (updated)

frontend/
├── src/
│   ├── pages/
│   │   ├── ProducerPortal.js (new)
│   │   └── CertifierPortal.js (new)
│   └── components/
│       └── layout/
│           └── Sidebar.js (updated)

blockchain/
└── contracts/
    └── HydrogenCredit.sol (updated)
```

## Security Features

- Role-based access control
- JWT authentication
- File upload validation
- Input sanitization
- Rate limiting
- CORS protection

## Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

### Smart Contract Testing
```bash
cd blockchain
npx hardhat test
```

## Deployment

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

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in .env

2. **File Upload Issues**
   - Check uploads directory permissions
   - Verify file size limits

3. **Blockchain Connection Error**
   - Ensure local blockchain is running
   - Check network configuration

4. **Authentication Issues**
   - Clear browser storage
   - Check JWT secret in .env

## Support

For issues and questions:
1. Check the logs for error messages
2. Verify all dependencies are installed
3. Ensure all services are running
4. Check environment variables

## Future Enhancements

- IPFS integration for file storage
- Advanced analytics and reporting
- Mobile app development
- Multi-chain support
- Advanced compliance features
