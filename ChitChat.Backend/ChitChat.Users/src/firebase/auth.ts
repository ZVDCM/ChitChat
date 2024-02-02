import { DecodedIdToken, getAuth } from 'firebase-admin/auth';
import { unauthorized } from '../common/consts/errors.js';

class Auth {
    static async isAuth(token: string | undefined): Promise<DecodedIdToken> {
        if (!token) throw unauthorized();
        const credentials = await getAuth().verifyIdToken(token);
        if (!credentials) throw unauthorized();
        return credentials;
    }
}

export default Auth;
