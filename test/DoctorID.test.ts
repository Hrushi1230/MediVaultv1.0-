import { ethers } from "hardhat";
import { expect } from "chai";

describe("DoctorID", () => {
  let owner: any, doctor: any;
  let doctorID: any;

  beforeEach(async () => {
    [owner, doctor] = await ethers.getSigners();
    const DoctorID = await ethers.getContractFactory("DoctorID");
    doctorID = await DoctorID.deploy();
    await doctorID.waitForDeployment();
  });

  it("should mint doctor NFT by owner", async () => {
    await expect(doctorID.mint(doctor.address, "ipfs://doc"))
      .to.emit(doctorID, "DoctorRegistered");
    expect(await doctorID.balanceOf(doctor.address)).to.equal(1);
  });

  it("should prevent double mint", async () => {
    await doctorID.mint(doctor.address, "ipfs://doc");
    await expect(doctorID.mint(doctor.address, "ipfs://doc2"))
      .to.be.revertedWith("Already minted");
  });

  it("should allow owner to update metadata", async () => {
    await doctorID.mint(doctor.address, "ipfs://doc");
    await expect(doctorID.updateURI(0, "ipfs://newdoc"))
      .to.emit(doctorID, "DoctorURIUpdated");
    expect(await doctorID.tokenURI(0)).to.equal("ipfs://newdoc");
  });

  it("should block transfers (soulbound)", async () => {
    await doctorID.mint(doctor.address, "ipfs://doc");
    await expect(
      doctorID.connect(doctor).transferFrom(doctor.address, owner.address, 0)
    ).to.be.revertedWith("Soulbound: non-transferable");
  });
});
