import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);

  // 1. Deploy PatientID
  const PatientID = await ethers.getContractFactory("PatientID");
  const patientId = await PatientID.deploy();
  await patientId.waitForDeployment();
  console.log("✅ PatientID deployed at:", await patientId.getAddress());

  // 2. Deploy DoctorID
  const DoctorID = await ethers.getContractFactory("DoctorID");
  const doctorId = await DoctorID.deploy();
  await doctorId.waitForDeployment();
  console.log("✅ DoctorID deployed at:", await doctorId.getAddress());

  // 3. Deploy MedicalProfileNFT
  const MedicalProfileNFT = await ethers.getContractFactory("MedicalProfileNFT");
  const medicalNFT = await MedicalProfileNFT.deploy();
  await medicalNFT.waitForDeployment();
  console.log("✅ MedicalProfileNFT deployed at:", await medicalNFT.getAddress());

  // 4. Deploy MediVault
  const MediVault = await ethers.getContractFactory("MediVault");
  const mediVault = await MediVault.deploy();
  await mediVault.waitForDeployment();
  console.log("✅ MediVault contract deployed at:", await mediVault.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
