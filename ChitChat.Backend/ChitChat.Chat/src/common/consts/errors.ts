import { GraphQLError } from 'graphql';

export const badRequest = (message: string | null = null): GraphQLError =>
    new GraphQLError(message ?? 'invalid request message', {
        extensions: {
            code: 'BAD_REQUEST',
            exception: {
                statusCode: 400,
            },
        },
    });
export const unauthorized = (message: string | null = null): GraphQLError =>
    new GraphQLError(message ?? 'user not authenticated', {
        extensions: {
            code: 'UNAUTHORIZED',
            exception: {
                statusCode: 401,
            },
        },
    });
export const forbidden = (message: string | null = null): GraphQLError =>
    new GraphQLError(message ?? 'user not authorized', {
        extensions: {
            code: 'FORBIDDEN',
            exception: {
                statusCode: 404,
            },
        },
    });
export const notFound = (target: string): GraphQLError =>
    new GraphQLError(`${target} is not found`, {
        extensions: {
            code: 'NOT_FOUND',
            exception: {
                statusCode: 404,
            },
        },
    });
export const conflict = (target: string): GraphQLError =>
    new GraphQLError(`${target} already exists`, {
        extensions: {
            code: 'CONFLICT',
            exception: {
                statusCode: 409,
            },
        },
    });
export const unprocessable = (message: string | null = null): GraphQLError =>
    new GraphQLError(message ?? 'request unprocessable', {
        extensions: {
            code: 'UNPROCESSABLE_ENTITY',
            exception: {
                statusCode: 422,
            },
        },
    });
