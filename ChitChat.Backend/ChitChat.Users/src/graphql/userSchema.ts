import Users from '../firebase/users.js';

export const userTypeDef = `#graphql
    type User{
        uid: String!
        displayName: String!
        email:String!
    }

    type Query {
        getAllUsers: [User!]
    }
`;

export const userResolver = {
    Query: {
        getAllUsers: async () => await Users.getAllUsers(),
    },
};
