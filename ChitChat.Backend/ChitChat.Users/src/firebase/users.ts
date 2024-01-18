import { getAuth } from 'firebase-admin/auth';
import { User } from '../common/models/user.js';

class Users {
    static async getAllUsers(): Promise<User[]> {
        const users = await getAuth().listUsers();
        return users.users.map((user) => {
            return new User(user.uid, user.displayName!, user.email!);
        });
    }
}

export default Users;
