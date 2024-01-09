import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import 'dotenv/config';
import Admin from 'firebase-admin';
import logger from './utils/logger.js';
import tryCatch from './utils/tryCatch.js';
import startDatabase from './config/database.js';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { expressMiddleware } from '@apollo/server/express4';
import { userResolver, userTypeDef } from './graphql/schemas/userSchema.js';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

const start = tryCatch(
    async (): Promise<{
        admin: Admin.app.App;
        database: FirebaseFirestore.Firestore;
    }> => {
        const app = express();
        const httpServer = http.createServer(app);

        const admin = await startDatabase();
        const database = admin.firestore();
        logger.info(`Database ready`);

        const typeDefs = mergeTypeDefs([userTypeDef]);
        const resolvers = mergeResolvers([userResolver]);

        const server = new ApolloServer({
            typeDefs,
            resolvers,
            plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
        });
        await server.start();

        app.use(
            '/graphql',
            cors<cors.CorsRequest>({
                origin: ['http://localhost:5173/'],
            }),
            express.json(),
            expressMiddleware(server)
        );

        await new Promise<void>((resolve) =>
            httpServer.listen({ port: process.env.PORT }, resolve)
        );

        logger.info(
            `Server ready at: http://localhost:${process.env.PORT}/graphql`
        );
        return { admin, database };
    }
);

export const { admin, database } = await start();
