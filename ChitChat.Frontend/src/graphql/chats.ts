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
                message
                sentAt
            }
            createdAt
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
                message
                sentAt
            }
            createdAt
        }
    }
`;
