import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers";
import * as dotenv from "dotenv";
import "hardhat-gas-reporter";
import "@typechain/hardhat";
import "@nomicfoundation/hardhat-chai-matchers";

dotenv.config();

// Dynamically add sepolia only if both values exist
const networks: HardhatUserConfig["networks"] = {
  hardhat: {},
};

if (process.env.SEPOLIA_RPC && process.env.SEPOLIA_KEY) {
  networks.sepolia = {
    url: process.env.SEPOLIA_RPC,
    accounts: [process.env.SEPOLIA_KEY],
  };
}

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  defaultNetwork: "hardhat",
  networks,
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY ?? "",
    },
  },
  gasReporter: {
    enabled: true,
    currency: "INR",
    outputFile: "gas-report.txt",
    noColors: true,
  },
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6",
  },
};

export default config;
