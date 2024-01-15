import 'dotenv/config';
import logger from './utils/logger.js';
import express from 'express';
import cors from 'cors';
import { expressMiddleware } from '@apollo/server/express4';
import server from './config/server.js';
import startDatabase from './config/database.js';
import RabbitMQConnectionPool from './config/rabbitMQ.js';

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
    expressMiddleware(apolloServer, {
        context: async ({ req }) => ({ token: req.headers.token }),
    })
);

const start = async (): Promise<RabbitMQConnectionPool | false> => {
    try {
        await startDatabase();
        logger.info(`Database ready`);

        const uri = `amqp://${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`;
        const rabbitMQ = new RabbitMQConnectionPool(uri);
        logger.info(`RabbitMQ ready`);

        await new Promise<void>((resolve) =>
            httpServer.listen({ port: process.env.PORT }, resolve)
        );
        logger.info(
            `Server ready at: http://localhost:${process.env.PORT}/graphql`
        );

        return rabbitMQ;
    } catch (error) {
        logger.error(error);
    }
    return false;
};

export const rabbitMQ = await start();
