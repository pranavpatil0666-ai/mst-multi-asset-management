// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../access/AuthorityRegistry.sol";

/**
 * @title LandOwnershipTitle
 * @notice Digital Land Titles and Property Deeds on MST Blockchain.
 * Only accredited land registrars can mint titles and manage encumbrances (liens/mortgages).
 */
contract LandOwnershipTitle is ERC721URIStorage {
    AuthorityRegistry public immutable authorityRegistry;

    uint256 private _nextTokenId;

    struct LandParcel {
        uint256 tokenId;
        string parcelIdentifier;   // Cadastral Survey / Lot Number
        string jurisdiction;       // City / State / Country
        uint256 areaSquareMeters;
        string deedRegistryHash;   // Hash of official government registry deed
        address legalRegistrar;
        bool isEncumbered;         // True if subject to mortgage, lien, or legal freeze
        uint256 registeredAt;
    }

    struct RegisterLandParams {
        address owner;
        string parcelIdentifier;
        string jurisdiction;
        string coordinatesPolygon;
        uint256 areaSquareMeters;
        string deedRegistryHash;
        string deedDocumentIpfsUri;
    }

    mapping(uint256 => LandParcel) private _parcels;
    mapping(uint256 => string) private _encumbranceReasons;
    mapping(string => bool) private _parcelIdentifierExists;
    mapping(address => uint256[]) private _ownerParcels;

    event LandRegistered(
        uint256 indexed tokenId,
        string parcelIdentifier,
        address indexed owner,
        address indexed registrar,
        uint256 areaSquareMeters
    );

    event EncumbranceUpdated(
        uint256 indexed tokenId,
        bool isEncumbered,
        string reason,
        address indexed registrar
    );

    error NotAuthorizedRegistrar();
    error ParcelAlreadyRegistered();
    error LandDoesNotExist();
    error ParcelIsEncumbered(string reason);
    error InvalidOwnerAddress();

    modifier onlyRegistrar() {
        if (!authorityRegistry.isAuthorized(msg.sender, authorityRegistry.LAND_REGISTRAR_ROLE())) {
            revert NotAuthorizedRegistrar();
        }
        _;
    }

    constructor(address _authorityRegistry) ERC721("MST Land Registry Title", "MST-LAND") {
        authorityRegistry = AuthorityRegistry(_authorityRegistry);
    }

    /**
     * @notice Registers a new land parcel to an initial owner. Only callable by an authorized land registrar.
     */
    function registerLand(RegisterLandParams calldata params) external onlyRegistrar returns (uint256) {
        if (params.owner == address(0)) revert InvalidOwnerAddress();
        if (_parcelIdentifierExists[params.parcelIdentifier]) revert ParcelAlreadyRegistered();

        uint256 tokenId = ++_nextTokenId;
        _parcelIdentifierExists[params.parcelIdentifier] = true;

        _safeMint(params.owner, tokenId);
        _setTokenURI(tokenId, params.deedDocumentIpfsUri);

        _parcels[tokenId] = LandParcel({
            tokenId: tokenId,
            parcelIdentifier: params.parcelIdentifier,
            jurisdiction: params.jurisdiction,
            areaSquareMeters: params.areaSquareMeters,
            deedRegistryHash: params.deedRegistryHash,
            legalRegistrar: msg.sender,
            isEncumbered: false,
            registeredAt: block.timestamp
        });

        _ownerParcels[params.owner].push(tokenId);

        emit LandRegistered(tokenId, params.parcelIdentifier, params.owner, msg.sender, params.areaSquareMeters);
        return tokenId;
    }

    /**
     * @notice Places or releases a lien/encumbrance on a land parcel (e.g. for mortgage or legal dispute).
     */
    function setEncumbrance(
        uint256 tokenId,
        bool isEncumbered,
        string calldata reason
    ) external onlyRegistrar {
        if (_ownerOf(tokenId) == address(0)) revert LandDoesNotExist();

        LandParcel storage parcel = _parcels[tokenId];
        parcel.isEncumbered = isEncumbered;
        _encumbranceReasons[tokenId] = reason;

        emit EncumbranceUpdated(tokenId, isEncumbered, reason, msg.sender);
    }

    /**
     * @notice Returns details of a registered land parcel.
     */
    function getLandParcel(uint256 tokenId) external view returns (LandParcel memory) {
        if (_ownerOf(tokenId) == address(0)) revert LandDoesNotExist();
        return _parcels[tokenId];
    }

    /**
     * @notice Returns encumbrance reason for a land parcel.
     */
    function getEncumbranceReason(uint256 tokenId) external view returns (string memory) {
        return _encumbranceReasons[tokenId];
    }

    /**
     * @notice Returns all land parcel token IDs owned by an address.
     */
    function getOwnerParcels(address owner) external view returns (uint256[] memory) {
        return _ownerParcels[owner];
    }

    /**
     * @dev Overrides _update to enforce that encumbered properties cannot be transferred.
     */
    function _update(address to, uint256 tokenId, address auth) internal virtual override returns (address) {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) {
            if (_parcels[tokenId].isEncumbered) {
                revert ParcelIsEncumbered(_encumbranceReasons[tokenId]);
            }
        }
        return super._update(to, tokenId, auth);
    }
}
