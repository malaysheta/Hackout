const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Load environment variables with defaults
require('dotenv').config();

// Set default environment variables if not present
process.env.JWT_SECRET = process.env.JWT_SECRET || 'hydrogen-credits-secret-key-2024';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hydrogen-credits';
process.env.FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

const authRoutes = require('./routes/auth');
const creditRoutes = require('./routes/credits');
const blockchainRoutes = require('./routes/blockchain');
const auditRoutes = require('./routes/audit');
const producerRoutes = require('./routes/producer');
const certifierRoutes = require('./routes/certifier');

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Enhanced CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With', 
    'Accept', 
    'Origin',
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Origin'
  ]
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Increase header size limit and add more CORS headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
});

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hydrogen-credits')
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/credits', creditRoutes);
app.use('/api/blockchain', blockchainRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/producer', producerRoutes);
app.use('/api/certifier', certifierRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test endpoint for debugging
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Backend is working!',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: {
      message: 'Route not found',
      path: req.originalUrl
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});
