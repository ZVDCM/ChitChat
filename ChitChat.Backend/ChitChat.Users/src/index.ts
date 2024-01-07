import dotenv from 'dotenv';
import logger from './utils/logger.js';
import tryCatch from './utils/tryCatch.js';
import startServer from './server/server.js';
import startDatabase from './database/database.js';
import { Firestore, getFirestore } from 'firebase/firestore';

dotenv.config({ path: '../.env' });

const start = tryCatch(
    async (): Promise<{ url: string; database: Firestore }> => {
        const app = startDatabase();
        const database = getFirestore(app);
        logger.info(`Database ready`);

        const url = await startServer();
        logger.info(`Server ready at: ${url}`);

        return { url, database };
    }
);

export const { url, database } = await start();
