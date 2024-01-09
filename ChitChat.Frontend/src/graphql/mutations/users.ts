import { gql } from '@apollo/client';

export const REGISTER = gql`
    mutation Register(
        $displayName: String!
        $email: String!
        $password: String!
        $confirmPassword: String!
    ) {
        register(
            displayName: $displayName
            email: $email
            password: $password
            confirmPassword: $confirmPassword
        )
    }
`;
