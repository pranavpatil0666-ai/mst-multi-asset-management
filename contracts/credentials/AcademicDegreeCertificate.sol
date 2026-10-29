// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../access/AuthorityRegistry.sol";

/**
 * @title AcademicDegreeCertificate
 * @notice Soulbound (non-transferable) academic degrees and professional credentials on MST Blockchain.
 * Only verified universities registered in AuthorityRegistry can issue or revoke degrees.
 */
contract AcademicDegreeCertificate is ERC721URIStorage {
    AuthorityRegistry public immutable authorityRegistry;

    uint256 private _nextTokenId;

    struct DegreeRecord {
        uint256 tokenId;
        address student;
        address issuingUniversity;
        bytes32 studentIdHash;
        string degreeName;
        bool isRevoked;
        uint256 issuedAt;
    }

    struct IssueDegreeParams {
        address student;
        string studentName;
        bytes32 studentIdHash;
        string degreeName;
        string major;
        string graduationDate;
        string transcriptIpfsUri;
    }

    mapping(uint256 => DegreeRecord) private _degrees;
    mapping(uint256 => string) private _revocationReasons;
    mapping(address => uint256[]) private _studentDegrees;

    event DegreeIssued(
        uint256 indexed tokenId,
        address indexed student,
        address indexed university,
        string degreeName
    );

    event DegreeRevoked(uint256 indexed tokenId, address indexed university, string reason);
    event Locked(uint256 indexed tokenId);

    error NotAuthorizedUniversity();
    error SoulboundTokenNonTransferable();
    error DegreeDoesNotExist();
    error DegreeAlreadyRevoked();
    error OnlyIssuingUniversityCanRevoke();
    error InvalidStudentAddress();

    modifier onlyUniversity() {
        if (!authorityRegistry.isAuthorized(msg.sender, authorityRegistry.UNIVERSITY_ROLE())) {
            revert NotAuthorizedUniversity();
        }
        _;
    }

    constructor(address _authorityRegistry) ERC721("MST Academic Credential", "MST-DEGREE") {
        if (_authorityRegistry == address(0)) revert InvalidStudentAddress();
        authorityRegistry = AuthorityRegistry(_authorityRegistry);
    }

    /**
     * @notice Issues an immutable degree certificate to a student wallet.
     */
    function issueDegree(IssueDegreeParams calldata params) external onlyUniversity returns (uint256) {
        if (params.student == address(0)) revert InvalidStudentAddress();

        uint256 tokenId = ++_nextTokenId;

        _safeMint(params.student, tokenId);
        _setTokenURI(tokenId, params.transcriptIpfsUri);

        _degrees[tokenId] = DegreeRecord({
            tokenId: tokenId,
            student: params.student,
            issuingUniversity: msg.sender,
            studentIdHash: params.studentIdHash,
            degreeName: params.degreeName,
            isRevoked: false,
            issuedAt: block.timestamp
        });

        _studentDegrees[params.student].push(tokenId);

        emit DegreeIssued(tokenId, params.student, msg.sender, params.degreeName);
        emit Locked(tokenId);

        return tokenId;
    }

    /**
     * @notice Allows the original issuing university to revoke a degree if found fraudulent.
     */
    function revokeDegree(uint256 tokenId, string calldata reason) external {
        if (_ownerOf(tokenId) == address(0)) revert DegreeDoesNotExist();
        DegreeRecord storage record = _degrees[tokenId];

        if (msg.sender != record.issuingUniversity) revert OnlyIssuingUniversityCanRevoke();
        if (record.isRevoked) revert DegreeAlreadyRevoked();

        record.isRevoked = true;
        _revocationReasons[tokenId] = reason;

        emit DegreeRevoked(tokenId, msg.sender, reason);
    }

    /**
     * @notice Verifies the degree validity and returns its record.
     */
    function verifyDegree(uint256 tokenId)
        external
        view
        returns (bool isValid, DegreeRecord memory record, string memory transcriptUri)
    {
        if (_ownerOf(tokenId) == address(0)) revert DegreeDoesNotExist();
        record = _degrees[tokenId];
        isValid = !record.isRevoked && authorityRegistry.isAuthorized(record.issuingUniversity, authorityRegistry.UNIVERSITY_ROLE());
        transcriptUri = tokenURI(tokenId);
        return (isValid, record, transcriptUri);
    }

    /**
     * @notice Returns revocation reason if degree was revoked.
     */
    function getRevocationReason(uint256 tokenId) external view returns (string memory) {
        return _revocationReasons[tokenId];
    }

    /**
     * @notice Returns all degree token IDs held by a student.
     */
    function getStudentDegrees(address student) external view returns (uint256[] memory) {
        return _studentDegrees[student];
    }

    /**
     * @notice ERC-5192 standard: all degree certificates are permanently locked (soulbound).
     */
    function locked(uint256 tokenId) external view returns (bool) {
        if (_ownerOf(tokenId) == address(0)) revert DegreeDoesNotExist();
        return true;
    }

    /**
     * @dev Overridden to prevent transfers between accounts (Soulbound behavior).
     * Only minting (from == 0) and burning (to == 0) are allowed.
     */
    function _update(address to, uint256 tokenId, address auth) internal virtual override returns (address) {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) {
            revert SoulboundTokenNonTransferable();
        }
        return super._update(to, tokenId, auth);
    }
}
