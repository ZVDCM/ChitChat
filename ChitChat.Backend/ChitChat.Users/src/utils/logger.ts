import winston from 'winston';
import 'winston-daily-rotate-file';

const { combine, colorize, timestamp, align, printf, json, errors } =
    winston.format;

const logger = winston.createLogger({
    level: 'info',
    format: combine(
        errors({ stack: true }),
        timestamp({
            format: process.env.LOGGER_TIMESTAMP ?? 'YYYY-MM-DD hh:mm:ss.SSS A',
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
            filename: process.env.LOG_FILENAME ?? '%DATE%.log',
            dirname: process.env.LOG_INFO_DIRECTORY ?? 'logs/infos',
            datePattern: process.env.DATE_PATTERN ?? 'YYYY-MM-DD',
            maxFiles: process.env.LOGGER_MAX_FILES ?? '14d',
        }),
        new winston.transports.DailyRotateFile({
            level: 'error',
            filename: process.env.LOG_FILENAME ?? '%DATE%.log',
            dirname: process.env.LOG_ERROR_DIRECTORY ?? 'logs/errors',
            datePattern: process.env.DATE_PATTERN ?? 'YYYY-MM-DD',
            maxFiles: process.env.LOGGER_MAX_FILES ?? '14d',
        }),
    ],
    exceptionHandlers: [
        new winston.transports.DailyRotateFile({
            filename: process.env.LOG_FILENAME ?? '%DATE%.log',
            dirname: process.env.LOG_EXCEPTION_DIRECTORY ?? 'logs/exceptions',
            datePattern: process.env.DATE_PATTERN ?? 'YYYY-MM-DD',
            maxFiles: process.env.LOGGER_MAX_FILES ?? '14d',
        }),
    ],
});

export default logger;
