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
        ): Boolean
    }
`;

export const userResolver = {
    Mutation: {
        register: async (
            _: any,
            { displayName, email, password, confirmPassword }: IRegisterRequest
        ): Promise<boolean> => {
            if (Validations.isNotStringEmpty(displayName))
                throw unprocessable('Username is empty');
            if (Validations.isInvalidEmail(email))
                throw unprocessable('Email must be valid');
            if (Validations.isInvalidPassword(password))
                throw unprocessable('Password must be at least 6 characters long');
            if (password !== confirmPassword)
                throw unprocessable('Passwords do not match');

            await admin.auth().createUser({
                displayName,
                email,
                password,
            });

            return true;
        },
    },
};
