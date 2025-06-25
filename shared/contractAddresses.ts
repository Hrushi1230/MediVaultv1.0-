export const CONTRACT_ADDRESSES = {
  PatientID: "0xac3533DF99E37d33c3668Aa966bb7528d2196c37",
  DoctorID: "0xDB009D2E8968f4832620575ee67312A6496c1DBD",
  MedicalProfileNFT: "0x0820bbfb43ED0A6E1154fd797Df910c4e1b76F0F",
  MediVault: "0xf3F01D8DaCd19D6765C23535710573f63983e06F",
};
export const CONTRACT_ABI = {
  PatientID: [
    "function getPatientId(address patient) view returns (uint256)",
    "function registerPatient(address patient, uint256 id) external",
  ],
  DoctorID: [
    "function getDoctorId(address doctor) view returns (uint256)",
    "function registerDoctor(address doctor, uint256 id) external",
  ],
  MedicalProfileNFT: [
    "function mintProfileNFT(address to, string memory tokenURI) external",
    "function getProfileNFT(uint256 tokenId) view returns (string memory)",
  ],
  MediVault: [
    "function storeData(uint256 profileId, string memory data) external",
    "function retrieveData(uint256 profileId) view returns (string memory)",
  ],
};