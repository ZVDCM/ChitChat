export const chatTypeDef = `#graphql
    type User{
        uid: ID!
        displayName: String!
        email: String!
    }

    type Message{
        from: ID!
        to: ID!
        message: String!
    }

    type Chat{
        id: ID!
        users: [User!]!
        messages: [Message!]
        createdAt: String!
    }

    type Query{
        _dummy: Boolean
    }
`;
export const chatResolver = {};
