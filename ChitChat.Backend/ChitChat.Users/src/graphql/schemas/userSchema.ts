import isStringEmpty from '../../utils/isStringEmpty.js';
import {
    IAuthResponse,
    ILoginRequest,
    IRegisterRequest,
} from '../models/auth.js';
import { IChatRequest } from '../models/chat.js';
import { unprocessable } from '../../services/errors.js';
import User from '../models/user.js';
import Token from '../models/token.js';
import { database } from '../../index.js';
import hashPassword from '../../utils/hashPassword.js';
import Ref from '../../services/ref.js';

export const userTypeDef = `#graphql
	scalar Date

    interface Auditable {
        createdAt: Date!
        updatedAt: Date!
    }

    type User implements Auditable {
        id: ID!
        name: String!
        email: String!
        password: String!
        createdAt: Date!
        updatedAt: Date!
    }

    type Token implements Auditable {
        id: ID!
        userID: String!
        value: String!
        disabled: Boolean!
        createdAt: Date!
        updatedAt: Date!
    }

    type UserResponse {
        id: String!
        name: String!
        email: String!
        createdAt: Date!
        updatedAt: Date!
    }

    type TokenResponse {
        value: String!
    }

    type AuthResponse {
        user: UserResponse
        token: TokenResponse
    }

    type Query {
        _dummy: String
    }

    type Mutation {
        login(email: String!, password: String!): AuthResponse
        register(
            name: String!
            email: String!
            password: String!
            confirmPassword: String!
        ): AuthResponse
        refresh: AuthResponse
        logout: Boolean
        chat(chatId: ID!, value: String!): Boolean
    }
`;

export const userResolver = {
    Mutation: {
        login: (
            _: unknown,
            { email, password }: ILoginRequest
        ): IAuthResponse => {
            return {
                user: {
                    id: 'fd9b88d4-98b6-5f8e-90ea-947a24210099',
                    name: 'Leona Curtis',
                    email: email,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                token: {
                    value: password,
                },
            };
        },
        register: async (
            _: any,
            { name, email, password, confirmPassword }: IRegisterRequest
        ): Promise<IAuthResponse> => {
            if (isStringEmpty(name)) throw unprocessable('name is empty');
            if (isStringEmpty(email)) throw unprocessable('email is empty');
            if (isStringEmpty(password))
                throw unprocessable('password is empty');
            if (isStringEmpty(confirmPassword))
                throw unprocessable('confirmPassword is empty');

            if (password !== confirmPassword)
                throw unprocessable('passwords do not match');

            const hashedPassword = await hashPassword(password);
            const user = new User(name, email, hashedPassword);
            const token = new Token(user.id, hashedPassword);

            await Ref.users(database).doc(user.id).set(user);
            await Ref.tokens(database).doc(token.id).set(token);

            return {
                user: user.getValue(),
                token: token.getValue(),
            };
        },
        refresh: (): IAuthResponse => {
            return {
                user: {
                    id: '',
                    name: '',
                    email: '',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                token: {
                    value: '',
                },
            };
        },
        logout: (): boolean => {
            return true;
        },
        chat: (_: unknown, { chatId, value }: IChatRequest): boolean => {
            console.log(chatId, value);
            return true;
        },
    },
};
