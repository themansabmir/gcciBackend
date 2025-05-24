// logger.ts
import pino from 'pino';
import fs from 'fs';
import path from 'path';

// logger.config.ts
export const LoggerConfig = {
  level: process.env.LOG_LEVEL || 'info',
  enablePretty: process.env.NODE_ENV !== 'production',
  filePath: 'logs/app.log',
};

export class Logger {
  private static instance = Logger.createLogger();

  private static createLogger() {
    const logDir = path.dirname(LoggerConfig.filePath);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    if (LoggerConfig.enablePretty) {
      // Pretty printing in dev (stdout)
      return pino(
        {
          level: LoggerConfig.level,
          base: undefined,
          timestamp: pino.stdTimeFunctions.isoTime,
        },
        pino.transport({
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        }),
      );
    } else {
      // JSON logging to file in production
      const fileStream = pino.destination({ dest: LoggerConfig.filePath, sync: false });
      return pino(
        {
          level: LoggerConfig.level,
          base: undefined,
          timestamp: pino.stdTimeFunctions.isoTime,
        },
        fileStream,
      );
    }
  }

  static info(message: string, meta?: any) {
    Logger.instance.info(meta || {}, message);
  }

  static warn(message: string, meta?: any) {
    Logger.instance.warn(meta || {}, message);
  }

  static error(message: string, meta?: any) {
    Logger.instance.error(meta || {}, message);
  }

  static debug(message: string, meta?: any) {
    Logger.instance.debug(meta || {}, message);
  }
}
