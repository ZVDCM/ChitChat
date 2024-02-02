import { ApolloServer, BaseContext } from '@apollo/server';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import { chatTypeDef, chatResolver } from '../../graphql/chatSchema.js';
import { Express } from 'express';
import { createServer, Server } from 'http';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

interface IReturn {
    apolloServer: ApolloServer<BaseContext>;
    httpServer: Server;
}

export interface IContext {
    token?: string;
}

const server = (app: Express): IReturn => {
    const httpServer = createServer(app);

    const typeDefs = mergeTypeDefs([chatTypeDef]);
    const resolvers = mergeResolvers([chatResolver]);
    const schema = makeExecutableSchema({ typeDefs, resolvers });

    const wsServer = new WebSocketServer({
        server: httpServer,
    });

    const serverCleanup = useServer({ schema }, wsServer);

    const apolloServer = new ApolloServer<IContext>({
        schema,
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        },
                    };
                },
            },
        ],
    });

    return { apolloServer, httpServer };
};

export default server;
