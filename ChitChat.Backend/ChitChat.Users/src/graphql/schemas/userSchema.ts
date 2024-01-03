import {
	IAuthResponse,
	ILoginRequest,
	IRegisterRequest,
} from "../models/auth.js";
import { IUserResponse } from "../models/users.js";

export const userTypeDef = `#graphql
	scalar Date

	type User {
		id: ID!
		name: String!
		email: String!
		password: String!
		createdAt: Date!
		updatedAt: Date!
	}
	type UserResponse {
		id: ID!
		name: String!
		email: String!
		createdAt: Date!
		updatedAt: Date!
	}

	type Token {
		id: ID!
		userID: String!
		value: String!
		disabled: Boolean!
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
		getProfile: UserResponse
	}

	type Mutation {
		login(email: String!, password: String!): AuthResponse
		register(
			name: String!
			email: String!
			password: String!
			confirmPassword: String!
		): AuthResponse
		logout: Boolean
	}
`;

export const userResolver = {
	Query: {
		getProfile: (): IUserResponse => {
			return {
				id: "fd9b88d4-98b6-5f8e-90ea-947a24210099",
				name: "Leona Curtis",
				email: "foj@ritowativ.io",
				createdAt: new Date(),
				updatedAt: new Date(),
			};
		},
	},
	Mutation: {
		login: (
			_: unknown,
			{ email, password }: ILoginRequest
		): IAuthResponse => {
			return {
				user: {
					id: "fd9b88d4-98b6-5f8e-90ea-947a24210099",
					name: "Leona Curtis",
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
		logout: (): boolean => {
			return true;
		},
	},
};
