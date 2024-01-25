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
