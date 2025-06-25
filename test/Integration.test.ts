import { expect } from "chai";
import { ethers } from "hardhat";

describe("🌍 Integration - MediVault Flow", () => {
  let admin: any, doctor: any, patient: any, stranger: any;
  let doctorID: any, patientID: any, medNFT: any, vault: any;

  beforeEach(async () => {
    [admin, doctor, patient, stranger] = await ethers.getSigners();

    const DoctorFactory = await ethers.getContractFactory("DoctorID");
    doctorID = await DoctorFactory.connect(admin).deploy();

    const PatientFactory = await ethers.getContractFactory("PatientID");
    patientID = await PatientFactory.connect(admin).deploy();

    const MedNFTFactory = await ethers.getContractFactory("MedicalProfileNFT");
    medNFT = await MedNFTFactory.connect(admin).deploy();

    const VaultFactory = await ethers.getContractFactory("MediVault");
    vault = await VaultFactory.connect(admin).deploy();

    // Mint NFTs
    await doctorID.connect(admin).mint(doctor.address, "ipfs://doc-meta");
    await patientID.connect(admin).mint(patient.address, "ipfs://patient-meta");

    // Verify and assign
    await vault.connect(admin).verifyDoctor(doctor.address);
    await vault.connect(patient).assignDoctor(doctor.address);
  });

  it("✅ Full Flow: doctor adds record, patient retrieves", async () => {
    const cid = "ipfs://record-cid";
    const type = "Diagnosis";

    // Doctor uploads record
    await expect(
      vault.connect(doctor).addRecord(cid, type, patient.address)
    ).to.emit(vault, "RecordUploaded");

    // Patient retrieves it
    const records = await vault.connect(patient).getRecords(patient.address);
    expect(records.length).to.equal(1);
    expect(records[0].cid).to.equal(cid);
    expect(records[0].recordType).to.equal(type);
    expect(records[0].uploadedBy).to.equal(doctor.address);
  });

  it("❌ Stranger cannot view patient's records", async () => {
    const cid = "ipfs://private";
    await vault.connect(doctor).addRecord(cid, "Test", patient.address);

    await expect(
      vault.connect(stranger).getRecords(patient.address)
    ).to.be.revertedWith("Unauthorized");
  });
});
