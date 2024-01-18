import { ApolloServer, BaseContext } from '@apollo/server';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import { Express } from 'express';
import http from 'http';
import { userTypeDef, userResolver } from '../../graphql/userSchema.js';

interface IReturn {
    apolloServer: ApolloServer<BaseContext>;
    httpServer: http.Server;
}

export interface IContext {
    token?: string;
}

const server = (app: Express): IReturn => {
    const httpServer = http.createServer(app);

    const typeDefs = mergeTypeDefs([userTypeDef]);
    const resolvers = mergeResolvers([userResolver]);
    const schema = makeExecutableSchema({ typeDefs, resolvers });

    const apolloServer = new ApolloServer<IContext>({
        schema,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });

    return { apolloServer, httpServer };
};

export default server;
