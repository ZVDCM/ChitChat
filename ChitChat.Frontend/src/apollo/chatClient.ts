import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { CHITCHAT_CHAT_GQL, CHITCHAT_CHAT_WS } from '@consts/server';
import splitLink from '@utils/splitLink';
import { createClient } from 'graphql-ws';

const httpLink = new HttpLink({
    uri: CHITCHAT_CHAT_GQL,
});

const wsLink = new GraphQLWsLink(
    createClient({
        url: CHITCHAT_CHAT_WS,
    })
);

const chatClient = new ApolloClient({
    link: splitLink(wsLink, httpLink),
    cache: new InMemoryCache({
        addTypename: false,
    }),
});

export default chatClient;
