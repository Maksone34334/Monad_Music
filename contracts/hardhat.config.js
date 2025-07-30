// Hardhat configuration for Pods Music PlaylistNFT
//
// This config sets up a Monad testnet network so you can deploy the
// PlaylistNFT contract on Monad.  It also includes the default Hardhat
// network for local testing.  Replace `process.env.PRIVATE_KEY` with your
// deployer private key (load from an .env file or export it in your shell).

require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

module.exports = {
  solidity: {
    version: "0.8.17",
    settings: {
      metadata: {
        bytecodeHash: "none", // disable ipfs
        useLiteralContent: true // store source code in the json file directly
      }
    }
  },
  networks: {
    hardhat: {},
    monad: {
      url: process.env.MONAD_RPC_URL || 'https://testnet-rpc.monad.xyz',
      chainId: 10143,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    }
  },
  sourcify: {
    enabled: true,
    apiUrl: "https://sourcify-api-monad.blockvision.org",
    browserUrl: "https://testnet.monadexplorer.com"
  },
  etherscan: {
    enabled: false
  }
};