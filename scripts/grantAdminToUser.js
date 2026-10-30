const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const deployments = require("../deployments/mstTestnet.json");

  // Get target address from argument or environment variable
  const targetAddress = process.env.TARGET_WALLET || process.argv[2];

  if (!targetAddress || !hre.ethers.isAddress(targetAddress)) {
    console.error("Please provide a valid target wallet address.");
    console.log("Usage: npx hardhat run scripts/grantAdminToUser.js --network mstTestnet <YOUR_WALLET_ADDRESS>");
    process.exit(1);
  }

  console.log("==================================================");
  console.log("Granting DEFAULT_ADMIN_ROLE & Institutional Roles");
  console.log("From Deployer: ", deployer.address);
  console.log("To Target User:", targetAddress);
  console.log("Network:       MST Testnet (Chain ID 91562037)");
  console.log("==================================================\n");

  const AuthorityRegistry = await hre.ethers.getContractFactory("AuthorityRegistry");
  const authorityRegistry = AuthorityRegistry.attach(deployments.contracts.AuthorityRegistry);

  const DEFAULT_ADMIN_ROLE = await authorityRegistry.DEFAULT_ADMIN_ROLE();
  const UNIVERSITY_ROLE = await authorityRegistry.UNIVERSITY_ROLE();
  const CARBON_AUDITOR_ROLE = await authorityRegistry.CARBON_AUDITOR_ROLE();
  const LAND_REGISTRAR_ROLE = await authorityRegistry.LAND_REGISTRAR_ROLE();

  // 1. Grant DEFAULT_ADMIN_ROLE
  console.log("1. Granting DEFAULT_ADMIN_ROLE...");
  const txAdmin = await authorityRegistry.grantRole(DEFAULT_ADMIN_ROLE, targetAddress);
  await txAdmin.wait();
  console.log("   -> Granted DEFAULT_ADMIN_ROLE!");

  // 2. Grant UNIVERSITY_ROLE
  console.log("2. Granting UNIVERSITY_ROLE...");
  const txUniv = await authorityRegistry.grantRole(UNIVERSITY_ROLE, targetAddress);
  await txUniv.wait();
  console.log("   -> Granted UNIVERSITY_ROLE!");

  // 3. Grant CARBON_AUDITOR_ROLE
  console.log("3. Granting CARBON_AUDITOR_ROLE...");
  const txAuditor = await authorityRegistry.grantRole(CARBON_AUDITOR_ROLE, targetAddress);
  await txAuditor.wait();
  console.log("   -> Granted CARBON_AUDITOR_ROLE!");

  // 4. Grant LAND_REGISTRAR_ROLE
  console.log("4. Granting LAND_REGISTRAR_ROLE...");
  const txReg = await authorityRegistry.grantRole(LAND_REGISTRAR_ROLE, targetAddress);
  await txReg.wait();
  console.log("   -> Granted LAND_REGISTRAR_ROLE!");

  // 5. Send 1.0 tMSTC for testnet gas
  console.log("5. Transferring 1.0 tMSTC to user for gas fees...");
  try {
    const txGas = await deployer.sendTransaction({
      to: targetAddress,
      value: hre.ethers.parseEther("1.0"),
    });
    await txGas.wait();
    console.log("   -> Transferred 1.0 tMSTC successfully!");
  } catch (gasErr) {
    console.warn("   -> Note: Gas transfer skipped/deferred:", gasErr.message);
  }

  console.log("\n==================================================");
  console.log("SUCCESS: Target wallet is now a Full Protocol Admin!");
  console.log("==================================================");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
