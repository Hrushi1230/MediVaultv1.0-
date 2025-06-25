import { ethers } from "hardhat";
import { expect } from "chai";
import "@nomicfoundation/hardhat-chai-matchers";

describe("PatientID", function () {
  let owner: any;
  let patient: any;
  let PatientID: any;
  let patientID: any;

  beforeEach(async () => {
    [owner, patient] = await ethers.getSigners();
    PatientID = await ethers.getContractFactory("PatientID");
    patientID = await PatientID.deploy();
    await patientID.waitForDeployment();
  });

  it("should mint a soulbound NFT for a patient", async () => {
    await expect(patientID.mint(patient.address, "ipfs://sample"))
      .to.emit(patientID, "PatientRegistered");

    expect(await patientID.balanceOf(patient.address)).to.equal(1);
    expect(await patientID.tokenURI(0)).to.equal("ipfs://sample");
  });

  it("should prevent re-minting for same patient", async () => {
    await patientID.mint(patient.address, "ipfs://sample");
    await expect(
      patientID.mint(patient.address, "ipfs://sample2")
    ).to.be.revertedWith("Already minted");
  });

  it("should block all transfers (soulbound)", async () => {
    await patientID.mint(patient.address, "ipfs://sample");

    await expect(
      patientID.connect(patient).transferFrom(patient.address, owner.address, 0)
    ).to.be.revertedWith("Soulbound: non-transferable");
  });

  it("should allow owner to update metadata URI", async () => {
    await patientID.mint(patient.address, "ipfs://sample");
    await expect(patientID.updateURI(0, "ipfs://new-uri"))
      .to.emit(patientID, "PatientURIUpdated");

    expect(await patientID.tokenURI(0)).to.equal("ipfs://new-uri");
  });
});
