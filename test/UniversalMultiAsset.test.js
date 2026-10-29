const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Universal Multi-Asset Management System on MST Blockchain", function () {
  let admin, university, auditor, registrar, student, buyer, feeCollector;
  let authorityRegistry, degreeContract, carbonReceipt, carbonCreditBatch, landTitle, assetManager, marketplace;

  beforeEach(async function () {
    [admin, university, auditor, registrar, student, buyer, feeCollector] = await ethers.getSigners();

    // 1. Deploy AuthorityRegistry
    const AuthorityRegistry = await ethers.getContractFactory("AuthorityRegistry");
    authorityRegistry = await AuthorityRegistry.deploy(admin.address);
    await authorityRegistry.waitForDeployment();

    // Register Authorities
    await authorityRegistry.registerAuthority(
      university.address,
      await authorityRegistry.UNIVERSITY_ROLE(),
      "MST Technological University",
      "Singapore",
      "https://mst-university.edu",
      "REG-UNIV-001"
    );

    await authorityRegistry.registerAuthority(
      auditor.address,
      await authorityRegistry.CARBON_AUDITOR_ROLE(),
      "Global EcoVerifier Labs",
      "Switzerland",
      "https://ecoverifier.org",
      "REG-AUD-002"
    );

    await authorityRegistry.registerAuthority(
      registrar.address,
      await authorityRegistry.LAND_REGISTRAR_ROLE(),
      "Department of Land Titles & Cadastre",
      "London, UK",
      "https://landregistry.gov",
      "REG-LAND-003"
    );

    // 2. Deploy AcademicDegreeCertificate
    const AcademicDegreeCertificate = await ethers.getContractFactory("AcademicDegreeCertificate");
    degreeContract = await AcademicDegreeCertificate.deploy(await authorityRegistry.getAddress());
    await degreeContract.waitForDeployment();

    // 3. Deploy Carbon Contracts
    const CarbonCreditBatch = await ethers.getContractFactory("CarbonCreditBatch");
    carbonCreditBatch = await CarbonCreditBatch.deploy(await authorityRegistry.getAddress());
    await carbonCreditBatch.waitForDeployment();

    const CarbonRetirementReceipt = await ethers.getContractFactory("CarbonRetirementReceipt");
    carbonReceipt = await CarbonRetirementReceipt.deploy(await carbonCreditBatch.getAddress());
    await carbonReceipt.waitForDeployment();

    await carbonCreditBatch.setRetirementReceiptContract(await carbonReceipt.getAddress());

    // 4. Deploy LandOwnershipTitle
    const LandOwnershipTitle = await ethers.getContractFactory("LandOwnershipTitle");
    landTitle = await LandOwnershipTitle.deploy(await authorityRegistry.getAddress());
    await landTitle.waitForDeployment();

    // 5. Deploy UniversalAssetManager
    const UniversalAssetManager = await ethers.getContractFactory("UniversalAssetManager");
    assetManager = await UniversalAssetManager.deploy(
      await authorityRegistry.getAddress(),
      await degreeContract.getAddress(),
      await carbonCreditBatch.getAddress(),
      await carbonReceipt.getAddress(),
      await landTitle.getAddress()
    );
    await assetManager.waitForDeployment();

    // 6. Deploy UniversalMarketplace
    const UniversalMarketplace = await ethers.getContractFactory("UniversalMarketplace");
    marketplace = await UniversalMarketplace.deploy(feeCollector.address);
    await marketplace.waitForDeployment();
  });

  describe("1. Authority Registry & RBAC", function () {
    it("should correctly identify authorized institutions", async function () {
      expect(
        await authorityRegistry.isAuthorized(university.address, await authorityRegistry.UNIVERSITY_ROLE())
      ).to.be.true;

      expect(
        await authorityRegistry.isAuthorized(auditor.address, await authorityRegistry.CARBON_AUDITOR_ROLE())
      ).to.be.true;

      expect(
        await authorityRegistry.isAuthorized(registrar.address, await authorityRegistry.LAND_REGISTRAR_ROLE())
      ).to.be.true;

      expect(
        await authorityRegistry.isAuthorized(student.address, await authorityRegistry.UNIVERSITY_ROLE())
      ).to.be.false;
    });

    it("should prevent unauthorized registration calls", async function () {
      await expect(
        authorityRegistry.connect(student).registerAuthority(
          student.address,
          await authorityRegistry.UNIVERSITY_ROLE(),
          "Fake Univ",
          "Nowhere",
          "https://fake.edu",
          "BAD-1"
        )
      ).to.be.reverted;
    });
  });

  describe("2. Academic Degree Certificates (Soulbound ERC-721)", function () {
    const studentIdHash = ethers.keccak256(ethers.toUtf8Bytes("STUDENT-MST-2026-99"));

    it("should allow verified university to issue a degree", async function () {
      const tx = await degreeContract.connect(university).issueDegree({
        student: student.address,
        studentName: "Alice Chen",
        studentIdHash: studentIdHash,
        degreeName: "B.S. in Computer Science & Distributed Systems",
        major: "Blockchain Engineering",
        graduationDate: "2026-06-15",
        transcriptIpfsUri: "ipfs://QmDegreeAliceTranscriptHash"
      });

      await expect(tx).to.emit(degreeContract, "DegreeIssued");
      expect(await degreeContract.balanceOf(student.address)).to.equal(1);

      const [isValid, record] = await degreeContract.verifyDegree(1);
      expect(isValid).to.be.true;
      expect(record.degreeName).to.equal("B.S. in Computer Science & Distributed Systems");
      expect(record.student).to.equal(student.address);
      expect(await degreeContract.locked(1)).to.be.true;
    });

    it("should enforce Soulbound behavior (transfers must REVERT)", async function () {
      await degreeContract.connect(university).issueDegree({
        student: student.address,
        studentName: "Alice Chen",
        studentIdHash: studentIdHash,
        degreeName: "B.S. in Computer Science",
        major: "Software",
        graduationDate: "2026-06-15",
        transcriptIpfsUri: "ipfs://QmDegreeAlice"
      });

      await expect(
        degreeContract.connect(student).transferFrom(student.address, buyer.address, 1)
      ).to.be.revertedWithCustomError(degreeContract, "SoulboundTokenNonTransferable");
    });

    it("should allow issuing university to revoke a fraudulent degree", async function () {
      await degreeContract.connect(university).issueDegree({
        student: student.address,
        studentName: "Alice Chen",
        studentIdHash: studentIdHash,
        degreeName: "B.S. in Computer Science",
        major: "Software",
        graduationDate: "2026-06-15",
        transcriptIpfsUri: "ipfs://QmDegreeAlice"
      });

      await degreeContract.connect(university).revokeDegree(1, "Academic dishonesty confirmed upon audit");

      const [isValid, record] = await degreeContract.verifyDegree(1);
      expect(isValid).to.be.false;
      expect(record.isRevoked).to.be.true;
      expect(await degreeContract.getRevocationReason(1)).to.equal("Academic dishonesty confirmed upon audit");
    });
  });

  describe("3. Carbon Credit Batches & Proof-of-Offset Retirement", function () {
    beforeEach(async function () {
      await carbonCreditBatch.connect(auditor).createAndMintBatch({
        recipient: admin.address,
        projectId: "VCS-2104-REDD+",
        standard: "Verra VCS",
        methodology: "VM0007",
        vintageYear: 2024,
        countryCode: "BRA",
        tonnes: 1000,
        auditReportIpfsUri: "ipfs://QmCarbonAuditReport2024"
      });
    });

    it("should correctly mint semi-fungible batch credits", async function () {
      expect(await carbonCreditBatch.balanceOf(admin.address, 1)).to.equal(1000);
      const batch = await carbonCreditBatch.getBatch(1);
      expect(batch.projectId).to.equal("VCS-2104-REDD+");
      expect(batch.totalIssued).to.equal(1000);
    });

    it("should allow burning credits for retirement and mint Soulbound receipt", async function () {
      // Admin transfers 250 tonnes to buyer
      await carbonCreditBatch.safeTransferFrom(admin.address, buyer.address, 1, 250, "0x");
      expect(await carbonCreditBatch.balanceOf(buyer.address, 1)).to.equal(250);

      // Buyer retires 100 tonnes
      const tx = await carbonCreditBatch.connect(buyer).retireCredits(
        1,
        100,
        buyer.address,
        "Acme Global Logistics",
        "Net Zero Scope 1 Carbon Offset Q4"
      );

      await expect(tx).to.emit(carbonCreditBatch, "CreditsRetired");

      // Balance reduced
      expect(await carbonCreditBatch.balanceOf(buyer.address, 1)).to.equal(150);

      // Batch retired count updated
      const batch = await carbonCreditBatch.getBatch(1);
      expect(batch.totalRetired).to.equal(100);

      // Receipt minted to buyer
      expect(await carbonReceipt.balanceOf(buyer.address)).to.equal(1);
      const cert = await carbonReceipt.getCertificate(1);
      expect(cert.beneficiaryName).to.equal("Acme Global Logistics");
      expect(cert.tonnesRetired).to.equal(100);

      // Receipt cannot be transferred (Soulbound)
      await expect(
        carbonReceipt.connect(buyer).transferFrom(buyer.address, student.address, 1)
      ).to.be.revertedWithCustomError(carbonReceipt, "SoulboundReceiptNonTransferable");
    });
  });

  describe("4. Land Ownership Titles (ERC-721)", function () {
    it("should allow accredited land registrar to register parcel", async function () {
      const tx = await landTitle.connect(registrar).registerLand({
        owner: student.address,
        parcelIdentifier: "PARCEL-LON-2026-B81",
        jurisdiction: "Greater London, UK",
        coordinatesPolygon: "ipfs://QmCoordinatesGeoJson",
        areaSquareMeters: 450,
        deedRegistryHash: "0x3f9a72b8c9d10e5f2a",
        deedDocumentIpfsUri: "ipfs://QmOfficialDeedDoc"
      });

      await expect(tx).to.emit(landTitle, "LandRegistered");
      expect(await landTitle.balanceOf(student.address)).to.equal(1);
      expect(await landTitle.ownerOf(1)).to.equal(student.address);
    });

    it("should allow transfer of unencumbered land parcel", async function () {
      await landTitle.connect(registrar).registerLand({
        owner: student.address,
        parcelIdentifier: "PARCEL-LON-2026-B82",
        jurisdiction: "Greater London, UK",
        coordinatesPolygon: "ipfs://QmCoordinatesGeoJson",
        areaSquareMeters: 300,
        deedRegistryHash: "0x123",
        deedDocumentIpfsUri: "ipfs://QmOfficialDeedDoc"
      });

      await landTitle.connect(student).transferFrom(student.address, buyer.address, 1);
      expect(await landTitle.ownerOf(1)).to.equal(buyer.address);
    });

    it("should block transfers if parcel is encumbered by registrar", async function () {
      await landTitle.connect(registrar).registerLand({
        owner: student.address,
        parcelIdentifier: "PARCEL-LON-2026-B83",
        jurisdiction: "Greater London, UK",
        coordinatesPolygon: "ipfs://QmCoordinatesGeoJson",
        areaSquareMeters: 300,
        deedRegistryHash: "0x456",
        deedDocumentIpfsUri: "ipfs://QmOfficialDeedDoc"
      });

      // Registrar places mortgage/lien encumbrance
      await landTitle.connect(registrar).setEncumbrance(
        1,
        true,
        "Active Commercial Mortgage Lien with Barclays Bank"
      );

      // Transfer must fail
      await expect(
        landTitle.connect(student).transferFrom(student.address, buyer.address, 1)
      ).to.be.revertedWithCustomError(landTitle, "ParcelIsEncumbered");

      // Release encumbrance
      await landTitle.connect(registrar).setEncumbrance(1, false, "Mortgage settled");

      // Now transfer succeeds
      await landTitle.connect(student).transferFrom(student.address, buyer.address, 1);
      expect(await landTitle.ownerOf(1)).to.equal(buyer.address);
    });
  });

  describe("5. Universal Asset Manager & Portfolio Aggregator", function () {
    it("should aggregate multi-asset portfolio for user", async function () {
      // 1 degree
      await degreeContract.connect(university).issueDegree({
        student: student.address,
        studentName: "Bob",
        studentIdHash: ethers.keccak256(ethers.toUtf8Bytes("BOB-1")),
        degreeName: "M.S. Cybersecurity",
        major: "Security",
        graduationDate: "2026",
        transcriptIpfsUri: "ipfs://QmBob"
      });

      // 1 land title
      await landTitle.connect(registrar).registerLand({
        owner: student.address,
        parcelIdentifier: "PARCEL-999",
        jurisdiction: "Singapore",
        coordinatesPolygon: "ipfs://QmSG",
        areaSquareMeters: 120,
        deedRegistryHash: "0x999",
        deedDocumentIpfsUri: "ipfs://QmDeed"
      });

      // 1 carbon batch & retirement
      await carbonCreditBatch.connect(auditor).createAndMintBatch({
        recipient: student.address,
        projectId: "PROJECT-SOLAR",
        standard: "Gold Standard",
        methodology: "GS-01",
        vintageYear: 2025,
        countryCode: "IND",
        tonnes: 50,
        auditReportIpfsUri: "ipfs://QmSolar"
      });

      await carbonCreditBatch.connect(student).retireCredits(
        1,
        20,
        student.address,
        "Bob",
        "Personal travel carbon offset"
      );

      const summary = await assetManager.getPortfolioSummary(student.address);
      expect(summary.degreeCount).to.equal(1);
      expect(summary.landCount).to.equal(1);
      expect(summary.totalCarbonOffsetTonnes).to.equal(20);

      const inventory = await assetManager.getUserAssetInventory(student.address);
      expect(inventory.degreeTokenIds.length).to.equal(1);
      expect(inventory.landTokenIds.length).to.equal(1);
      expect(inventory.carbonReceiptIds.length).to.equal(1);
    });
  });

  describe("6. Universal Marketplace (Trading in native MSTC)", function () {
    beforeEach(async function () {
      // Register land to seller (student)
      await landTitle.connect(registrar).registerLand({
        owner: student.address,
        parcelIdentifier: "PARCEL-TRADE-1",
        jurisdiction: "Singapore",
        coordinatesPolygon: "ipfs://QmTrade",
        areaSquareMeters: 500,
        deedRegistryHash: "0xTRADE",
        deedDocumentIpfsUri: "ipfs://QmDoc"
      });

      // Mint carbon credits to student
      await carbonCreditBatch.connect(auditor).createAndMintBatch({
        recipient: student.address,
        projectId: "PROJECT-FOREST",
        standard: "Verra",
        methodology: "VM-1",
        vintageYear: 2024,
        countryCode: "BRA",
        tonnes: 500,
        auditReportIpfsUri: "ipfs://QmForest"
      });
    });

    it("should allow listing and purchasing Land Title with MSTC", async function () {
      const price = ethers.parseEther("10"); // 10 MSTC

      // Approve and list
      await landTitle.connect(student).approve(await marketplace.getAddress(), 1);
      await marketplace.connect(student).listERC721(await landTitle.getAddress(), 1, price);

      const initialSellerBalance = await ethers.provider.getBalance(student.address);

      // Buyer purchases with 10 MSTC
      await marketplace.connect(buyer).buyItem(1, 1, { value: price });

      // Land title transferred to buyer
      expect(await landTitle.ownerOf(1)).to.equal(buyer.address);

      // Seller received proceeds (minus 1% fee)
      const finalSellerBalance = await ethers.provider.getBalance(student.address);
      const fee = (price * 100n) / 10000n; // 1%
      expect(finalSellerBalance - initialSellerBalance).to.equal(price - fee);
    });

    it("should allow listing and partial purchase of Carbon Credits with MSTC", async function () {
      const pricePerTonne = ethers.parseEther("0.1"); // 0.1 MSTC per tonne

      // Approve and list 500 tonnes
      await carbonCreditBatch.connect(student).setApprovalForAll(await marketplace.getAddress(), true);
      await marketplace.connect(student).listERC1155(await carbonCreditBatch.getAddress(), 1, 500, pricePerTonne);

      // Buyer purchases 150 tonnes
      const costFor150 = pricePerTonne * 150n;
      await marketplace.connect(buyer).buyItem(1, 150, { value: costFor150 });

      // Buyer has 150 tonnes
      expect(await carbonCreditBatch.balanceOf(buyer.address, 1)).to.equal(150);

      // Listing has 350 tonnes remaining
      const listing = await marketplace.getListing(1);
      expect(listing.amount).to.equal(350);
      expect(listing.isActive).to.be.true;
    });
  });
});
