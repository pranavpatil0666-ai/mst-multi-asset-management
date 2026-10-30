const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const deployments = require("../deployments/mstTestnet.json");

  console.log("Setting up real-world institutional authorities on MST Testnet...");
  console.log("Deployer:", deployer.address);
  console.log("AuthorityRegistry:", deployments.contracts.AuthorityRegistry);

  const AuthorityRegistry = await hre.ethers.getContractFactory("AuthorityRegistry");
  const authorityRegistry = AuthorityRegistry.attach(deployments.contracts.AuthorityRegistry);

  const UNIVERSITY_ROLE = await authorityRegistry.UNIVERSITY_ROLE();
  const CARBON_AUDITOR_ROLE = await authorityRegistry.CARBON_AUDITOR_ROLE();
  const LAND_REGISTRAR_ROLE = await authorityRegistry.LAND_REGISTRAR_ROLE();

  // 1. Register Deployer as University
  try {
    const tx1 = await authorityRegistry.registerAuthority(
      deployer.address,
      UNIVERSITY_ROLE,
      "MST National University",
      "Global",
      "https://mstblockchain.com",
      "EDU-MST-2026-001"
    );
    await tx1.wait();
    console.log("Registered Deployer as UNIVERSITY_ROLE");
  } catch (e) {
    console.log("Deployer already registered or error:", e.message);
  }

  // 2. Register Deployer as Carbon Auditor
  try {
    const tx2 = await authorityRegistry.registerAuthority(
      deployer.address,
      CARBON_AUDITOR_ROLE,
      "Global Carbon Audit Standard",
      "International",
      "https://verra.org",
      "AUDIT-VCS-2026"
    );
    await tx2.wait();
    console.log("Registered Deployer as CARBON_AUDITOR_ROLE");
  } catch (e) {
    console.log("Deployer already registered or error:", e.message);
  }

  // 3. Register Deployer as Land Registrar
  try {
    const tx3 = await authorityRegistry.registerAuthority(
      deployer.address,
      LAND_REGISTRAR_ROLE,
      "MST Municipal Land Registry",
      "State Jurisdiction",
      "https://mstscan.com",
      "CADASTRE-REG-01"
    );
    await tx3.wait();
    console.log("Registered Deployer as LAND_REGISTRAR_ROLE");
  } catch (e) {
    console.log("Deployer already registered or error:", e.message);
  }

  console.log("Authorities successfully configured on-chain!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
