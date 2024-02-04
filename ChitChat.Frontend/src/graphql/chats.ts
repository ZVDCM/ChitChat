import { gql } from '@apollo/client';

export const GET_ALL_CHATS = gql`
    query GetAllChats {
        getAllChats {
            id
            users {
                uid
                displayName
                email
            }
            messages {
                from
                fromDisplayName
                message
                sentAt
            }
            createdAt
        }
    }
`;
export const GET_ALL_MESSAGES = gql`
    query GetAllMessages($chatId: ID!) {
        getAllMessages(chatId: $chatId) {
            from
            fromDisplayName
            message
            sentAt
        }
    }
`;

export const CREATE_CHAT = gql`
    mutation CreateChat($input: CreateChatInput!) {
        createChat(input: $input)
    }
`;
export const MESSAGE_CHAT = gql`
    mutation MessageChat($input: MessageChatInput!) {
        messageChat(input: $input)
    }
`;
export const SUBSCRIBE_TO_CHAT_CREATED = gql`
    subscription ChatCreated($userUid: ID!) {
        chatCreated(userUid: $userUid) {
            id
            users {
                uid
                displayName
                email
            }
            messages {
                from
                fromDisplayName
                message
                sentAt
            }
            createdAt
        }
    }
`;
export const SUBSCRIBE_TO_MESSAGE_ADDED = gql`
    subscription MessageAdded($chatId: ID!) {
        messageAdded(chatId: $chatId) {
            chatId
            message {
                from
                fromDisplayName
                message
                sentAt
            }
        }
    }
`;
