import { rabbitMQ } from '../index.js';
import logger from '../utils/logger.js';

const queueName = 'users';

const userMessaged = () => {
    rabbitMQ.consume(queueName, async (data) => {
        logger.info(data);
    });
};

export default userMessaged;
