import { IRegisterRequest } from '../models/auth.js';
import { unprocessable } from '../../services/errors.js';
import { admin } from '../../index.js';
import Validations from '../../utils/validations.js';

export const userTypeDef = `#graphql
    type User {
        uid: ID!
        displayName: String!
        email: String!
        password: String!
    }

    type UserResponse {
        uid: String!
        displayName: String!
        email: String!
    }

    type Query {
        _dummy: String
    }

    type Mutation {
        register(
            displayName: String!
            email: String!
            password: String!
            confirmPassword: String!
        ): boolean
    }
`;

export const userResolver = {
    Mutation: {
        register: async (
            _: any,
            { displayName, email, password, confirmPassword }: IRegisterRequest
        ): Promise<boolean> => {
            if (Validations.isStringEmpty(displayName))
                throw unprocessable('name is empty');
            if (!Validations.isValidEmail(email))
                throw unprocessable('email is empty');
            if (!Validations.isValidPassword(password))
                throw unprocessable('password is empty');
            if (password !== confirmPassword)
                throw unprocessable('passwords do not match');

            await admin.auth().createUser({
                displayName,
                email,
                password,
            });
            
            return true;
        },
    },
};
