import 'dotenv/config';
import logger from './utils/logger.js';
import express from 'express';
import cors from 'cors';
import { expressMiddleware } from '@apollo/server/express4';
import server from './config/server.js';
import startDatabase from './config/database.js';

const app = express();
const { apolloServer, httpServer } = server(app);
await apolloServer.start();

app.use(
    '/graphql',
    cors<cors.CorsRequest>({
        origin: ['http://localhost:5173'],
        credentials: true,
    }),
    express.json(),
    expressMiddleware(apolloServer)
);

const start = async () => {
    try {
        await startDatabase();
        logger.info(`Database ready`);

        await new Promise<void>((resolve) =>
            httpServer.listen({ port: process.env.PORT }, resolve)
        );
        logger.info(
            `Server ready at: http://localhost:${process.env.PORT}/graphql`
        );
    } catch (error) {
        logger.error(error);
    }
};

await start();
