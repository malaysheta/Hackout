const { ethers } = require('hardhat');
const fs = require('fs');
const path = require('path');

/**
 * Deploy HydrogenCredit contract and update environment variables
 */
async function main() {
  console.log('🚀 Deploying HydrogenCredit Contract...\n');

  try {
    // Get the contract factory
    const HydrogenCredit = await ethers.getContractFactory("HydrogenCredit");
    console.log('✅ Contract factory loaded');

    // Deploy the contract
    console.log('🔧 Deploying contract...');
    const hydrogenCredit = await HydrogenCredit.deploy();
    
    // Wait for deployment to finish
    await hydrogenCredit.waitForDeployment();
    
    const address = await hydrogenCredit.getAddress();
    console.log("✅ HydrogenCredit deployed to:", address);

    // Get signers for role assignment
    const [deployer] = await ethers.getSigners();
    console.log("🔑 Deployer address:", deployer.address);
    
    // Grant roles to deployer for testing
    console.log("🔐 Setting up initial roles...");
    
    const PRODUCER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("PRODUCER_ROLE"));
    const CERTIFIER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("CERTIFIER_ROLE"));
    const CONSUMER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("CONSUMER_ROLE"));
    const REGULATOR_ROLE = ethers.keccak256(ethers.toUtf8Bytes("REGULATOR_ROLE"));

    // Grant roles to deployer
    await hydrogenCredit.grantRole(PRODUCER_ROLE, deployer.address);
    await hydrogenCredit.grantRole(CERTIFIER_ROLE, deployer.address);
    await hydrogenCredit.grantRole(CONSUMER_ROLE, deployer.address);
    
    console.log("✅ Roles granted to deployer");
    
    // Save deployment info
    const deploymentInfo = {
      contractAddress: address,
      deployerAddress: deployer.address,
      network: 'localhost',
      timestamp: new Date().toISOString(),
      roles: {
        PRODUCER_ROLE: PRODUCER_ROLE,
        CERTIFIER_ROLE: CERTIFIER_ROLE,
        CONSUMER_ROLE: CONSUMER_ROLE,
        REGULATOR_ROLE: REGULATOR_ROLE
      }
    };
    
    console.log("📄 Deployment Info:", JSON.stringify(deploymentInfo, null, 2));
    
    // Update backend .env file with contract address
    const backendEnvPath = path.join(__dirname, '..', 'backend', '.env');
    let envContent = '';
    
    if (fs.existsSync(backendEnvPath)) {
      envContent = fs.readFileSync(backendEnvPath, 'utf8');
    }
    
    // Update or add CONTRACT_ADDRESS
    const contractAddressLine = `CONTRACT_ADDRESS=${address}`;
    if (envContent.includes('CONTRACT_ADDRESS=')) {
      envContent = envContent.replace(/CONTRACT_ADDRESS=.*/g, contractAddressLine);
    } else {
      envContent += `\n${contractAddressLine}`;
    }
    
    // Add blockchain configuration if not present
    if (!envContent.includes('BLOCKCHAIN_NETWORK=')) {
      envContent += `\nBLOCKCHAIN_NETWORK=localhost`;
    }
    if (!envContent.includes('BLOCKCHAIN_RPC_URL=')) {
      envContent += `\nBLOCKCHAIN_RPC_URL=http://127.0.0.1:8545`;
    }
    if (!envContent.includes('BLOCKCHAIN_PRIVATE_KEY=')) {
      envContent += `\nBLOCKCHAIN_PRIVATE_KEY=${deployer.privateKey}`;
    }
    
    fs.writeFileSync(backendEnvPath, envContent);
    console.log('✅ Updated backend .env file with contract address and blockchain config');
    
    // Save deployment info to file
    const deploymentPath = path.join(__dirname, 'deployment.json');
    fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
    console.log('✅ Saved deployment info to deployment.json');
    
    console.log('\n🎉 Contract Deployment Complete!');
    console.log('📊 Contract Address:', address);
    console.log('🔗 Node running on: http://localhost:8545');
    console.log('💡 Backend .env file updated automatically');
    console.log('🚀 You can now start the backend and frontend');
    
  } catch (error) {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  }
}

// Run the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
