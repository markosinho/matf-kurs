import winston from 'winston';
const {createLogger, format, transports} = winston;
const DailyRotateFile = require('winston-daily-rotate-file');
import path from 'path';

export class Logger {
    static async setup(baseUrl: string, config: any) {
        // If config file has logging config, we can use it
        if (!config || !config.logging) {
            throw new Error(`Logging configuration not available`);
        }        
        
        const loggingConfig = config.logging;
        const logPath = path.join(baseUrl, loggingConfig.logPath);

        // If log directory doesn't exist, create it
        await createDir(logPath);

        winston.level = loggingConfig.level;

        // Create logger with setting up level of logging and print format
        const logger = createLogger({
            level: loggingConfig.level,
            format: format.combine(
                format.splat(),
                format.timestamp({
                    format: "YYYY-MM-DDTHH:mm:ss.SSSZ"
                }),
                format.printf(info => `${new Date().toISOString()} ${info.level.toUpperCase()} [${process.pid}] ${info.message}`)
            ),
            defaultMeta: {service: 'webshop'}
        });

        winston.remove(winston.transports.Console);
        // Add console if not in production

        // Console transport added because of heroku deployment. Logs from heroku are retrieved if they can be found in console
        // TODO: Check this solution for later usage, when in real production
        if (process.env.NODE_ENV !== 'production') {
            logger.add(new transports.Console({
                level: loggingConfig.level,
                format: format.combine(
                    format.colorize({all: true})
                )
            }));
        }

        if (loggingConfig.fileRotateConfig.filename === undefined) {
            throw new Error('No file rotate config definiton for logger');
        }

        // Add rotation if there is a config for rotate
        if (loggingConfig.hasOwnProperty('fileRotateConfig')) {
            logger.add(new DailyRotateFile({
                level: loggingConfig.level,
                filename: `${logPath}/${loggingConfig.fileRotateConfig.filename}`,
                datePattern: loggingConfig.fileRotateConfig.datePattern,
                prepend: true,
                json: loggingConfig.fileRotateConfig.json,
                maxSize: loggingConfig.fileRotateConfig.maxsize,
                maxFiles: loggingConfig.fileRotateConfig.maxFiles
            }));
        }

        winston.add(logger);        
    }
}


import fs from 'fs';
import util from 'util';
const mkdir = util.promisify(fs.mkdir);
const fileStat = util.promisify(fs.stat);

/**
 * Creates directory with given path if it doesn't exist
 * @param path
 * @returns {Promise<void>}
 */
const createDir = async (path: string) => {
    // Check if log directory already exists
    try {
        await fileStat(path);
    } catch (err) {
        if (err.code === 'ENOENT') {
            // Create log directory if it doesn't exist
            await mkdir(path, {recursive: true});
        } else {
            throw err;
        }
    }
};