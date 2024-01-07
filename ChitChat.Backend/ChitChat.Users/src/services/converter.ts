import { FirestoreDataConverter } from 'firebase-admin/firestore';
import Token, { IToken } from '../graphql/models/token.js';
import User, { IUser } from '../graphql/models/user.js';

class Converter {
    static user(): FirestoreDataConverter<User> {
        return {
            toFirestore(user: User): IUser {
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                };
            },
            fromFirestore(
                snapshot: FirebaseFirestore.QueryDocumentSnapshot
            ): User {
                const data = snapshot.data();
                return new User(
                    data.name,
                    data.email,
                    data.password,
                    data.id,
                    data.createdAt,
                    data.updatedAt
                );
            },
        };
    }
    static token(): FirestoreDataConverter<Token> {
        return {
            toFirestore(token: Token): IToken {
                return {
                    id: token.id,
                    userID: token.userID,
                    value: token.value,
                    disabled: token.disabled,
                    createdAt: token.createdAt,
                    updatedAt: token.updatedAt,
                };
            },
            fromFirestore(
                snapshot: FirebaseFirestore.QueryDocumentSnapshot
            ): Token {
                const data = snapshot.data();
                return new Token(
                    data.userID,
                    data.value,
                    data.disabled,
                    data.id,
                    data.createdAt,
                    data.updatedAt
                );
            },
        };
    }
}

export default Converter;
