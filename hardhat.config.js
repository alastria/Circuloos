/** @type import('hardhat/config').HardhatUserConfig */
require("@nomicfoundation/hardhat-ethers");

module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 10
      },
      // Version of the EVM to compile for.
      // Affects type checking and code generation. Can be homestead,
      // tangerineWhistle, spuriousDragon, byzantium, constantinople,
      // petersburg, istanbul, berlin, london, paris, shanghai or cancun (default)
      "evmVersion": "cancun",
    }
  },
  paths: {
    sources: "./contracts",
    artifacts: "./artifacts"
  }
};
