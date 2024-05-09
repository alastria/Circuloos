import api from "./exposition/api/api";
import { startDefaultLogger, logger } from "./helpers/logger.helper";
import { startLogger } from "./bootstrap/log.bootstrap";
import { initConfig } from "./bootstrap/config.bootstrap";
import { deployContract } from "./bootstrap/contract.bootstrap";

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
    const contract = await deployContract('Storage', logger);

    // API
    logger.info("STARTING API EXPOSITION");
    api(config, logger, contract);

    return 0;
  } catch (error: any) {
    logger.error(error.message);
    return undefined;
  }
}

module.exports = startApp();
