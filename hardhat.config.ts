import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers";
import * as dotenv from "dotenv";
import "hardhat-gas-reporter";
import "@typechain/hardhat";
import "@nomicfoundation/hardhat-chai-matchers"; // instead of Waffle

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  defaultNetwork: "hardhat", // Only local in CI

  networks: {
    sepolia: process.env.SEPOLIA_RPC && process.env.SEPOLIA_KEY
      ? {
          url: process.env.SEPOLIA_RPC,
          accounts: [process.env.SEPOLIA_KEY],
        }
      : undefined,
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY!,
    },
  },
  gasReporter: {
    enabled: true,
    currency: "INR", // or "USD"
    outputFile: "gas-report.txt",
    noColors: true
  },
   typechain: {
    outDir: "typechain-types",
    target: "ethers-v6",
  },
};

export default config;
