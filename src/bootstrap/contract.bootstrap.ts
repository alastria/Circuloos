import { BaseContract } from 'ethers';
import { ethers } from 'hardhat';
import "@nomicfoundation/hardhat-ethers";
import Logger from "../helpers/logger.helper";

export async function deployContract(contractName: string, logger: Logger): Promise<BaseContract> {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  logger.info(`Deploying contract ${contractName}...`);
  const Contract = await ethers.getContractFactory(contractName);
  const contract = await Contract.deploy();
  await contract.waitForDeployment();
  logger.info(`Contract ${contractName} deployed correctly at ${await contract.getAddress()}`)

  return contract;
}