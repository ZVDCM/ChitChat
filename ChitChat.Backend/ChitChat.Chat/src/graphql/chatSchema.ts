import { withFilter } from 'graphql-subscriptions';
import { pubSub } from '../index.js';
import { IContext } from '../common/config/server.js';
import Auth from '../firebase/auth.js';
import Chat from '../firebase/chat.js';
import Triggers from '../common/consts/triggers.js';
import { IMessageChat } from '../common/events/messageChat.js';
import { ICreateChat } from '../common/events/createChat.js';

export const chatTypeDef = `#graphql
    type User{
        uid: ID!
        displayName: String!
        email: String!
    }

    type Message{
        from: ID!
        fromDisplayName: String!
        message: String!
        sentAt: String!
    }

    type Chat{
        id: ID!
        users: [User!]!
        messages: [Message!]
        createdAt: String!
    }

    type MessageAdded{
        chatId: ID!
        messages: [Message!]
    }
    
    type Query{
        getAllChats: [Chat!]
        getAllMessages(chatId: ID!): MessageAdded
    }

    type Subscription {
        chatCreated(userUid: ID!): Chat
        messageAdded(userUid: ID!): MessageAdded
    } 
`;

interface IChatCreated {
    chatCreated: ICreateChat;
}
interface IMessageAdded {
    messageAdded: IMessageChat;
}
interface IGetAllMessages {
    chatId: string;
}
export const chatResolver = {
    Query: {
        getAllChats: async (_: any, __: any, context: IContext) => {
            const { user } = await Auth.isAuth(context.token);
            const chats = Chat.getAllChats(user);
            return chats;
        },
        getAllMessages: async (
            _: any,
            { chatId }: IGetAllMessages,
            context: IContext
        ) => {
            const { user } = await Auth.isAuth(context.token);
            const messages = Chat.getAllMessages(chatId, user);
            return { chatId, messages };
        },
    },
    Subscription: {
        chatCreated: {
            subscribe: withFilter(
                () => pubSub.asyncIterator([Triggers.CHAT_CREATED]),
                (payload: IChatCreated, variables) =>
                    payload.chatCreated.users.some(
                        (u) => u.uid === variables.userUid
                    )
            ),
            resolve: (payload: IChatCreated) => payload.chatCreated,
        },
        messageAdded: {
            subscribe: withFilter(
                () => pubSub.asyncIterator([Triggers.MESSAGE_ADDED]),
                (payload: IMessageAdded, variables) =>
                    payload.messageAdded.users.some(
                        (u) => u.uid === variables.userUid
                    )
            ),
            resolve: (payload: IMessageAdded) => payload.messageAdded,
        },
    },
};
