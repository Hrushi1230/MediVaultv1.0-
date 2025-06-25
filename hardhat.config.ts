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
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [process.env.PRIVATE_KEY!],
    },
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
