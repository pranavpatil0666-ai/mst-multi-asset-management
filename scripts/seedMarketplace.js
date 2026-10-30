const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const deployments = require("../deployments/mstTestnet.json");

  console.log("Listing Carbon Credits on Universal Marketplace...");
  const CarbonBatch = await hre.ethers.getContractFactory("CarbonCreditBatch");
  const carbonBatch = CarbonBatch.attach(deployments.contracts.CarbonCreditBatch);

  const Marketplace = await hre.ethers.getContractFactory("UniversalMarketplace");
  const marketplace = Marketplace.attach(deployments.contracts.UniversalMarketplace);

  const approveTx = await carbonBatch.setApprovalForAll(deployments.contracts.UniversalMarketplace, true);
  await approveTx.wait();
  console.log("-> Approved Marketplace!");

  const pricePerTonne = hre.ethers.parseEther("0.05"); // 0.05 MSTC per tonne
  const listTx = await marketplace.listERC1155(
    deployments.contracts.CarbonCreditBatch,
    1, // batch token id 1
    1000, // 1,000 tonnes
    pricePerTonne
  );
  await listTx.wait();
  console.log("-> Successfully listed 1,000 Carbon Credits on Universal Marketplace on MST Testnet!");
}

main().catch(console.error);
