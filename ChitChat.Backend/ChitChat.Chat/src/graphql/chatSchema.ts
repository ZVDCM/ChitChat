import { withFilter } from 'graphql-subscriptions';
import { pubSub } from '../index.js';
import { IMessage } from '../common/models/message.js';
import { IContext } from '../common/config/server.js';
import Auth from '../firebase/auth.js';
import Chat from '../firebase/chat.js';
import { User } from '../common/models/user.js';

export const chatTypeDef = `#graphql
    type User{
        uid: ID!
        displayName: String!
        email: String!
    }

    type Message{
        from: ID!
        message: String!
        sentAt: String!
    }

    type Chat{
        id: ID!
        users: [User!]!
        messages: [Message!]
        createdAt: String!
    }

    type MessageAdded {
        chatId: ID!
        message: Message!
    }

    type Query{
        getAllChats: [Chat!]
    }

    type Subscription {
        messageAdded(chatId: ID!): MessageAdded
    } 
`;

export const triggerName = 'MESSAGE_ADDED';
interface IMessageAdded {
    messageAdded: {
        chatId: string;
        message: IMessage;
    };
}
export const chatResolver = {
    Query: {
        getAllChats: async (_: any, __: any, context: IContext) => {
            const credentials = await Auth.isAuth(context.token);
            const user = new User(
                credentials.uid,
                credentials.name,
                credentials.email!
            );
            const chats = Chat.getAllChats(user);
            return chats;
        },
    },
    Subscription: {
        messageAdded: {
            subscribe: withFilter(
                () => pubSub.asyncIterator([triggerName]),
                (payload: IMessageAdded, variables) =>
                    payload.messageAdded.chatId === variables.chatId
            ),
            resolve: (payload: IMessageAdded) => payload.messageAdded,
        },
    },
};
