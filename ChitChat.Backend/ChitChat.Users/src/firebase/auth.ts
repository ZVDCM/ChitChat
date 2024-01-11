import { DecodedIdToken, getAuth } from 'firebase-admin/auth';

class Auth {
    static async verifyIdToken(token: string): Promise<DecodedIdToken> {
        return await getAuth().verifyIdToken(token);
    }
}

export default Auth;
