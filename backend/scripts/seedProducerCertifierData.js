const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Models
const User = require('../models/User');
const CreditRequest = require('../models/CreditRequest');
const Credit = require('../models/Credit');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hydrogen-credits')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const seedData = async () => {
  try {
    console.log('🌱 Starting to seed Producer and Certifier data...');

         // Clear existing data
     await User.deleteMany({});
     await CreditRequest.deleteMany({});
     await Credit.deleteMany({});

    console.log('🗑️ Cleared existing data');

    // Create Certifiers
    const certifiers = await User.create([
      {
        username: 'certifier1',
        email: 'certifier1@example.com',
        password: 'password123',
        walletAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        role: 'CERTIFIER',
        organization: 'Green Energy Certifiers Inc.',
        isVerified: true,
        profile: {
          firstName: 'John',
          lastName: 'Certifier',
          phone: '+1-555-0123',
          address: {
            street: '123 Certification Ave',
            city: 'Certification City',
            state: 'CA',
            country: 'USA',
            zipCode: '90210'
          },
          website: 'https://gecertifiers.com',
          description: 'Leading certifier for green hydrogen projects'
        }
      },
      {
        username: 'certifier2',
        email: 'certifier2@example.com',
        password: 'password123',
        walletAddress: '0x8ba1f109551bD432803012645Hac136c772c3c3',
        role: 'CERTIFIER',
        organization: 'Sustainable Energy Authority',
        isVerified: true,
        profile: {
          firstName: 'Sarah',
          lastName: 'Validator',
          phone: '+1-555-0456',
          address: {
            street: '456 Validation Blvd',
            city: 'Validation Town',
            state: 'NY',
            country: 'USA',
            zipCode: '10001'
          },
          website: 'https://sustainableenergy.org',
          description: 'Government-certified energy validator'
        }
      }
    ]);

    console.log('✅ Created certifiers:', certifiers.length);

    // Create Producers
    const producers = await User.create([
      {
        username: 'producer1',
        email: 'producer1@example.com',
        password: 'password123',
                 walletAddress: '0x1234567890123456789012345678901234567891',
        role: 'PRODUCER',
        organization: 'Solar Hydrogen Corp',
        isVerified: true,
        profile: {
          firstName: 'Mike',
          lastName: 'Producer',
          phone: '+1-555-0789',
          address: {
            street: '789 Production St',
            city: 'Production City',
            state: 'TX',
            country: 'USA',
            zipCode: '75001'
          },
          website: 'https://solarhydrogen.com',
          description: 'Leading solar-powered hydrogen producer'
        }
      },
      {
        username: 'producer2',
        email: 'producer2@example.com',
        password: 'password123',
                 walletAddress: '0x2345678901234567890123456789012345678902',
        role: 'PRODUCER',
        organization: 'Wind Energy Solutions',
        isVerified: true,
        profile: {
          firstName: 'Lisa',
          lastName: 'Windmill',
          phone: '+1-555-0124',
          address: {
            street: '321 Wind Farm Rd',
            city: 'Wind City',
            state: 'WA',
            country: 'USA',
            zipCode: '98001'
          },
          website: 'https://windenergy.com',
          description: 'Wind-powered hydrogen production facility'
        }
      },
      {
        username: 'producer3',
        email: 'producer3@example.com',
        password: 'password123',
                 walletAddress: '0x3456789012345678901234567890123456789013',
        role: 'PRODUCER',
        organization: 'Hydro Power Ltd',
        isVerified: false,
        profile: {
          firstName: 'David',
          lastName: 'Hydro',
          phone: '+1-555-0567',
          address: {
            street: '654 River Way',
            city: 'River City',
            state: 'OR',
            country: 'USA',
            zipCode: '97001'
          },
          website: 'https://hydropower.com',
          description: 'Hydroelectric hydrogen production'
        }
      }
    ]);

    console.log('✅ Created producers:', producers.length);

    // Create Credit Requests
    const creditRequests = await CreditRequest.create([
      {
        producer: producers[0]._id,
        certifier: certifiers[0]._id,
        status: 'PENDING',
        requestData: {
          batchId: 'BATCH-2024-001',
          hydrogenProduced: 1000,
          plantLocation: {
            name: 'Solar Farm Alpha',
            address: '123 Solar Street, Production City, TX',
            latitude: 32.7767,
            longitude: -96.7970,
            country: 'USA',
            state: 'TX',
            city: 'Production City'
          },
          productionPeriod: {
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-01-31')
          },
          energySource: 'Solar',
          energySourceDetails: {
            capacity: 50,
            efficiency: 85,
            renewablePercentage: 100
          }
        },
        proofDocuments: {
          renewableSourceLogs: {
            fileHash: 'abc123def456',
            fileName: 'solar_logs_jan2024.csv',
            fileType: 'text/csv',
            uploadDate: new Date()
          },
          electrolyzerLogs: {
            fileHash: 'def456ghi789',
            fileName: 'electrolyzer_logs_jan2024.csv',
            fileType: 'text/csv',
            uploadDate: new Date()
          },
          powerPurchaseAgreement: {
            fileHash: 'ghi789jkl012',
            fileName: 'ppa_solar_2024.pdf',
            fileType: 'application/pdf',
            uploadDate: new Date()
          },
          certificationDocs: [
            {
              fileHash: 'jkl012mno345',
              fileName: 'iso_certification.pdf',
              fileType: 'application/pdf',
              uploadDate: new Date(),
              documentType: 'ISO Certification'
            }
          ]
        },
        metadataHash: 'metadata_hash_001',
        notes: 'First batch of solar hydrogen production'
      },
      {
        producer: producers[1]._id,
        certifier: certifiers[1]._id,
        status: 'APPROVED',
        requestData: {
          batchId: 'BATCH-2024-002',
          hydrogenProduced: 1500,
          plantLocation: {
            name: 'Wind Farm Beta',
            address: '456 Wind Avenue, Wind City, WA',
            latitude: 47.6062,
            longitude: -122.3321,
            country: 'USA',
            state: 'WA',
            city: 'Wind City'
          },
          productionPeriod: {
            startDate: new Date('2024-02-01'),
            endDate: new Date('2024-02-29')
          },
          energySource: 'Wind',
          energySourceDetails: {
            capacity: 75,
            efficiency: 90,
            renewablePercentage: 100
          }
        },
        proofDocuments: {
          renewableSourceLogs: {
            fileHash: 'mno345pqr678',
            fileName: 'wind_logs_feb2024.csv',
            fileType: 'text/csv',
            uploadDate: new Date()
          },
          electrolyzerLogs: {
            fileHash: 'pqr678stu901',
            fileName: 'electrolyzer_logs_feb2024.csv',
            fileType: 'text/csv',
            uploadDate: new Date()
          },
          powerPurchaseAgreement: {
            fileHash: 'stu901vwx234',
            fileName: 'ppa_wind_2024.pdf',
            fileType: 'application/pdf',
            uploadDate: new Date()
          },
          certificationDocs: [
            {
              fileHash: 'vwx234yza567',
              fileName: 'wind_certification.pdf',
              fileType: 'application/pdf',
              uploadDate: new Date(),
              documentType: 'Wind Energy Certification'
            }
          ]
        },
        metadataHash: 'metadata_hash_002',
        reviewDetails: {
          reviewedBy: certifiers[1]._id,
          reviewDate: new Date(),
          reviewNotes: 'All documentation verified. Production meets standards.',
          blockchainTxHash: '0x1234567890abcdef1234567890abcdef12345678'
        },
        creditDetails: {
          creditId: 1,
          creditAmount: 1500,
          issuedDate: new Date()
        },
        complianceChecks: {
          renewableEnergyVerified: true,
          electrolyzerEfficiencyVerified: true,
          documentationComplete: true,
          regulatoryCompliance: true
        },
        notes: 'Wind-powered hydrogen production - approved'
      },
      {
        producer: producers[2]._id,
        certifier: certifiers[0]._id,
        status: 'REJECTED',
        requestData: {
          batchId: 'BATCH-2024-003',
          hydrogenProduced: 800,
          plantLocation: {
            name: 'Hydro Plant Gamma',
            address: '789 River Road, River City, OR',
            latitude: 45.5152,
            longitude: -122.6784,
            country: 'USA',
            state: 'OR',
            city: 'River City'
          },
          productionPeriod: {
            startDate: new Date('2024-03-01'),
            endDate: new Date('2024-03-31')
          },
          energySource: 'Hydro',
          energySourceDetails: {
            capacity: 30,
            efficiency: 80,
            renewablePercentage: 100
          }
        },
        proofDocuments: {
          renewableSourceLogs: {
            fileHash: 'yza567bcd890',
            fileName: 'hydro_logs_mar2024.csv',
            fileType: 'text/csv',
            uploadDate: new Date()
          },
          electrolyzerLogs: {
            fileHash: 'bcd890efg123',
            fileName: 'electrolyzer_logs_mar2024.csv',
            fileType: 'text/csv',
            uploadDate: new Date()
          }
        },
        metadataHash: 'metadata_hash_003',
        reviewDetails: {
          reviewedBy: certifiers[0]._id,
          reviewDate: new Date(),
          reviewNotes: 'Incomplete documentation provided.',
          rejectionReason: 'Missing power purchase agreement and certification documents'
        },
        notes: 'Hydroelectric hydrogen production - rejected due to incomplete docs'
      }
    ]);

    console.log('✅ Created credit requests:', creditRequests.length);

    // Create Credits for approved requests
    const credits = await Credit.create([
      {
        creditId: 1,
        blockchainTxHash: '0x1234567890abcdef1234567890abcdef12345678',
        producer: producers[1]._id,
        certifier: certifiers[1]._id,
        renewableSourceType: 'Wind',
        hydrogenAmount: 1500,
        creditAmount: 1500,
        metadataHash: 'metadata_hash_002',
        detailedMetadata: {
          productionFacility: {
            name: 'Wind Farm Beta',
            location: {
              latitude: 47.6062,
              longitude: -122.3321,
              address: '456 Wind Avenue, Wind City, WA'
            },
            capacity: 75,
            efficiency: 90
          },
          productionDetails: {
            startDate: new Date('2024-02-01'),
            endDate: new Date('2024-02-29'),
            totalEnergyConsumed: 15000,
            renewableEnergyPercentage: 100,
            carbonIntensity: 0,
            certificationStandards: ['ISO 14001', 'Wind Energy Standard']
          },
          environmentalImpact: {
            co2Avoided: 15000,
            waterSaved: 3000,
            landUse: 50
          },
          qualityMetrics: {
            purity: 99.9,
            pressure: 350,
            temperature: 25,
            contaminants: []
          }
        },
        status: 'ISSUED',
        currentOwner: producers[1]._id,
        currentBalance: 1500,
        ownershipHistory: [
          {
            owner: producers[1]._id,
            amount: 1500,
            transactionHash: '0x1234567890abcdef1234567890abcdef12345678',
            timestamp: new Date(),
            type: 'ISSUE'
          }
        ]
      }
    ]);

    console.log('✅ Created credits:', credits.length);

    console.log('🎉 Seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Certifiers: ${certifiers.length}`);
    console.log(`- Producers: ${producers.length}`);
    console.log(`- Credit Requests: ${creditRequests.length}`);
    console.log(`- Credits: ${credits.length}`);

    console.log('\n🔑 Test Accounts:');
    console.log('Certifier 1: certifier1@example.com / password123');
    console.log('Certifier 2: certifier2@example.com / password123');
    console.log('Producer 1: producer1@example.com / password123');
    console.log('Producer 2: producer2@example.com / password123');
    console.log('Producer 3: producer3@example.com / password123');

  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seeding
seedData();
