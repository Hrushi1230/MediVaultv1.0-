import { expect } from "chai";
import { ethers } from "hardhat";
import { MediVault, DoctorID, PatientID, DoctorID__factory, PatientID__factory, MediVault__factory } from "../typechain-types";

describe("Gas Benchmark - MediVault", () => {
  let mediVault: MediVault;
  let doctorID: DoctorID;
  let patientID: PatientID;

  let admin: any;
  let doctor: any;
  let patient: any;
beforeEach(async () => {
  [admin, doctor, patient] = await ethers.getSigners();

  // Deploy MediVault
  const MediVaultFactory = new MediVault__factory(admin);
  mediVault = await MediVaultFactory.deploy();
  await mediVault.waitForDeployment();

  // Admin verifies doctor
  await mediVault.connect(admin).verifyDoctor(doctor.address);

  // ✅ Patient assigns doctor to self
  await mediVault.connect(patient).assignDoctor(doctor.address);
});


 
  it("📦 addRecord should cost less than 150,000 gas", async () => {
    const tx = await mediVault
      .connect(doctor)
      .addRecord("ipfs://CID-EXAMPLE", "Diagnosis", patient.address);

    const receipt = await tx.wait();
    const gasUsed = Number(receipt?.gasUsed);

    console.log("⛽ Gas used:", gasUsed);
    expect(gasUsed).to.be.lessThan(150_000);
  });
});
