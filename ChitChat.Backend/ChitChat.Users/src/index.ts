import 'dotenv/config';
import Admin from 'firebase-admin';
import logger from './utils/logger.js';
import tryCatch from './utils/tryCatch.js';
import startServer from './config/server.js';
import startDatabase from './config/database.js';

const start = tryCatch(
    async (): Promise<{
        url: string;
        admin: Admin.app.App;
        database: FirebaseFirestore.Firestore;
    }> => {
        const admin = await startDatabase();
        const database = admin.firestore();
        logger.info(`Database ready`);

        const url = await startServer();
        logger.info(`Server ready at: ${url}`);

        return { url, admin, database };
    }
);

export const { url, admin, database } = await start();
