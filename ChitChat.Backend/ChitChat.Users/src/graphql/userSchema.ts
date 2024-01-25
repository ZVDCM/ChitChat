import moment from 'moment';
import { IContext } from '../common/config/server.js';
import Auth from '../firebase/auth.js';
import Users from '../firebase/users.js';
import { IUser } from '../common/models/user.js';
import { Message } from '../common/models/message.js';
import MessageChat from '../common/events/messageChat.js';
import { rabbitMQ } from '../index.js';

export const userTypeDef = `#graphql
    type User{
        uid: ID!
        displayName: String!
        email: String!
    }

    type Query {
        getAllUsers: [User!]
    }

    input UserInput{
        uid: ID!
        displayName: String!
        email: String!
    }

    input MessageChatInput{
        chatId: ID
        users: [UserInput!]!
        message: String!
    }

    type Mutation {
        messageChat(input: MessageChatInput!): Boolean
    }
`;

const queueName = 'USERS';
interface IMessageChat {
    input: {
        chatId: string | null;
        users: IUser[];
        message: string;
    };
}
export const userResolver = {
    Query: {
        async getAllUsers(_: any, __: any, context: IContext) {
            const credentials = await Auth.isAuth(context.token);
            const users = await Users.getAllUsers(credentials.uid);
            return users;
        },
    },
    Mutation: {
        async messageChat(
            _: any,
            { input: { chatId, users, message } }: IMessageChat,
            context: IContext
        ) {
            const now = moment().format();
            const credentials = await Auth.isAuth(context.token);
            const newMessage = new Message(credentials.uid, message, now);
            const chat = new MessageChat(chatId, users, newMessage, now);
            const data = JSON.stringify(chat);
            await rabbitMQ.send(queueName, data);
            return true;
        },
    },
};
