import 'dotenv/config';
import logger from './utils/logger.js';
import tryCatch from './utils/tryCatch.js';
import startServer from './config/server.js';
import startDatabase from './config/database.js';

const start = tryCatch(
    async (): Promise<{
        url: string;
        database: FirebaseFirestore.Firestore;
    }> => {
        const app = await startDatabase();
        const database = app.firestore();
        logger.info(`Database ready`);

        const url = await startServer();
        logger.info(`Server ready at: ${url}`);

        return { url, database };
    }
);

export const { url, database } = await start();
