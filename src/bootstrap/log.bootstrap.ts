import Logger from "../helpers/logger.helper";

export function startLogger(config: any, logger: Logger) {
  logger.changeAppName(config.SERVICE_NAME);
  logger.changeLogLevels(
    config.LOG_LEVELS.LOG_LEVEL_SYSTEM,
    config.LOG_LEVELS.LOG_LEVEL_FILE
  );
}
