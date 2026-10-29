// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "../access/AuthorityRegistry.sol";
import "./CarbonRetirementReceipt.sol";

/**
 * @title CarbonCreditBatch
 * @notice Multi-token (ERC-1155) representing fractional metric tonnes of certified carbon credits.
 * Each token ID represents a distinct carbon avoidance/removal project and vintage.
 */
contract CarbonCreditBatch is ERC1155, ReentrancyGuard {
    AuthorityRegistry public immutable authorityRegistry;
    CarbonRetirementReceipt public retirementReceipt;

    uint256 private _nextTokenId;

    struct CarbonBatch {
        uint256 tokenId;
        string projectId;          // e.g., "VCS-2104"
        string standard;           // "Verra", "Gold Standard", "Puro.earth"
        string methodology;        // "VM0007"
        uint16 vintageYear;        // e.g. 2024
        string countryCode;        // "IND", "BRA", etc.
        uint256 totalIssued;       // in metric tonnes
        uint256 totalRetired;      // in metric tonnes
        string auditReportIpfsUri; // Audit report & satellite GIS proof
        address auditor;
        bool isVerified;
    }

    struct CreateBatchParams {
        address recipient;
        string projectId;
        string standard;
        string methodology;
        uint16 vintageYear;
        string countryCode;
        uint256 tonnes;
        string auditReportIpfsUri;
    }

    mapping(uint256 => CarbonBatch) private _batches;
    mapping(uint256 => string) private _tokenUris;

    event BatchCreated(
        uint256 indexed tokenId,
        string projectId,
        uint16 indexed vintageYear,
        uint256 tonnesIssued,
        address indexed auditor
    );

    event CreditsRetired(
        uint256 indexed tokenId,
        address indexed caller,
        address indexed beneficiary,
        uint256 tonnes,
        uint256 receiptId
    );

    error NotAuthorizedAuditor();
    error BatchDoesNotExist();
    error InsufficientCreditBalance();
    error InvalidReceiptContract();
    error InvalidRecipientAddress();
    error ZeroTonnesSpecified();

    modifier onlyAuditor() {
        if (!authorityRegistry.isAuthorized(msg.sender, authorityRegistry.CARBON_AUDITOR_ROLE())) {
            revert NotAuthorizedAuditor();
        }
        _;
    }

    constructor(address _authorityRegistry) ERC1155("") {
        authorityRegistry = AuthorityRegistry(_authorityRegistry);
    }

    /**
     * @notice Links the CarbonRetirementReceipt contract after deployment.
     */
    function setRetirementReceiptContract(address _receiptContract) external {
        if (address(retirementReceipt) != address(0)) revert InvalidReceiptContract();
        if (_receiptContract == address(0)) revert InvalidReceiptContract();
        retirementReceipt = CarbonRetirementReceipt(_receiptContract);
    }

    /**
     * @notice Creates and mints a verified carbon credit batch using a parameters struct.
     */
    function createAndMintBatch(CreateBatchParams calldata params) external onlyAuditor returns (uint256) {
        if (params.recipient == address(0)) revert InvalidRecipientAddress();
        if (params.tonnes == 0) revert ZeroTonnesSpecified();

        uint256 tokenId = ++_nextTokenId;

        _batches[tokenId] = CarbonBatch({
            tokenId: tokenId,
            projectId: params.projectId,
            standard: params.standard,
            methodology: params.methodology,
            vintageYear: params.vintageYear,
            countryCode: params.countryCode,
            totalIssued: params.tonnes,
            totalRetired: 0,
            auditReportIpfsUri: params.auditReportIpfsUri,
            auditor: msg.sender,
            isVerified: true
        });

        _tokenUris[tokenId] = params.auditReportIpfsUri;

        _mint(params.recipient, tokenId, params.tonnes, "");

        emit BatchCreated(tokenId, params.projectId, params.vintageYear, params.tonnes, msg.sender);
        return tokenId;
    }

    /**
     * @notice Retires (burns) carbon credits to permanently offset greenhouse gas emissions.
     * Mints a soulbound receipt to the beneficiary.
     */
    function retireCredits(
        uint256 tokenId,
        uint256 tonnes,
        address beneficiary,
        string calldata beneficiaryName,
        string calldata retirementReason
    ) external nonReentrant returns (uint256 receiptId) {
        if (tonnes == 0) revert ZeroTonnesSpecified();
        if (balanceOf(msg.sender, tokenId) < tonnes) revert InsufficientCreditBalance();
        if (_batches[tokenId].totalIssued == 0) revert BatchDoesNotExist();
        if (address(retirementReceipt) == address(0)) revert InvalidReceiptContract();

        CarbonBatch storage batch = _batches[tokenId];
        batch.totalRetired += tonnes;

        // Burn the ERC-1155 credits
        _burn(msg.sender, tokenId, tonnes);

        // Mint permanent soulbound receipt
        receiptId = retirementReceipt.mintReceipt(
            beneficiary,
            beneficiaryName,
            retirementReason,
            tokenId,
            batch.projectId,
            batch.vintageYear,
            tonnes
        );

        emit CreditsRetired(tokenId, msg.sender, beneficiary, tonnes, receiptId);
        return receiptId;
    }

    /**
     * @notice Returns batch information for a given token ID.
     */
    function getBatch(uint256 tokenId) external view returns (CarbonBatch memory) {
        if (_batches[tokenId].totalIssued == 0) revert BatchDoesNotExist();
        return _batches[tokenId];
    }

    /**
     * @notice Returns metadata URI for a token ID.
     */
    function uri(uint256 tokenId) public view virtual override returns (string memory) {
        return _tokenUris[tokenId];
    }
}
