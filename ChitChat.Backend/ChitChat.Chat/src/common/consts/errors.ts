import { GraphQLError } from 'graphql';

export const badRequest = (): GraphQLError =>
    new GraphQLError('invalid request message', {
        extensions: {
            code: 'BAD_REQUEST',
            exception: {
                statusCode: 400,
            },
        },
    });
export const unauthorized = (): GraphQLError =>
    new GraphQLError('user not authenticated', {
        extensions: {
            code: 'UNAUTHORIZED',
            exception: {
                statusCode: 401,
            },
        },
    });
export const forbidden = (): GraphQLError =>
    new GraphQLError('user not authorized', {
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
export const unprocessable = (message: string): GraphQLError =>
    new GraphQLError(message, {
        extensions: {
            code: 'UNPROCESSABLE_ENTITY',
            exception: {
                statusCode: 422,
            },
        },
    });
