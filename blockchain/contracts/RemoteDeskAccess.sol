// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract RemoteDeskAccess is AccessControl, ERC721Enumerable {
    using ECDSA for bytes32;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant TECHNICIAN_ROLE = keccak256("TECHNICIAN_ROLE");

    struct Device {
        string did;
        address owner;
        bool registered;
    }

    struct AccessPermission {
        uint256 expiry;
        bool canTransferFiles;
        bool canExecuteCommands;
    }

    mapping(string => Device) public devices; // deviceId -> Device
    mapping(string => mapping(address => AccessPermission)) public permissions; // deviceId -> user -> Permission
    mapping(string => string[]) public auditLogs; // deviceId -> IPFS hashes

    event DeviceRegistered(string indexed deviceId, address indexed owner, string did);
    event AccessGranted(string indexed deviceId, address indexed user, uint256 expiry);
    event AccessRevoked(string indexed deviceId, address indexed user);
    event AuditLogAdded(string indexed deviceId, string ipfsHash);

    constructor() ERC721("RemoteDeskAccess", "RDA") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    function registerDevice(string memory deviceId, string memory did) external {
        require(!devices[deviceId].registered, "Device already registered");
        devices[deviceId] = Device(did, msg.sender, true);
        emit DeviceRegistered(deviceId, msg.sender, did);
    }

    function grantAccess(
        string memory deviceId,
        address user,
        uint256 duration,
        bool canTransferFiles,
        bool canExecuteCommands
    ) external {
        require(devices[deviceId].owner == msg.sender || hasRole(ADMIN_ROLE, msg.sender), "Not authorized");
        uint256 expiry = block.timestamp + duration;
        permissions[deviceId][user] = AccessPermission(expiry, canTransferFiles, canExecuteCommands);
        emit AccessGranted(deviceId, user, expiry);
    }

    function revokeAccess(string memory deviceId, address user) external {
        require(devices[deviceId].owner == msg.sender || hasRole(ADMIN_ROLE, msg.sender), "Not authorized");
        delete permissions[deviceId][user];
        emit AccessRevoked(deviceId, user);
    }

    function checkAccess(string memory deviceId, address user) external view returns (bool, bool, bool) {
        AccessPermission memory perm = permissions[deviceId][user];
        if (block.timestamp > perm.expiry) {
            return (false, false, false);
        }
        return (true, perm.canTransferFiles, perm.canExecuteCommands);
    }

    function addAuditLog(string memory deviceId, string memory ipfsHash) external {
        // Only owner or authorized technician can add logs
        require(devices[deviceId].owner == msg.sender || hasRole(TECHNICIAN_ROLE, msg.sender), "Not authorized");
        auditLogs[deviceId].push(ipfsHash);
        emit AuditLogAdded(deviceId, ipfsHash);
    }

    function supportsInterface(bytes4 interfaceId) public view override(AccessControl, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
