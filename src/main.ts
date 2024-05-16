import api from "./exposition/api/api";
import { startDefaultLogger, logger } from "./helpers/logger.helper";
import { startLogger } from "./bootstrap/log.bootstrap";
import { initConfig } from "./bootstrap/config.bootstrap";
import { deployAllContracts } from "./bootstrap/contract.bootstrap";
import hre from "hardhat";
import '../type-extensions';

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

/**
 * Initialize the application
 */
async function startApp() {
  startDefaultLogger();

  logger.info("STARTING APPLICATION");

  try {
    // BOOTSTRAPPING
    logger.info("BOOTSTRAPING APPLICATION");
    const config = initConfig(process.env.CONFIG || "config.yaml");
    startLogger(config, logger);
    logger.info(`SWITCHING TO NETWORK: ${config.NETWORK}`);
    hre.changeNetwork(config.NETWORK);
    const contracts = await deployAllContracts(config, logger);

    // API
    logger.info("STARTING API EXPOSITION");
    api(config, logger, contracts);

    return 0;
  } catch (error: any) {
    logger.error(error);
    throw error;
  }
}

module.exports = startApp();
