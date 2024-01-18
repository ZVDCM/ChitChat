import 'dotenv/config';
import logger from './common/utils/logger.js';
import express from 'express';
import cors from 'cors';
import { expressMiddleware } from '@apollo/server/express4';
import userMessaged from './consume/userMessaged.js';
import server from './common/config/server.js';
import startDatabase from './common/config/database.js';
import RabbitMQConnectionPool from './common/config/rabbitMQ.js';

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

const start = async (): Promise<RabbitMQConnectionPool | void> => {
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
};

export const rabbitMQ = (await start()) as RabbitMQConnectionPool;

userMessaged();
