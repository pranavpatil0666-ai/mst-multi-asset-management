// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CarbonRetirementReceipt
 * @notice Soulbound (non-transferable) certificate of carbon credit retirement.
 * Minted as permanent on-chain proof of environmental offset on MST Blockchain.
 */
contract CarbonRetirementReceipt is ERC721, Ownable {
    uint256 private _nextTokenId;

    struct RetirementCertificate {
        uint256 certificateId;
        address beneficiary;
        string beneficiaryName;
        string retirementReason;
        uint256 batchTokenId;
        string projectId;
        uint16 vintageYear;
        uint256 tonnesRetired;
        uint256 retiredAt;
    }

    mapping(uint256 => RetirementCertificate) private _certificates;
    mapping(address => uint256[]) private _beneficiaryCertificates;

    event CertificateMinted(
        uint256 indexed certificateId,
        address indexed beneficiary,
        uint256 indexed batchTokenId,
        uint256 tonnesRetired,
        string beneficiaryName
    );

    error SoulboundReceiptNonTransferable();
    error CertificateDoesNotExist();

    constructor(address minterContract) ERC721("MST Carbon Retirement Receipt", "MST-OFFSET") Ownable(minterContract) {}

    /**
     * @notice Mints a soulbound receipt when carbon credits are burned. Only callable by the CarbonCreditBatch contract.
     */
    function mintReceipt(
        address beneficiary,
        string calldata beneficiaryName,
        string calldata retirementReason,
        uint256 batchTokenId,
        string calldata projectId,
        uint16 vintageYear,
        uint256 tonnesRetired
    ) external onlyOwner returns (uint256) {
        uint256 certId = ++_nextTokenId;

        _safeMint(beneficiary, certId);

        _certificates[certId] = RetirementCertificate({
            certificateId: certId,
            beneficiary: beneficiary,
            beneficiaryName: beneficiaryName,
            retirementReason: retirementReason,
            batchTokenId: batchTokenId,
            projectId: projectId,
            vintageYear: vintageYear,
            tonnesRetired: tonnesRetired,
            retiredAt: block.timestamp
        });

        _beneficiaryCertificates[beneficiary].push(certId);

        emit CertificateMinted(certId, beneficiary, batchTokenId, tonnesRetired, beneficiaryName);
        return certId;
    }

    function getCertificate(uint256 certificateId) external view returns (RetirementCertificate memory) {
        if (_ownerOf(certificateId) == address(0)) revert CertificateDoesNotExist();
        return _certificates[certificateId];
    }

    function getCertificatesOf(address beneficiary) external view returns (uint256[] memory) {
        return _beneficiaryCertificates[beneficiary];
    }

    /**
     * @dev Non-transferable soulbound enforcement.
     */
    function _update(address to, uint256 tokenId, address auth) internal virtual override returns (address) {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) {
            revert SoulboundReceiptNonTransferable();
        }
        return super._update(to, tokenId, auth);
    }
}
