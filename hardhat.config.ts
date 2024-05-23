/** @type import('hardhat/config').HardhatUserConfig */
import "@nomicfoundation/hardhat-ethers";

import { HardhatEthersProvider } from "@nomicfoundation/hardhat-ethers/internal/hardhat-ethers-provider";
import { extendEnvironment } from "hardhat/config";
import { EthereumProvider } from "hardhat/types/provider";
import { createProvider } from "hardhat/internal/core/providers/construction";
import { ethers } from "ethers";

extendEnvironment((hre) => {
  // We add a field to the Hardhat Runtime Environment here.
  // We use lazyObject to avoid initializing things until they are actually
  // needed.
  const providers: { [name: string]: EthereumProvider } = {};

  hre.getProvider = async function getProvider(
    name: string
  ): Promise<EthereumProvider> {
    if (!providers[name]) {
      providers[name] = await createProvider(this.config, name, this.artifacts);
    }
    return providers[name];
  };

  hre.changeNetwork = async function changeNetwork(newNetwork: string) {
    if (!this.config.networks[newNetwork]) {
      throw new Error(`changeNetwork: Couldn't find network '${newNetwork}'`);
    }

    if (!providers[this.network.name]) {
      providers[this.network.name] = this.network.provider;
    }

    this.network.name = newNetwork;
    this.network.config = this.config.networks[newNetwork];
    this.network.provider = await this.getProvider(newNetwork);

    if (this.ethers) {
      this.ethers.provider = new HardhatEthersProvider(
        this.network.provider,
        newNetwork
      );
    }
  };
});

module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 10,
      },
      // Version of the EVM to compile for.
      // Affects type checking and code generation. Can be homestead,
      // tangerineWhistle, spuriousDragon, byzantium, constantinople,
      // petersburg, istanbul, berlin, london, paris, shanghai or cancun (default)
      evmVersion: "berlin",
    },
  },
  paths: {
    sources: "./contracts",
    artifacts: "./artifacts",
  },
  networks: {
    hardhat: {},
    redB: {
      url: "http://194.164.195.39:8545/",
      accounts: [ethers.Wallet.createRandom().privateKey],
    },
  },
};
