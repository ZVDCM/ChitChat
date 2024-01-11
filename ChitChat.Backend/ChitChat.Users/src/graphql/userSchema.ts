import { IContext } from '../config/server.js';
import { unauthorized } from '../consts/errors.js';
import Auth from '../firebase/auth.js';
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
        async getAllUsers(_: any, __: any, context: IContext) {
            const token = context.token;
            if (!token) throw unauthorized();
            const DecodedIdToken = await Auth.verifyIdToken(token);
            if (!DecodedIdToken) throw unauthorized();
            const users = await Users.getAllUsers();
            return users.filter((user) => user.uid !== DecodedIdToken.uid);
        },
    },
};
