const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const deployments = require("../deployments/mstTestnet.json");

  const AuthorityRegistry = await hre.ethers.getContractFactory("AuthorityRegistry");
  const authorityRegistry = AuthorityRegistry.attach(deployments.contracts.AuthorityRegistry);

  const CARBON_AUDITOR_ROLE = await authorityRegistry.CARBON_AUDITOR_ROLE();
  const LAND_REGISTRAR_ROLE = await authorityRegistry.LAND_REGISTRAR_ROLE();

  console.log("Granting CARBON_AUDITOR_ROLE to Deployer...");
  const tx1 = await authorityRegistry.grantRole(CARBON_AUDITOR_ROLE, deployer.address);
  await tx1.wait();
  console.log("Granted CARBON_AUDITOR_ROLE!");

  console.log("Granting LAND_REGISTRAR_ROLE to Deployer...");
  const tx2 = await authorityRegistry.grantRole(LAND_REGISTRAR_ROLE, deployer.address);
  await tx2.wait();
  console.log("Granted LAND_REGISTRAR_ROLE!");

  console.log("Deployer now holds all 3 institutional roles on MST Testnet!");
}

main().catch(console.error);
