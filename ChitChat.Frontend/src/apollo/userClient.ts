import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { USERS_GQL, USERS_WS } from '@consts/server';
import splitLink from '@utils/splitLink';
import { createClient } from 'graphql-ws';

const httpLink = new HttpLink({
    uri: USERS_GQL,
});

const wsLink = new GraphQLWsLink(
    createClient({
        url: USERS_WS,
    })
);

const userClient = new ApolloClient({
    link: splitLink(wsLink, httpLink),
    cache: new InMemoryCache(),
});

export default userClient;
