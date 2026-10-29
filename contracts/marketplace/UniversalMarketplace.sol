// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title UniversalMarketplace
 * @notice Decentralized trading & escrow for transferable real-world assets on MST Blockchain.
 * Supports ERC-721 Land Titles and ERC-1155 Carbon Credits settled in native MSTC.
 */
contract UniversalMarketplace is ReentrancyGuard, Ownable {
    enum AssetStandard { ERC721, ERC1155 }

    struct Listing {
        uint256 listingId;
        address seller;
        address tokenAddress;
        uint256 tokenId;
        uint256 amount;            // 1 for ERC721, multiple for ERC1155
        uint256 pricePerUnitInMSTC; // In wei of MSTC
        AssetStandard standard;
        bool isActive;
    }

    uint256 private _nextListingId;
    uint256 public feeBasisPoints = 100; // 1% default protocol fee (100 / 10000)

    mapping(uint256 => Listing) private _listings;
    address public feeRecipient;

    event ItemListed(
        uint256 indexed listingId,
        address indexed seller,
        address indexed tokenAddress,
        uint256 tokenId,
        uint256 amount,
        uint256 pricePerUnitInMSTC,
        AssetStandard standard
    );

    event ItemSold(
        uint256 indexed listingId,
        address indexed buyer,
        uint256 amount,
        uint256 totalCostInMSTC
    );

    event ListingCancelled(uint256 indexed listingId, address indexed seller);

    error ListingNotActive();
    error NotSeller();
    error InsufficientPayment();
    error InvalidListingAmount();
    error TransferFailed();
    error InvalidZeroAddress();

    constructor(address _feeRecipient) Ownable(msg.sender) {
        if (_feeRecipient == address(0)) revert InvalidZeroAddress();
        feeRecipient = _feeRecipient;
    }

    /**
     * @notice Lists an ERC-721 Land Title for sale in native MSTC.
     */
    function listERC721(
        address tokenAddress,
        uint256 tokenId,
        uint256 priceInMSTC
    ) external nonReentrant returns (uint256) {
        IERC721(tokenAddress).transferFrom(msg.sender, address(this), tokenId);

        uint256 listingId = ++_nextListingId;
        _listings[listingId] = Listing({
            listingId: listingId,
            seller: msg.sender,
            tokenAddress: tokenAddress,
            tokenId: tokenId,
            amount: 1,
            pricePerUnitInMSTC: priceInMSTC,
            standard: AssetStandard.ERC721,
            isActive: true
        });

        emit ItemListed(listingId, msg.sender, tokenAddress, tokenId, 1, priceInMSTC, AssetStandard.ERC721);
        return listingId;
    }

    /**
     * @notice Lists ERC-1155 Carbon Credits for sale in native MSTC.
     */
    function listERC1155(
        address tokenAddress,
        uint256 tokenId,
        uint256 amount,
        uint256 pricePerUnitInMSTC
    ) external nonReentrant returns (uint256) {
        if (amount == 0) revert InvalidListingAmount();

        IERC1155(tokenAddress).safeTransferFrom(msg.sender, address(this), tokenId, amount, "");

        uint256 listingId = ++_nextListingId;
        _listings[listingId] = Listing({
            listingId: listingId,
            seller: msg.sender,
            tokenAddress: tokenAddress,
            tokenId: tokenId,
            amount: amount,
            pricePerUnitInMSTC: pricePerUnitInMSTC,
            standard: AssetStandard.ERC1155,
            isActive: true
        });

        emit ItemListed(listingId, msg.sender, tokenAddress, tokenId, amount, pricePerUnitInMSTC, AssetStandard.ERC1155);
        return listingId;
    }

    /**
     * @notice Buys an active listing using native MSTC coin.
     */
    function buyItem(uint256 listingId, uint256 amountToBuy) external payable nonReentrant {
        Listing storage listing = _listings[listingId];
        if (!listing.isActive) revert ListingNotActive();
        if (amountToBuy == 0 || amountToBuy > listing.amount) revert InvalidListingAmount();

        uint256 totalCost = listing.pricePerUnitInMSTC * amountToBuy;
        if (msg.value < totalCost) revert InsufficientPayment();

        listing.amount -= amountToBuy;
        if (listing.amount == 0) {
            listing.isActive = false;
        }

        // Calculate and split protocol fee
        uint256 fee = (totalCost * feeBasisPoints) / 10000;
        uint256 sellerProceeds = totalCost - fee;

        // Transfer funds
        (bool feeSuccess, ) = payable(feeRecipient).call{value: fee}("");
        if (!feeSuccess) revert TransferFailed();

        (bool sellerSuccess, ) = payable(listing.seller).call{value: sellerProceeds}("");
        if (!sellerSuccess) revert TransferFailed();

        // Refund any excess payment
        if (msg.value > totalCost) {
            (bool refundSuccess, ) = payable(msg.sender).call{value: msg.value - totalCost}("");
            if (!refundSuccess) revert TransferFailed();
        }

        // Deliver asset to buyer
        if (listing.standard == AssetStandard.ERC721) {
            IERC721(listing.tokenAddress).safeTransferFrom(address(this), msg.sender, listing.tokenId);
        } else {
            IERC1155(listing.tokenAddress).safeTransferFrom(address(this), msg.sender, listing.tokenId, amountToBuy, "");
        }

        emit ItemSold(listingId, msg.sender, amountToBuy, totalCost);
    }

    /**
     * @notice Cancels an active listing and returns the escrowed asset to the seller.
     */
    function cancelListing(uint256 listingId) external nonReentrant {
        Listing storage listing = _listings[listingId];
        if (!listing.isActive) revert ListingNotActive();
        if (msg.sender != listing.seller) revert NotSeller();

        listing.isActive = false;

        if (listing.standard == AssetStandard.ERC721) {
            IERC721(listing.tokenAddress).safeTransferFrom(address(this), msg.sender, listing.tokenId);
        } else {
            IERC1155(listing.tokenAddress).safeTransferFrom(address(this), msg.sender, listing.tokenId, listing.amount, "");
        }

        emit ListingCancelled(listingId, msg.sender);
    }

    function getListing(uint256 listingId) external view returns (Listing memory) {
        return _listings[listingId];
    }

    // Handlers for receiving ERC-721 and ERC-1155 into escrow
    function onERC721Received(address, address, uint256, bytes calldata) external pure returns (bytes4) {
        return this.onERC721Received.selector;
    }

    function onERC1155Received(address, address, uint256, uint256, bytes calldata) external pure returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(address, address, uint256[] calldata, uint256[] calldata, bytes calldata) external pure returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }
}
