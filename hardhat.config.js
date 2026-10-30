require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000001";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
      evmVersion: "cancun",
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    mstTestnet: {
      url: process.env.MST_TESTNET_RPC || "https://testnetrpc.mstblockchain.com",
      chainId: 91562037,
      accounts: [PRIVATE_KEY],
    },
    mstMainnet: {
      url: process.env.MST_MAINNET_RPC || "https://mariorpc.mstblockchain.com",
      chainId: 4646,
      accounts: [PRIVATE_KEY],
    },
  },
};
