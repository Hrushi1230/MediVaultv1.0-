import { ethers } from "hardhat";
import { expect } from "chai";
import { MediVault } from "../typechain-types";

describe("Gas Benchmark - MediVault", () => {
  it("📦 addRecord should cost less than 150,000 gas", async () => {
    const [admin, doctor, patient] = await ethers.getSigners();

    const VaultFactory = await ethers.getContractFactory("MediVault");
    const vault = (await VaultFactory.deploy()) as MediVault;

    await vault.verifyDoctor(doctor.address);
    await vault.connect(patient).assignDoctor(doctor.address);

    const tx = await vault.connect(doctor).addRecord("ipfs://CID", "X-Ray", patient.address);
    const receipt = await tx.wait();

    if (receipt) {
      console.log("⛽ Gas used:", receipt.gasUsed.toString());
      expect(receipt.gasUsed).to.be.lessThan(150_000);
    } else {
      throw new Error("Transaction receipt is null");
    }
  });
});
