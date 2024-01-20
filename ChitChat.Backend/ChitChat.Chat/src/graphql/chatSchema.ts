import { withFilter } from 'graphql-subscriptions';
import { pubSub } from '../index.js';
import { IMessage } from '../common/models/message.js';

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
        _dummy: Boolean
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
