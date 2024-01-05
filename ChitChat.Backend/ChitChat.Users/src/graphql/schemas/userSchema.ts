import {
    IAuthResponse,
    ILoginRequest,
    IRegisterRequest,
} from '../models/auth.js';
import { IChatRequest } from '../models/chat.js';

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
        register: (
            _: unknown,
            { name, email, password, confirmPassword }: IRegisterRequest
        ): IAuthResponse => {
            return {
                user: {
                    id: confirmPassword,
                    name: name,
                    email: email,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                token: {
                    value: password,
                },
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
