import { DecodedIdToken, getAuth } from 'firebase-admin/auth';
import { unauthorized } from '../common/consts/errors.js';
import { IUser } from '../common/models/user.js';

interface IReturn {
    credentials: DecodedIdToken;
    user: IUser;
}
class Auth {
    static async isAuth(token: string | undefined): Promise<IReturn> {
        if (!token) throw unauthorized();
        const credentials = await getAuth().verifyIdToken(token);
        if (!credentials) throw unauthorized();
        return {
            credentials,
            user: {
                uid: credentials.uid,
                displayName: credentials.name,
                email: credentials.email!,
            },
        };
    }
}

export default Auth;
