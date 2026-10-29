export const MST_NETWORKS = {
  testnet: {
    chainId: "0x11C1", // 4545 in hex
    chainIdDecimal: 4545,
    chainName: "MST Testnet",
    nativeCurrency: {
      name: "Testnet MSTC",
      symbol: "tMSTC",
      decimals: 18,
    },
    rpcUrls: ["https://testnetrpc.mstblockchain.com"],
    blockExplorerUrls: ["https://testnet.mstscan.com"],
  },
  mainnet: {
    chainId: "0x1226", // 4646 in hex
    chainIdDecimal: 4646,
    chainName: "MST Mainnet",
    nativeCurrency: {
      name: "MST Coin",
      symbol: "MSTC",
      decimals: 18,
    },
    rpcUrls: ["https://mariorpc.mstblockchain.com", "https://craftrpc.mstblockchain.com"],
    blockExplorerUrls: ["https://mstscan.com"],
  },
};

// Default deployed addresses (overridable via environment variables or connection modal)
export const CONTRACT_ADDRESSES = {
  AuthorityRegistry: process.env.NEXT_PUBLIC_AUTHORITY_REGISTRY || "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  AcademicDegreeCertificate: process.env.NEXT_PUBLIC_DEGREE_CONTRACT || "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  CarbonCreditBatch: process.env.NEXT_PUBLIC_CARBON_BATCH || "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  CarbonRetirementReceipt: process.env.NEXT_PUBLIC_CARBON_RECEIPT || "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
  LandOwnershipTitle: process.env.NEXT_PUBLIC_LAND_TITLE || "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
  UniversalAssetManager: process.env.NEXT_PUBLIC_ASSET_MANAGER || "0x0165878A594ca255338adfa4d48449f69242Eb8F",
  UniversalMarketplace: process.env.NEXT_PUBLIC_MARKETPLACE || "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853",
};

export const AUTHORITY_REGISTRY_ABI = [
  "function registerAuthority(address authority, bytes32 role, string name, string jurisdiction, string officialWebsite, string registrationId) external",
  "function setAuthorityStatus(address authority, bool isActive) external",
  "function isAuthorized(address authority, bytes32 role) external view returns (bool)",
  "function getAuthorityProfile(address authority) external view returns (tuple(string name, string jurisdiction, string officialWebsite, string registrationId, bool isActive, uint256 registeredAt))",
  "function getAllAuthorities() external view returns (address[])",
  "function getAuthoritiesCount() external view returns (uint256)",
  "function hasRole(bytes32 role, address account) external view returns (bool)",
  "function grantRole(bytes32 role, address account) external",
  "function revokeRole(bytes32 role, address account) external",
  "function DEFAULT_ADMIN_ROLE() external view returns (bytes32)",
  "function UNIVERSITY_ROLE() external view returns (bytes32)",
  "function CARBON_AUDITOR_ROLE() external view returns (bytes32)",
  "function LAND_REGISTRAR_ROLE() external view returns (bytes32)"
];

export const DEGREE_ABI = [
  "function issueDegree(tuple(address student, string studentName, bytes32 studentIdHash, string degreeName, string major, string graduationDate, string transcriptIpfsUri) params) external returns (uint256)",
  "function verifyDegree(uint256 tokenId) external view returns (bool isValid, tuple(uint256 tokenId, address student, address issuingUniversity, bytes32 studentIdHash, string degreeName, bool isRevoked, uint256 issuedAt) record, string transcriptUri)",
  "function getStudentDegrees(address student) external view returns (uint256[])",
  "function revokeDegree(uint256 tokenId, string reason) external",
  "function locked(uint256 tokenId) external view returns (bool)",
  "function balanceOf(address owner) external view returns (uint256)"
];

export const CARBON_BATCH_ABI = [
  "function createAndMintBatch(tuple(address recipient, string projectId, string standard, string methodology, uint16 vintageYear, string countryCode, uint256 tonnes, string auditReportIpfsUri) params) external returns (uint256)",
  "function retireCredits(uint256 tokenId, uint256 tonnes, address beneficiary, string beneficiaryName, string retirementReason) external returns (uint256)",
  "function getBatch(uint256 tokenId) external view returns (tuple(uint256 tokenId, string projectId, string standard, string methodology, uint16 vintageYear, string countryCode, uint256 totalIssued, uint256 totalRetired, string auditReportIpfsUri, address auditor, bool isVerified))",
  "function balanceOf(address account, uint256 id) external view returns (uint256)",
  "function setApprovalForAll(address operator, bool approved) external"
];

export const CARBON_RECEIPT_ABI = [
  "function getCertificate(uint256 certificateId) external view returns (tuple(uint256 certificateId, address beneficiary, string beneficiaryName, string retirementReason, uint256 batchTokenId, string projectId, uint16 vintageYear, uint256 tonnesRetired, uint256 retiredAt))",
  "function getCertificatesOf(address beneficiary) external view returns (uint256[])",
  "function balanceOf(address owner) external view returns (uint256)"
];

export const LAND_TITLE_ABI = [
  "function registerLand(tuple(address owner, string parcelIdentifier, string jurisdiction, string coordinatesPolygon, uint256 areaSquareMeters, string deedRegistryHash, string deedDocumentIpfsUri) params) external returns (uint256)",
  "function getLandParcel(uint256 tokenId) external view returns (tuple(uint256 tokenId, string parcelIdentifier, string jurisdiction, uint256 areaSquareMeters, string deedRegistryHash, address legalRegistrar, bool isEncumbered, uint256 registeredAt))",
  "function setEncumbrance(uint256 tokenId, bool isEncumbered, string reason) external",
  "function getEncumbranceReason(uint256 tokenId) external view returns (string)",
  "function getOwnerParcels(address owner) external view returns (uint256[])",
  "function approve(address to, uint256 tokenId) external",
  "function tokenURI(uint256 tokenId) external view returns (string)",
  "function ownerOf(uint256 tokenId) external view returns (address)",
  "function balanceOf(address owner) external view returns (uint256)"
];

export const ASSET_MANAGER_ABI = [
  "function getPortfolioSummary(address user) external view returns (tuple(uint256 degreeCount, uint256 landCount, uint256 totalCarbonOffsetTonnes))",
  "function getUserAssetInventory(address user) external view returns (tuple(uint256[] degreeTokenIds, uint256[] landTokenIds, uint256[] carbonReceiptIds))"
];

export const MARKETPLACE_ABI = [
  "function listERC721(address tokenAddress, uint256 tokenId, uint256 priceInMSTC) external returns (uint256)",
  "function listERC1155(address tokenAddress, uint256 tokenId, uint256 amount, uint256 pricePerUnitInMSTC) external returns (uint256)",
  "function buyItem(uint256 listingId, uint256 amountToBuy) external payable",
  "function cancelListing(uint256 listingId) external",
  "function getListing(uint256 listingId) external view returns (tuple(uint256 listingId, address seller, address tokenAddress, uint256 tokenId, uint256 amount, uint256 pricePerUnitInMSTC, uint8 standard, bool isActive))"
];
