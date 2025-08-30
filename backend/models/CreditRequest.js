const mongoose = require('mongoose');

const creditRequestSchema = new mongoose.Schema({
  requestId: {
    type: String,
    unique: true,
    index: true
  },
  producer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  certifier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'BLOCKCHAIN_PENDING'],
    default: 'PENDING',
    index: true
  },
  requestData: {
    batchId: {
      type: String,
      required: true,
      unique: true
    },
    hydrogenProduced: {
      type: Number,
      required: true,
      min: 0
    },
    plantLocation: {
      name: String,
      address: String,
      latitude: Number,
      longitude: Number,
      country: String,
      state: String,
      city: String
    },
    productionPeriod: {
      startDate: {
        type: Date,
        required: true
      },
      endDate: {
        type: Date,
        required: true
      }
    },
    energySource: {
      type: String,
      required: true,
      enum: ['Solar', 'Wind', 'Hydro', 'Geothermal', 'Biomass', 'Nuclear', 'Other']
    },
    energySourceDetails: {
      capacity: Number, // MW
      efficiency: Number, // percentage
      renewablePercentage: Number // percentage
    }
  },
  proofDocuments: {
    renewableSourceLogs: {
      fileHash: String,
      fileName: String,
      fileType: String,
      uploadDate: Date
    },
    electrolyzerLogs: {
      fileHash: String,
      fileName: String,
      fileType: String,
      uploadDate: Date
    },
    powerPurchaseAgreement: {
      fileHash: String,
      fileName: String,
      fileType: String,
      uploadDate: Date
    },
    certificationDocs: [{
      fileHash: String,
      fileName: String,
      fileType: String,
      uploadDate: Date,
      documentType: String
    }]
  },
  metadataHash: {
    type: String,
    required: true
  },
  blockchainData: {
    transactionHash: String,
    blockNumber: Number,
    gasUsed: Number,
    creditId: Number,
    isOnBlockchain: {
      type: Boolean,
      default: false
    },
    blockchainStatus: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'FAILED'],
      default: 'PENDING'
    }
  },
  reviewDetails: {
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewDate: Date,
    reviewNotes: String,
    rejectionReason: String,
    blockchainTxHash: String
  },
  creditDetails: {
    creditId: Number,
    creditAmount: Number,
    issuedDate: Date
  },
  complianceChecks: {
    renewableEnergyVerified: {
      type: Boolean,
      default: false
    },
    electrolyzerEfficiencyVerified: {
      type: Boolean,
      default: false
    },
    documentationComplete: {
      type: Boolean,
      default: false
    },
    regulatoryCompliance: {
      type: Boolean,
      default: false
    }
  },
  tags: [String],
  notes: String
}, {
  timestamps: true
});

// Indexes for better query performance
creditRequestSchema.index({ producer: 1 });
creditRequestSchema.index({ certifier: 1 });
creditRequestSchema.index({ createdAt: -1 });

// Pre-save middleware to generate requestId
creditRequestSchema.pre('save', function(next) {
  if (!this.requestId) {
    this.requestId = `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  next();
});

// Method to approve request
creditRequestSchema.methods.approve = function(reviewer, notes, txHash, creditId, creditAmount) {
  this.status = 'APPROVED';
  this.reviewDetails = {
    reviewedBy: reviewer,
    reviewDate: new Date(),
    reviewNotes: notes,
    blockchainTxHash: txHash
  };
  this.creditDetails = {
    creditId: creditId,
    creditAmount: creditAmount,
    issuedDate: new Date()
  };
  return this.save();
};

// Method to reject request
creditRequestSchema.methods.reject = function(reviewer, reason, notes) {
  this.status = 'REJECTED';
  this.reviewDetails = {
    reviewedBy: reviewer,
    reviewDate: new Date(),
    reviewNotes: notes,
    rejectionReason: reason
  };
  return this.save();
};

// Static method to find pending requests
creditRequestSchema.statics.findPending = function() {
  return this.find({ status: 'PENDING' })
    .populate('producer', 'username organization email')
    .populate('certifier', 'username organization email')
    .sort({ createdAt: -1 });
};

// Static method to find requests by producer
creditRequestSchema.statics.findByProducer = function(producerId) {
  return this.find({ producer: producerId })
    .populate('certifier', 'username organization')
    .sort({ createdAt: -1 });
};

// Static method to find requests by certifier
creditRequestSchema.statics.findByCertifier = function(certifierId) {
  return this.find({ certifier: certifierId })
    .populate('producer', 'username organization')
    .sort({ createdAt: -1 });
};

// Static method to get request statistics
creditRequestSchema.statics.getStatistics = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalHydrogen: { $sum: '$requestData.hydrogenProduced' }
      }
    }
  ]);
};

module.exports = mongoose.model('CreditRequest', creditRequestSchema);
