// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title AuthorityRegistry
 * @notice Central registry for verified institutional authorities on MST Blockchain.
 * Accredited universities, certified carbon auditors, and municipal land registrars
 * are granted specific roles to issue and manage respective real-world assets.
 */
contract AuthorityRegistry is AccessControl {
    bytes32 public constant UNIVERSITY_ROLE = keccak256("UNIVERSITY_ROLE");
    bytes32 public constant CARBON_AUDITOR_ROLE = keccak256("CARBON_AUDITOR_ROLE");
    bytes32 public constant LAND_REGISTRAR_ROLE = keccak256("LAND_REGISTRAR_ROLE");

    struct AuthorityProfile {
        string name;
        string jurisdiction;
        string officialWebsite;
        string registrationId;
        bool isActive;
        uint256 registeredAt;
    }

    mapping(address => AuthorityProfile) private _profiles;
    address[] private _authorityAddresses;

    event AuthorityRegistered(
        address indexed authority,
        bytes32 indexed role,
        string name,
        string jurisdiction,
        string registrationId
    );

    event AuthorityStatusUpdated(address indexed authority, bool isActive);

    error AuthorityAlreadyRegistered(address authority);
    error AuthorityNotRegistered(address authority);
    error InvalidAuthorityAddress();
    error InactiveAuthority(address authority);

    constructor(address initialAdmin) {
        if (initialAdmin == address(0)) revert InvalidAuthorityAddress();
        _grantRole(DEFAULT_ADMIN_ROLE, initialAdmin);
    }

    /**
     * @notice Registers a new institutional authority and assigns the role.
     */
    function registerAuthority(
        address authority,
        bytes32 role,
        string calldata name,
        string calldata jurisdiction,
        string calldata officialWebsite,
        string calldata registrationId
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (authority == address(0)) revert InvalidAuthorityAddress();
        if (_profiles[authority].registeredAt != 0) revert AuthorityAlreadyRegistered(authority);

        _profiles[authority] = AuthorityProfile({
            name: name,
            jurisdiction: jurisdiction,
            officialWebsite: officialWebsite,
            registrationId: registrationId,
            isActive: true,
            registeredAt: block.timestamp
        });

        _grantRole(role, authority);
        _authorityAddresses.push(authority);

        emit AuthorityRegistered(authority, role, name, jurisdiction, registrationId);
    }

    /**
     * @notice Updates the active status of an authority.
     */
    function setAuthorityStatus(address authority, bool isActive) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (_profiles[authority].registeredAt == 0) revert AuthorityNotRegistered(authority);
        _profiles[authority].isActive = isActive;

        emit AuthorityStatusUpdated(authority, isActive);
    }

    /**
     * @notice Checks if an address has a specific role and is currently active.
     */
    function isAuthorized(address authority, bytes32 role) external view returns (bool) {
        return hasRole(role, authority) && _profiles[authority].isActive;
    }

    /**
     * @notice Returns the full profile of an institutional authority.
     */
    function getAuthorityProfile(address authority) external view returns (AuthorityProfile memory) {
        if (_profiles[authority].registeredAt == 0) revert AuthorityNotRegistered(authority);
        return _profiles[authority];
    }

    /**
     * @notice Returns all registered authority addresses.
     */
    function getAllAuthorities() external view returns (address[] memory) {
        return _authorityAddresses;
    }

    /**
     * @notice Returns total number of registered authorities.
     */
    function getAuthoritiesCount() external view returns (uint256) {
        return _authorityAddresses.length;
    }
}
