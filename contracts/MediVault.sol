// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title MediVault - IPFS medical record storage with role-based control
contract MediVault {
    struct Record {
        string cid;
        string recordType; // e.g., blood test, x-ray, diagnosis
        address uploadedBy;
        uint256 timestamp;
    }

    address public admin;

    // Mapping of patient address to their medical records
    mapping(address => Record[]) private records;

    // Mapping of patient to assigned doctors
    mapping(address => address[]) private assignedDoctors;

    // Whitelisted and verified doctors
    mapping(address => bool) public verifiedDoctors;

    event RecordUploaded(
        address indexed patient,
        string cid,
        string recordType
    );
    event DoctorAssigned(address indexed patient, address doctor);
    event DoctorVerified(address doctor);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    /// @notice Admin verifies a doctor
    function verifyDoctor(address doctor) external onlyAdmin {
        require(!verifiedDoctors[doctor], "Already verified");
        verifiedDoctors[doctor] = true;
        emit DoctorVerified(doctor);
    }

    /// @notice Patient assigns a verified doctor to themselves
    function assignDoctor(address doctor) external {
        require(verifiedDoctors[doctor], "Doctor not verified");
        require(!isDoctorOf(msg.sender, doctor), "Already assigned");
        assignedDoctors[msg.sender].push(doctor);
        emit DoctorAssigned(msg.sender, doctor);
    }

    /// @notice Add a medical record for a patient (by themselves or their doctor)
    function addRecord(
        string memory cid,
        string memory recordType,
        address patient
    ) external {
        require(
            msg.sender == patient || isDoctorOf(patient, msg.sender),
            "Unauthorized"
        );
        records[patient].push(
            Record({
                cid: cid,
                recordType: recordType,
                uploadedBy: msg.sender,
                timestamp: block.timestamp
            })
        );
        emit RecordUploaded(patient, cid, recordType);
    }

    /// @notice Fetch records for a patient (if authorized)
    function getRecords(
        address patient
    ) external view returns (Record[] memory) {
        require(
            msg.sender == patient || isDoctorOf(patient, msg.sender),
            "Unauthorized"
        );
        return records[patient];
    }

    /// @notice Check if doctor is assigned to patient
    function isDoctorOf(
        address patient,
        address doctor
    ) public view returns (bool) {
        address[] memory doctors = assignedDoctors[patient];
        for (uint256 i = 0; i < doctors.length; i++) {
            if (doctors[i] == doctor) return true;
        }
        return false;
    }
}
