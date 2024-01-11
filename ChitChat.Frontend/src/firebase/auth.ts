import {
    User,
    UserCredential,
    createUserWithEmailAndPassword,
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
} from 'firebase/auth';

interface IProfile {
    displayName?: string | null | undefined;
    photoURL?: string | null | undefined;
}

class Auth {
    static async login(
        email: string,
        password: string
    ): Promise<UserCredential> {
        return await signInWithEmailAndPassword(getAuth(), email, password);
    }
    static async logout(): Promise<void> {
        await signOut(getAuth());
    }
    static async register(
        email: string,
        password: string
    ): Promise<UserCredential> {
        return await createUserWithEmailAndPassword(getAuth(), email, password);
    }
    static getCurrentUser(): User | null {
        return getAuth().currentUser;
    }
    static async updateProfile(user: User, profile: IProfile): Promise<void> {
        await updateProfile(user, profile);
    }
}

export default Auth;
