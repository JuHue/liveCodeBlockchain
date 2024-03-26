require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    localhost: {
      url: "http://0.0.0.0:8545"
    },
    // sepolia: {
    //   url: SEPOLIA_URL,
    //   accounts: [PRIVATE_KEY],
    //   chainId: 11155111,
    // }
  }
};
