import { ApolloServer } from "@apollo/server";
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { userResolver, userTypeDef } from "./graphql/schemas/userSchema.js";

const mergedTypeDefs = mergeTypeDefs([userTypeDef]);
const mergedResolvers = mergeResolvers([userResolver]);

const schema = makeExecutableSchema({
	typeDefs: mergedTypeDefs,
	resolvers: mergedResolvers,
});

const server = new ApolloServer({ schema });

export default server;