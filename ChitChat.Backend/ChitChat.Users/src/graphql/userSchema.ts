import { IContext } from '../common/config/server.js';
import Auth from '../firebase/auth.js';
import Users from '../firebase/users.js';
import { Message } from '../common/models/message.js';
import MessageChat from '../common/events/messageChat.js';
import { rabbitMQ } from '../index.js';
import CreateChat from '../common/events/createChat.js';
import { IUser } from '../common/models/user.js';
import Queue from '../common/consts/queues.js';
import moment from 'moment';

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

    input CreateChatInput{
        users: [UserInput!]!
    }

    input MessageChatInput{
        chatId: ID
        message: String!
    }

    type Mutation {
        createChat(input: CreateChatInput!): Boolean
        messageChat(input: MessageChatInput!): Boolean
    }
`;

interface ICreateChatInput {
    input: {
        users: IUser[];
    };
}
interface IMessageChatInput {
    input: {
        chatId: string;
        message: string;
    };
}
export const userResolver = {
    Query: {
        async getAllUsers(_: any, __: any, context: IContext) {
            const { user } = await Auth.isAuth(context.token);
            const users = await Users.getAllUsers(user.uid);
            return users;
        },
    },
    Mutation: {
        async createChat(
            _: any,
            { input: { users } }: ICreateChatInput,
            context: IContext
        ) {
            const { user: authUser } = await Auth.isAuth(context.token);

            const chat = new CreateChat([...users, authUser]);
            const data = JSON.stringify(chat);
            await rabbitMQ.send(Queue.CHAT, data);
            return true;
        },
        async messageChat(
            _: any,
            { input: { chatId, message } }: IMessageChatInput,
            context: IContext
        ) {
            const now = moment().format();
            const { user } = await Auth.isAuth(context.token);
            const newMessage = new Message(
                user.uid,
                user.displayName,
                message,
                now
            );
            const chat = new MessageChat(chatId, newMessage);
            const data = JSON.stringify(chat);
            await rabbitMQ.send(Queue.USERS, data);
            return true;
        },
    },
};
