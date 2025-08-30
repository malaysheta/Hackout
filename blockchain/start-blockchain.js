const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

/**
 * Start local blockchain - MANDATORY for system operation
 */
async function startBlockchain() {
  console.log('🚀 Starting Local Blockchain - MANDATORY...\n');

  try {
    // Check if Hardhat is installed
    const hardhatConfigPath = path.join(__dirname, 'hardhat.config.js');
    if (!fs.existsSync(hardhatConfigPath)) {
      console.log('❌ Hardhat configuration not found');
      console.log('Please run: npm install --save-dev hardhat');
      console.log('❌ BLOCKCHAIN IS MANDATORY - System cannot function without blockchain');
      process.exit(1);
    }

    // Start local blockchain
    console.log('1️⃣ Starting local Hardhat network...');
    
    // This would typically start a Hardhat node
    // For now, we'll just check if the configuration exists
    console.log('✅ Hardhat configuration found');
    console.log('📋 MANDATORY: Start blockchain manually:');
    console.log('   cd blockchain');
    console.log('   npx hardhat node');
    console.log('   npx hardhat run scripts/deploy.js --network localhost');

    // Check if contract artifacts exist
    const artifactsPath = path.join(__dirname, 'artifacts/contracts/HydrogenCredit.sol/HydrogenCredit.json');
    if (fs.existsSync(artifactsPath)) {
      console.log('✅ Contract artifacts found');
    } else {
      console.log('❌ Contract artifacts not found');
      console.log('Please compile contracts: npx hardhat compile');
      console.log('❌ BLOCKCHAIN IS MANDATORY - System cannot function without compiled contracts');
      process.exit(1);
    }

    console.log('\n🎯 Blockchain Setup Complete!');
    console.log('\n📋 MANDATORY Next Steps:');
    console.log('1. Start blockchain: cd blockchain && npx hardhat node');
    console.log('2. Deploy contract: npx hardhat run scripts/deploy.js --network localhost');
    console.log('3. Copy contract address to backend .env file');
    console.log('4. Start backend: cd backend && npm start');
    console.log('\n⚠️ WARNING: System will NOT work without blockchain!');

  } catch (error) {
    console.error('❌ Failed to start blockchain:', error.message);
    console.error('❌ BLOCKCHAIN IS MANDATORY - System cannot function without blockchain');
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  startBlockchain();
}

module.exports = { startBlockchain };

