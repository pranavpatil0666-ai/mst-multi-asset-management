const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const network = await hre.ethers.provider.getNetwork();

  console.log("==================================================");
  console.log("Deploying Universal Multi-Asset System on MST Blockchain");
  console.log(`Network Name:  ${hre.network.name}`);
  console.log(`Chain ID:      ${network.chainId}`);
  console.log(`Deployer:      ${deployer.address}`);
  console.log(`Balance:       ${hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address))} MSTC`);
  console.log("==================================================\n");

  // 1. Deploy AuthorityRegistry
  console.log("1. Deploying AuthorityRegistry...");
  const AuthorityRegistry = await hre.ethers.getContractFactory("AuthorityRegistry");
  const authorityRegistry = await AuthorityRegistry.deploy(deployer.address);
  await authorityRegistry.waitForDeployment();
  const authorityRegistryAddress = await authorityRegistry.getAddress();
  console.log(`   -> AuthorityRegistry deployed at: ${authorityRegistryAddress}`);

  // 2. Deploy AcademicDegreeCertificate
  console.log("2. Deploying AcademicDegreeCertificate...");
  const AcademicDegreeCertificate = await hre.ethers.getContractFactory("AcademicDegreeCertificate");
  const degreeContract = await AcademicDegreeCertificate.deploy(authorityRegistryAddress);
  await degreeContract.waitForDeployment();
  const degreeContractAddress = await degreeContract.getAddress();
  console.log(`   -> AcademicDegreeCertificate deployed at: ${degreeContractAddress}`);

  // 3. Deploy Carbon Contracts
  console.log("3. Deploying CarbonCreditBatch...");
  const CarbonCreditBatch = await hre.ethers.getContractFactory("CarbonCreditBatch");
  const carbonCreditBatch = await CarbonCreditBatch.deploy(authorityRegistryAddress);
  await carbonCreditBatch.waitForDeployment();
  const carbonCreditBatchAddress = await carbonCreditBatch.getAddress();
  console.log(`   -> CarbonCreditBatch deployed at: ${carbonCreditBatchAddress}`);

  console.log("4. Deploying CarbonRetirementReceipt...");
  const CarbonRetirementReceipt = await hre.ethers.getContractFactory("CarbonRetirementReceipt");
  const carbonReceipt = await CarbonRetirementReceipt.deploy(carbonCreditBatchAddress);
  await carbonReceipt.waitForDeployment();
  const carbonReceiptAddress = await carbonReceipt.getAddress();
  console.log(`   -> CarbonRetirementReceipt deployed at: ${carbonReceiptAddress}`);

  // Link receipt contract in CarbonCreditBatch
  const setReceiptTx = await carbonCreditBatch.setRetirementReceiptContract(carbonReceiptAddress);
  await setReceiptTx.wait();
  console.log("   -> Linked CarbonRetirementReceipt with CarbonCreditBatch");

  // 5. Deploy LandOwnershipTitle
  console.log("5. Deploying LandOwnershipTitle...");
  const LandOwnershipTitle = await hre.ethers.getContractFactory("LandOwnershipTitle");
  const landTitle = await LandOwnershipTitle.deploy(authorityRegistryAddress);
  await landTitle.waitForDeployment();
  const landTitleAddress = await landTitle.getAddress();
  console.log(`   -> LandOwnershipTitle deployed at: ${landTitleAddress}`);

  // 6. Deploy UniversalAssetManager
  console.log("6. Deploying UniversalAssetManager...");
  const UniversalAssetManager = await hre.ethers.getContractFactory("UniversalAssetManager");
  const assetManager = await UniversalAssetManager.deploy(
    authorityRegistryAddress,
    degreeContractAddress,
    carbonCreditBatchAddress,
    carbonReceiptAddress,
    landTitleAddress
  );
  await assetManager.waitForDeployment();
  const assetManagerAddress = await assetManager.getAddress();
  console.log(`   -> UniversalAssetManager deployed at: ${assetManagerAddress}`);

  // 7. Deploy UniversalMarketplace
  console.log("7. Deploying UniversalMarketplace...");
  const UniversalMarketplace = await hre.ethers.getContractFactory("UniversalMarketplace");
  const marketplace = await UniversalMarketplace.deploy(deployer.address);
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log(`   -> UniversalMarketplace deployed at: ${marketplaceAddress}`);

  // Save deployment addresses to JSON file
  const deploymentInfo = {
    network: hre.network.name,
    chainId: Number(network.chainId),
    deployedAt: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {
      AuthorityRegistry: authorityRegistryAddress,
      AcademicDegreeCertificate: degreeContractAddress,
      CarbonCreditBatch: carbonCreditBatchAddress,
      CarbonRetirementReceipt: carbonReceiptAddress,
      LandOwnershipTitle: landTitleAddress,
      UniversalAssetManager: assetManagerAddress,
      UniversalMarketplace: marketplaceAddress
    }
  };

  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const outputPath = path.join(deploymentsDir, `${hre.network.name}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(deploymentInfo, null, 2));

  console.log("\n==================================================");
  console.log(`Deployment metadata saved to: ${outputPath}`);
  console.log("System initialization completed successfully!");
  console.log("==================================================");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
