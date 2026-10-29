// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../access/AuthorityRegistry.sol";
import "../credentials/AcademicDegreeCertificate.sol";
import "../carbon/CarbonCreditBatch.sol";
import "../carbon/CarbonRetirementReceipt.sol";
import "../land/LandOwnershipTitle.sol";

/**
 * @title UniversalAssetManager
 * @notice Central portfolio management contract for all real-world and digital assets on MST Blockchain.
 * Aggregates user holdings across degrees, carbon credits, and land ownership.
 */
contract UniversalAssetManager {
    AuthorityRegistry public immutable authorityRegistry;
    AcademicDegreeCertificate public immutable degreeContract;
    CarbonCreditBatch public immutable carbonCreditContract;
    CarbonRetirementReceipt public immutable retirementReceiptContract;
    LandOwnershipTitle public immutable landContract;

    struct PortfolioSummary {
        uint256 degreeCount;
        uint256 landCount;
        uint256 totalCarbonOffsetTonnes;
    }

    struct UserAssetInventory {
        uint256[] degreeTokenIds;
        uint256[] landTokenIds;
        uint256[] carbonReceiptIds;
    }

    constructor(
        address _authorityRegistry,
        address _degreeContract,
        address _carbonCreditContract,
        address _retirementReceiptContract,
        address _landContract
    ) {
        authorityRegistry = AuthorityRegistry(_authorityRegistry);
        degreeContract = AcademicDegreeCertificate(_degreeContract);
        carbonCreditContract = CarbonCreditBatch(_carbonCreditContract);
        retirementReceiptContract = CarbonRetirementReceipt(_retirementReceiptContract);
        landContract = LandOwnershipTitle(_landContract);
    }

    /**
     * @notice Returns high-level asset counts for an account.
     */
    function getPortfolioSummary(address user) external view returns (PortfolioSummary memory) {
        uint256 degreeCount = degreeContract.balanceOf(user);
        uint256 landCount = landContract.balanceOf(user);

        uint256[] memory receiptIds = retirementReceiptContract.getCertificatesOf(user);
        uint256 totalOffsetTonnes = 0;
        for (uint256 i = 0; i < receiptIds.length; i++) {
            CarbonRetirementReceipt.RetirementCertificate memory cert = retirementReceiptContract.getCertificate(receiptIds[i]);
            totalOffsetTonnes += cert.tonnesRetired;
        }

        return PortfolioSummary({
            degreeCount: degreeCount,
            landCount: landCount,
            totalCarbonOffsetTonnes: totalOffsetTonnes
        });
    }

    /**
     * @notice Returns all asset IDs across credentials, land, and carbon retirement certificates owned by a user.
     */
    function getUserAssetInventory(address user) external view returns (UserAssetInventory memory) {
        return UserAssetInventory({
            degreeTokenIds: degreeContract.getStudentDegrees(user),
            landTokenIds: landContract.getOwnerParcels(user),
            carbonReceiptIds: retirementReceiptContract.getCertificatesOf(user)
        });
    }

    /**
     * @notice Returns carbon credit balance across an array of token batch IDs.
     */
    function getCarbonBatchBalances(address user, uint256[] calldata batchIds)
        external
        view
        returns (uint256[] memory balances)
    {
        balances = new uint256[](batchIds.length);
        for (uint256 i = 0; i < batchIds.length; i++) {
            balances[i] = carbonCreditContract.balanceOf(user, batchIds[i]);
        }
        return balances;
    }
}
