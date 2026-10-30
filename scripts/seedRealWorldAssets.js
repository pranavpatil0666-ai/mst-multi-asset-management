const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const deployments = require("../deployments/mstTestnet.json");

  console.log("Seeding live initial assets on MST Testnet...");
  console.log("Deployer:", deployer.address);

  const Degree = await hre.ethers.getContractFactory("AcademicDegreeCertificate");
  const degreeContract = Degree.attach(deployments.contracts.AcademicDegreeCertificate);

  const CarbonBatch = await hre.ethers.getContractFactory("CarbonCreditBatch");
  const carbonBatch = CarbonBatch.attach(deployments.contracts.CarbonCreditBatch);

  const LandTitle = await hre.ethers.getContractFactory("LandOwnershipTitle");
  const landTitle = LandTitle.attach(deployments.contracts.LandOwnershipTitle);

  const Marketplace = await hre.ethers.getContractFactory("UniversalMarketplace");
  const marketplace = Marketplace.attach(deployments.contracts.UniversalMarketplace);

  // 1. Issue a Degree
  console.log("1. Issuing sample Degree to Deployer...");
  const studentIdHash = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("STU-2026-MST-001"));
  const tx1 = await degreeContract.issueDegree({
    student: deployer.address,
    studentName: "Pranav Patil",
    studentIdHash: studentIdHash,
    degreeName: "Bachelor of Science in Computer Science",
    major: "Blockchain Engineering & Distributed Systems",
    graduationDate: "2026-06-15",
    transcriptIpfsUri: "ipfs://QmYWfdESkjNhqfevZHfaqkBKzHaJRqr3QHkkf4pbQrCatv",
  });
  await tx1.wait();
  console.log("-> Degree issued on MST Testnet!");

  // 2. Create Carbon Batch
  console.log("2. Creating Carbon Credit Batch...");
  const tx2 = await carbonBatch.createAndMintBatch({
    recipient: deployer.address,
    projectId: "VCS-PROJECT-789",
    standard: "Verra VCS",
    methodology: "VM0007 / REDD+ Forest Conservation",
    vintageYear: 2025,
    countryCode: "IND",
    tonnes: 5000,
    auditReportIpfsUri: "ipfs://QmYWfdESkjNhqfevZHfaqkBKzHaJRqr3QHkkf4pbQrCatv",
  });
  await tx2.wait();
  console.log("-> Carbon Credit Batch (5,000 tonnes) minted on MST Testnet!");

  // 3. Register Land Title
  console.log("3. Registering Cadastral Land Title...");
  const tx3 = await landTitle.registerLand({
    owner: deployer.address,
    parcelIdentifier: "PARCEL-MST-PUN-2026-89A",
    jurisdiction: "Maharashtra State Jurisdiction",
    coordinatesPolygon: "[[18.5204, 73.8567], [18.5210, 73.8575], [18.5195, 73.8580]]",
    areaSquareMeters: 12500,
    deedRegistryHash: "0x9876543210abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
    deedDocumentIpfsUri: "ipfs://QmYWfdESkjNhqfevZHfaqkBKzHaJRqr3QHkkf4pbQrCatv",
  });
  await tx3.wait();
  console.log("-> Land Title registered on MST Testnet!");

  // 4. List Carbon Credits on Marketplace
  console.log("4. Listing 1,000 Carbon Credits on Universal Marketplace...");
  const approveTx = await carbonBatch.setApprovalForAll(deployments.contracts.UniversalMarketplace, true);
  await approveTx.wait();

  const pricePerTonne = hre.ethers.parseEther("0.05"); // 0.05 MSTC per tonne
  const listTx = await marketplace.listItem(
    deployments.contracts.CarbonCreditBatch,
    1, // batch token id 1
    1000, // 1,000 tonnes
    pricePerTonne,
    1 // ERC1155
  );
  await listTx.wait();
  console.log("-> Carbon Credits listed on Marketplace!");

  console.log("\n==================================================");
  console.log("ALL REAL-WORLD ON-CHAIN ASSETS LIVE ON MST TESTNET!");
  console.log("==================================================");
}

main().catch(console.error);
