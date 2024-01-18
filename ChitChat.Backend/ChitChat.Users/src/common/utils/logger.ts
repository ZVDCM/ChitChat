import winston from 'winston';
import 'winston-daily-rotate-file';

const { combine, colorize, timestamp, align, printf, json, errors } =
    winston.format;

const logger = winston.createLogger({
    level: 'info',
    format: combine(
        errors({ stack: true }),
        timestamp({
            format: process.env.LOGGER_TIMESTAMP,
        }),
        json()
    ),
    transports: [
        new winston.transports.Console({
            format: combine(
                colorize({ all: true }),
                align(),
                printf((info) => {
                    if (info.stack) {
                        return `[${info.timestamp}] ${info.level}: ${info.message}\n${info.stack}`;
                    }
                    return `[${info.timestamp}] ${info.level}: ${info.message}`;
                })
            ),
        }),
        new winston.transports.DailyRotateFile({
            filename: process.env.LOG_FILENAME,
            dirname: process.env.LOG_INFO_DIRECTORY,
            datePattern: process.env.LOG_DATE_PATTERN,
            maxFiles: process.env.LOGGER_MAX_FILES,
        }),
        new winston.transports.DailyRotateFile({
            level: 'error',
            filename: process.env.LOG_FILENAME,
            dirname: process.env.LOG_ERROR_DIRECTORY,
            datePattern: process.env.LOG_DATE_PATTERN,
            maxFiles: process.env.LOGGER_MAX_FILES,
        }),
    ],
    exceptionHandlers: [
        new winston.transports.DailyRotateFile({
            filename: process.env.LOG_FILENAME,
            dirname: process.env.LOG_EXCEPTION_DIRECTORY,
            datePattern: process.env.LOG_DATE_PATTERN,
            maxFiles: process.env.LOGGER_MAX_FILES,
        }),
    ],
    exitOnError: false,
});

export default logger;
