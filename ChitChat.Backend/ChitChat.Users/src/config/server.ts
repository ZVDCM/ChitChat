import { ApolloServer } from '@apollo/server';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { userResolver, userTypeDef } from '../graphql/schemas/userSchema.js';
import { startStandaloneServer } from '@apollo/server/standalone';

const startServer = async (): Promise<string> => {
    const mergedTypeDefs = mergeTypeDefs([userTypeDef]);
    const mergedResolvers = mergeResolvers([userResolver]);

    const schema = makeExecutableSchema({
        typeDefs: mergedTypeDefs,
        resolvers: mergedResolvers,
    });
    const server = new ApolloServer({ schema });
    
    const port = process.env.PORT;
    const { url } = await startStandaloneServer(server, {
        listen: { port: Number(port) },
    });

    return url;
};

export default startServer;
