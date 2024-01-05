import winston from 'winston';
import 'winston-daily-rotate-file';

const { combine, colorize, timestamp, align, printf, json, errors } =
    winston.format;

const logger = winston.createLogger({
    level: 'info',
    format: combine(
        errors({ stack: true }),
        timestamp({
            format: 'YYYY-MM-DD hh:mm:ss.SSS A',
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
            filename: '%DATE%.log',
            dirname: 'logs/infos',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '14d',
        }),
        new winston.transports.DailyRotateFile({
            level: 'error',
            filename: '%DATE%.log',
            dirname: 'logs/errors',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '14d',
        }),
    ],
    exceptionHandlers: [
        new winston.transports.DailyRotateFile({
            filename: '%DATE%.log',
            dirname: 'logs/exceptions',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '14d',
        }),
    ],
});

export default logger;
