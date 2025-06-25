import { ethers } from "hardhat";
import { expect } from "chai";

describe("MedicalProfileNFT", () => {
  let admin: any, patient: any, other: any;
  let medNFT: any;

  beforeEach(async () => {
    [admin, patient, other] = await ethers.getSigners();
    const MedNFT = await ethers.getContractFactory("MedicalProfileNFT");
    medNFT = await MedNFT.connect(admin).deploy();
    await medNFT.waitForDeployment();
  });

  it("✅ should mint medical profile NFT", async () => {
    await expect(medNFT.connect(admin).mint(patient.address, "ipfs://record"))
      .to.emit(medNFT, "MedicalProfileMinted")
      .withArgs(patient.address, 0, "ipfs://record");

    expect(await medNFT.tokenURI(0)).to.equal("ipfs://record");
  });

  it("✅ should allow updating URI", async () => {
    await medNFT.connect(admin).mint(patient.address, "ipfs://record");

    await expect(medNFT.connect(admin).updateURI(0, "ipfs://updated"))
      .to.emit(medNFT, "MedicalProfileUpdated")
      .withArgs(patient.address, 0, "ipfs://updated");

    expect(await medNFT.tokenURI(0)).to.equal("ipfs://updated");
  });

  it("❌ should block transfer (soulbound)", async () => {
    await medNFT.connect(admin).mint(patient.address, "ipfs://record");

    await expect(
      medNFT.connect(patient).transferFrom(patient.address, other.address, 0)
    ).to.be.revertedWith("Soulbound: non-transferable");
  });
});
