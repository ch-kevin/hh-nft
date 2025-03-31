import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import '@nomicfoundation/hardhat-ethers';
import 'hardhat-deploy';
import 'hardhat-deploy-ethers';

import "dotenv/config";
import "hardhat-gas-reporter";


const SEPOLIA_URL: string = process.env.SEPOLIA_URL as string;
const AMOY_URL: string = process.env.AMOY_URL as string;
const PRIVITE_KEY1: string = process.env.PRIVITE_KEY1 as string;
const PRIVITE_KEY2: string = process.env.PRIVITE_KEY2 as string;
const ETHERSCAN_KEYS: string = process.env.ETHERSCAN_KEYS as string;

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  solidity: "0.8.28",
  mocha:{
    timeout: 300000
  },
  networks: {
    sepolia: {
      url: SEPOLIA_URL,
      accounts: [PRIVITE_KEY1, PRIVITE_KEY2],
      chainId: 11155111,
      allowBlocksWithSameTimestamp: true
    },
    amoy: {
      url: AMOY_URL,
      accounts: [PRIVITE_KEY1, PRIVITE_KEY2],
      chainId: 80002,
      allowBlocksWithSameTimestamp: true
    }
  },
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_KEYS
    }
  }
  
  // sourcify: {
    // Disabled by default
    // Doesn't need an API key
    // enabled: true
  // }
  ,
  namedAccounts: {
    firstAccount: {
      default: 0
    },
    secondAccount: {
      default: 1
    },
  },
  gasReporter: {
    enabled: false
  }
};

export default config;
