import { IContext } from '../config/server.js';
import Auth from '../firebase/auth.js';
import Users from '../firebase/users.js';
import { rabbitMQ } from '../index.js';
import { Message } from '../models/message.js';

export const userTypeDef = `#graphql
    type User{
        uid: ID!
        displayName: String!
        email: String!
    }

    type Query {
        getAllUsers: [User!]
    }

    type Mutation {
        messageUser(uid: ID!, message: String!): Boolean
    }
`;

const queueName = 'users';
export const userResolver = {
    Query: {
        async getAllUsers(_: any, __: any, context: IContext) {
            const credentials = await Auth.isAuth(context.token);
            const users = await Users.getAllUsers();
            return users.filter((user) => user.uid !== credentials.uid);
        },
    },
    Mutation: {
        async chatUser(_: any, { uid }: any, context: IContext) {
            const credentials = await Auth.isAuth(context.token);
            await rabbitMQ.send(
                queueName,
                JSON.stringify(new Message(credentials.uid, uid, 'HELLO WORLD'))
            );
            return true;
        },
    },
};
