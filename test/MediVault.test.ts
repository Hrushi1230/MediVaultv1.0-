import { ethers } from "hardhat";
import { expect } from "chai";
import { MediVault } from "../typechain-types";

describe("MediVault", () => {
  let admin: any, doctor: any, patient: any, stranger: any;
  let vault: MediVault;

  beforeEach(async () => {
    [admin, doctor, patient, stranger] = await ethers.getSigners();
    const Vault = await ethers.getContractFactory("MediVault");
    vault = await Vault.connect(admin).deploy();
    await vault.waitForDeployment();
  });

  it("✅ should verify a doctor by admin", async () => {
    await expect(vault.connect(admin).verifyDoctor(doctor.address))
      .to.emit(vault, "DoctorVerified")
      .withArgs(doctor.address);
    expect(await vault.verifiedDoctors(doctor.address)).to.equal(true);
  });

  it("✅ should assign a verified doctor to a patient", async () => {
    await vault.connect(admin).verifyDoctor(doctor.address);
    await expect(vault.connect(patient).assignDoctor(doctor.address))
      .to.emit(vault, "DoctorAssigned")
      .withArgs(patient.address, doctor.address);
  });

  it("✅ should allow patient to upload their own record", async () => {
    await expect(
      vault.connect(patient).addRecord("cid-patient", "Diagnosis", patient.address)
    ).to.emit(vault, "RecordUploaded");

    const records = await vault.connect(patient).getRecords(patient.address);
    expect(records.length).to.equal(1);
    expect(records[0].cid).to.equal("cid-patient");
    expect(records[0].recordType).to.equal("Diagnosis");
    expect(records[0].uploadedBy).to.equal(patient.address);
  });

  it("✅ should allow assigned doctor to upload a record", async () => {
    await vault.connect(admin).verifyDoctor(doctor.address);
    await vault.connect(patient).assignDoctor(doctor.address);

    await expect(
      vault.connect(doctor).addRecord("cid123", "X-ray", patient.address)
    ).to.emit(vault, "RecordUploaded");

    const records = await vault.connect(doctor).getRecords(patient.address);
    expect(records.length).to.equal(1);
    expect(records[0].cid).to.equal("cid123");
    expect(records[0].uploadedBy).to.equal(doctor.address);
  });

  it("❌ should block unassigned doctor from uploading record", async () => {
    await vault.connect(admin).verifyDoctor(doctor.address);

    await expect(
      vault.connect(doctor).addRecord("cid123", "Test", patient.address)
    ).to.be.revertedWith("Unauthorized");
  });

  it("❌ should block unauthorized user from reading records", async () => {
    // Patient uploads their record
    await vault.connect(patient).addRecord("cid-private", "X-ray", patient.address);

    await expect(
      vault.connect(stranger).getRecords(patient.address)
    ).to.be.revertedWith("Unauthorized");
  });


  it("❌ should prevent re-assigning same doctor", async () => {
  await vault.connect(admin).verifyDoctor(doctor.address);
  await vault.connect(patient).assignDoctor(doctor.address);

  await expect(
    vault.connect(patient).assignDoctor(doctor.address)
  ).to.be.revertedWith("Already assigned");
});

it("✅ patient should read their own records", async () => {
  await vault.connect(patient).addRecord("cid-own", "Report", patient.address);

  const records = await vault.connect(patient).getRecords(patient.address);
  expect(records.length).to.equal(1);
  expect(records[0].cid).to.equal("cid-own");
});
});
