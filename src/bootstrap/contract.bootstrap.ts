import { BaseContract } from "ethers";
import { ethers } from "hardhat";
import "@nomicfoundation/hardhat-ethers";
import Logger from "../helpers/logger.helper";

export async function deployContract(contractIdentifier: any, logger: Logger): Promise<BaseContract> {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  logger.info(`Deploying contract ${contractIdentifier.name}...`);
  
  const contractFactory = await ethers.getContractFactory(contractIdentifier.name);
  let contract;
  if (contractIdentifier.address) {
    contract = contractFactory.attach(contractIdentifier.address);
  } else {
    contract = await contractFactory.deploy();
    await contract.waitForDeployment();
  }
  logger.info(
    `Contract ${contractIdentifier.name} deployed correctly at ${await contract.getAddress()}`
  );

  return contract;
}

export async function deployAllContracts(config: any, logger: Logger): Promise<any> {
  const contracts: any = {};
  logger.info(`Deploying ${config.CONTRACTS.length} contracts...`);

  for (const contract of config.CONTRACTS) {
    contracts[contract.name] = await deployContract(contract, logger);
  }

  logger.info(`Deployed ${config.CONTRACTS.length} contracts successfully.`);
  return contracts;
}
