import { startStandaloneServer } from '@apollo/server/standalone';
import dotenv from 'dotenv';
import server from './server.js';
import logger from './utils/logger.js';
import tryCatch from './utils/tryCatch.js';

dotenv.config({ path: '../.env' });

const PORT = process.env.LOG_LEVEL || '4000';

const start = tryCatch(async () => {
    const { url } = await startStandaloneServer(server, {
        listen: { port: parseInt(PORT) },
    });
    logger.info(`🚀  Server ready at: ${url}`);
});

await start();
