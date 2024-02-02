import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { CHAT_GQL, CHAT_WS } from '@consts/server';
import splitLink from '@utils/splitLink';
import { createClient } from 'graphql-ws';

const httpLink = new HttpLink({
    uri: CHAT_GQL,
});

const wsLink = new GraphQLWsLink(
    createClient({
        url: CHAT_WS,
    })
);

const chatClient = new ApolloClient({
    link: splitLink(wsLink, httpLink),
    cache: new InMemoryCache(),
});

export default chatClient;
