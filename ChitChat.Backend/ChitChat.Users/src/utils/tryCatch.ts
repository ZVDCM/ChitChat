import logger from './logger.js';

const tryCatch = (fn: (...args: any) => Promise<any>) => {
    return async (...args: any) => {
        try {
            return await fn(...args);
        } catch (error) {
            logger.error(error);
        }
    };
};

export default tryCatch;
