const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const multer = require('multer');
const { ethers } = require('ethers');

// Models
const User = require('../models/User');
const Credit = require('../models/Credit');
const CreditRequest = require('../models/CreditRequest');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// @route   GET /api/producer/dashboard
// @desc    Get producer dashboard statistics
// @access  Private (Producer only)
router.get('/dashboard', auth, async (req, res) => {
  try {
    if (req.user.role !== 'PRODUCER') {
      return res.status(403).json({ message: 'Access denied. Producer role required.' });
    }

    res.json({
      credits: {
        totalCredits: 0,
        activeCredits: 0,
        retiredCredits: 0,
        totalHydrogen: 0
      },
      requests: {
        pending: 0,
        approved: 0,
        rejected: 0
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/producer/credits
// @desc    Get producer's credits
// @access  Private (Producer only)
router.get('/credits', auth, async (req, res) => {
  try {
    if (req.user.role !== 'PRODUCER') {
      return res.status(403).json({ message: 'Access denied. Producer role required.' });
    }

    res.json({
      credits: [],
      totalPages: 0,
      currentPage: 1,
      total: 0
    });

  } catch (error) {
    console.error('Get credits error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/producer/requests
// @desc    Get producer's credit requests
// @access  Private (Producer only)
router.get('/requests', auth, async (req, res) => {
  try {
    if (req.user.role !== 'PRODUCER') {
      return res.status(403).json({ message: 'Access denied. Producer role required.' });
    }

    res.json({
      requests: [],
      totalPages: 0,
      currentPage: 1,
      total: 0
    });

  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/producer/test
// @desc    Test endpoint for debugging
// @access  Private (Producer only)
router.get('/test', auth, async (req, res) => {
  try {
    res.json({
      message: 'Producer route is working',
      user: req.user,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test error:', error);
    res.status(500).json({ error: 'Test failed' });
  }
});

// @route   GET /api/producer/certifiers
// @desc    Get list of available certifiers
// @access  Private (Producer only)
router.get('/certifiers', auth, async (req, res) => {
  try {
    if (req.user.role !== 'PRODUCER') {
      return res.status(403).json({ message: 'Access denied. Producer role required.' });
    }

    // Find all active certifiers
    const certifiers = await User.find({ 
      role: 'CERTIFIER', 
      isActive: true 
    }).select('username organization isVerified profile');

    console.log('Found certifiers:', certifiers.length);

    res.json(certifiers);

  } catch (error) {
    console.error('Get certifiers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/producer/requestCredit
// @desc    Submit a new credit request
// @access  Private (Producer only)
router.post('/requestCredit', auth, upload.any(), async (req, res) => {
  try {
    console.log('Request received:', req.body);
    console.log('User:', req.user);
    
    if (req.user.role !== 'PRODUCER') {
      return res.status(403).json({ message: 'Access denied. Producer role required.' });
    }

    const {
      batchId,
      hydrogenProduced,
      energySource,
      startDate,
      endDate,
      plantLocation,
      certifierId,
      energySourceDetails,
      notes
    } = req.body;

    // Validate required fields
    if (!batchId || !hydrogenProduced || !energySource || !startDate || !endDate || !certifierId) {
      return res.status(400).json({ 
        error: 'Missing required fields: batchId, hydrogenProduced, energySource, startDate, endDate, certifierId' 
      });
    }

    // Validate certifier exists
    const certifier = await User.findById(certifierId);
    if (!certifier || certifier.role !== 'CERTIFIER') {
      return res.status(400).json({ error: 'Invalid certifier selected' });
    }

    // Check if batch ID already exists
    const existingRequest = await CreditRequest.findOne({ 'requestData.batchId': batchId });
    if (existingRequest) {
      return res.status(400).json({ error: 'Batch ID already exists' });
    }

    // Parse JSON fields
    let parsedPlantLocation = {};
    let parsedEnergySourceDetails = {};

    try {
      parsedPlantLocation = JSON.parse(plantLocation);
      parsedEnergySourceDetails = JSON.parse(energySourceDetails);
    } catch (error) {
      console.error('JSON parsing error:', error);
      return res.status(400).json({ error: 'Invalid JSON data in form fields' });
    }

    // Create metadata hash
    const metadata = {
      batchId,
      hydrogenProduced: parseFloat(hydrogenProduced),
      energySource,
      productionPeriod: {
        startDate: new Date(startDate),
        endDate: new Date(endDate)
      },
      plantLocation: parsedPlantLocation,
      energySourceDetails: parsedEnergySourceDetails,
      notes,
      submittedAt: new Date().toISOString()
    };

    const metadataString = JSON.stringify(metadata);
    const metadataHash = ethers.keccak256(ethers.toUtf8Bytes(metadataString));

    // Create credit request
    const creditRequest = new CreditRequest({
      producer: req.user.userId,
      certifier: certifierId,
      requestData: {
        batchId,
        hydrogenProduced: parseFloat(hydrogenProduced),
        plantLocation: parsedPlantLocation,
        productionPeriod: {
          startDate: new Date(startDate),
          endDate: new Date(endDate)
        },
        energySource,
        energySourceDetails: parsedEnergySourceDetails
      },
      metadataHash,
      notes
    });

    // Handle file uploads if any
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const fileHash = ethers.keccak256(file.buffer);
        
        if (file.fieldname === 'renewableSourceLogs') {
          creditRequest.proofDocuments.renewableSourceLogs = {
            fileHash: fileHash,
            fileName: file.originalname,
            fileType: file.mimetype,
            uploadDate: new Date()
          };
        } else if (file.fieldname === 'electrolyzerLogs') {
          creditRequest.proofDocuments.electrolyzerLogs = {
            fileHash: fileHash,
            fileName: file.originalname,
            fileType: file.mimetype,
            uploadDate: new Date()
          };
        } else if (file.fieldname === 'powerPurchaseAgreement') {
          creditRequest.proofDocuments.powerPurchaseAgreement = {
            fileHash: fileHash,
            fileName: file.originalname,
            fileType: file.mimetype,
            uploadDate: new Date()
          };
        } else if (file.fieldname === 'certificationDocs') {
          creditRequest.proofDocuments.certificationDocs.push({
            fileHash: fileHash,
            fileName: file.originalname,
            fileType: file.mimetype,
            uploadDate: new Date(),
            documentType: 'certification'
          });
        }
      }
    }

    await creditRequest.save();

    res.status(201).json({
      success: true,
      message: 'Credit request submitted successfully',
      requestId: creditRequest.requestId,
      status: creditRequest.status
    });

  } catch (error) {
    console.error('Submit credit request error:', error);
    res.status(500).json({ 
      error: 'Failed to submit credit request: ' + error.message 
    });
  }
});

// @route   POST /api/producer/transferCredits
// @desc    Transfer credits to another user
// @access  Private (Producer only)
router.post('/transferCredits', auth, async (req, res) => {
  try {
    if (req.user.role !== 'PRODUCER') {
      return res.status(403).json({ message: 'Access denied. Producer role required.' });
    }

    const { creditId, recipientWallet, amount } = req.body;

    // Validate required fields
    if (!creditId || !recipientWallet || !amount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Find recipient user
    const recipient = await User.findOne({ walletAddress: recipientWallet.toLowerCase() });
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    // TODO: Implement blockchain transfer logic here
    // For now, just return success
    res.json({
      message: 'Credit transfer initiated successfully',
      transactionHash: 'demo-tx-hash-' + Date.now()
    });

  } catch (error) {
    console.error('Transfer credits error:', error);
    res.status(500).json({ message: 'Failed to transfer credits' });
  }
});

module.exports = router;
