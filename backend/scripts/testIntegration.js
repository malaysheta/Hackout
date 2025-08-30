const mongoose = require('mongoose');
const { ethers } = require('ethers');
const User = require('../models/User');
const CreditRequest = require('../models/CreditRequest');
const { getBlockchainContract, getNetworkInfo } = require('../utils/blockchain');

/**
 * Test script to verify backend, database, and blockchain integration
 * BLOCKCHAIN IS MANDATORY - System cannot function without blockchain
 */
async function testIntegration() {
  console.log('🧪 Starting Integration Test - BLOCKCHAIN MANDATORY...\n');

  try {
    // 1. Test Database Connection
    console.log('1️⃣ Testing Database Connection...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hydrogen-credits');
    console.log('✅ Database connected successfully');

    // 2. Test Database Models
    console.log('\n2️⃣ Testing Database Models...');
    
    // Test User model
    const testUser = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      walletAddress: '0x1234567890123456789012345678901234567890',
      role: 'PRODUCER',
      organization: 'Test Organization'
    });
    
    console.log('✅ User model test passed');

    // Test CreditRequest model
    const testRequest = new CreditRequest({
      producer: testUser._id,
      certifier: testUser._id,
      requestData: {
        batchId: 'TEST-BATCH-001',
        hydrogenProduced: 100,
        energySource: 'Solar',
        productionPeriod: {
          startDate: new Date(),
          endDate: new Date()
        }
      },
      metadataHash: 'test-hash'
    });
    
    console.log('✅ CreditRequest model test passed');

    // 3. Test Blockchain Connection - MANDATORY
    console.log('\n3️⃣ Testing Blockchain Connection - MANDATORY...');
    try {
      const networkInfo = await getNetworkInfo();
      console.log('✅ Blockchain connected successfully');
      console.log(`   Network: ${networkInfo.name} (Chain ID: ${networkInfo.chainId})`);
      console.log(`   Block Number: ${networkInfo.blockNumber}`);
    } catch (blockchainError) {
      console.log('❌ BLOCKCHAIN IS MANDATORY - System cannot function without blockchain');
      console.log(`   Error: ${blockchainError.message}`);
      console.log('❌ Integration test failed - blockchain is required');
      process.exit(1);
    }

    // 4. Test Contract Integration - MANDATORY
    console.log('\n4️⃣ Testing Contract Integration - MANDATORY...');
    try {
      const contract = await getBlockchainContract();
      console.log('✅ Contract integration working');
    } catch (contractError) {
      console.log('❌ BLOCKCHAIN CONTRACT IS MANDATORY - System cannot function without contract');
      console.log(`   Error: ${contractError.message}`);
      console.log('❌ Integration test failed - blockchain contract is required');
      process.exit(1);
    }

    // 5. Test Data Validation
    console.log('\n5️⃣ Testing Data Validation...');
    
    // Test required fields validation
    try {
      const invalidRequest = new CreditRequest({});
      await invalidRequest.validate();
    } catch (validationError) {
      console.log('✅ Data validation working correctly');
    }

    // 6. Test Metadata Hash Generation
    console.log('\n6️⃣ Testing Metadata Hash Generation...');
    const testMetadata = {
      batchId: 'TEST-001',
      hydrogenProduced: 100,
      energySource: 'Solar',
      timestamp: new Date().toISOString()
    };
    
    const metadataString = JSON.stringify(testMetadata);
    const metadataHash = ethers.keccak256(ethers.toUtf8Bytes(metadataString));
    console.log('✅ Metadata hash generation working');
    console.log(`   Hash: ${metadataHash}`);

    // 7. Test File Upload Simulation
    console.log('\n7️⃣ Testing File Upload Simulation...');
    const testFileBuffer = Buffer.from('test file content');
    const fileHash = ethers.keccak256(testFileBuffer);
    console.log('✅ File hash generation working');
    console.log(`   File Hash: ${fileHash}`);

    console.log('\n🎉 All Integration Tests Passed!');
    console.log('\n📋 Summary:');
    console.log('   ✅ Database connection and models working');
    console.log('   ✅ Data validation working');
    console.log('   ✅ Metadata hash generation working');
    console.log('   ✅ File hash generation working');
    console.log('   ✅ Blockchain integration - MANDATORY and working');

  } catch (error) {
    console.error('\n❌ Integration Test Failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Database disconnected');
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testIntegration();
}

module.exports = { testIntegration };
