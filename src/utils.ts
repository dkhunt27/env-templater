import { Logger, type LogLevel } from '@nestjs/common';

export const setLogger = (params: { context: string; logLevels?: LogLevel[] }) => {
  const context = params.context;

  // we want to log out the "log" or "info" levels and above by default
  const logLevels = params.logLevels || ['fatal', 'error', 'warn', 'log'];

  const logger = new Logger(context);

  if (logger.localInstance.setLogLevels) {
    logger.localInstance.setLogLevels(logLevels);
  }
  return logger;
};
