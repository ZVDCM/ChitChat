import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { CHITCHAT_USERS_GQL } from '@consts/server';

const httpLink = new HttpLink({
    uri: CHITCHAT_USERS_GQL,
});

const userClient = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache({
        addTypename: false,
    }),
});

export default userClient;
