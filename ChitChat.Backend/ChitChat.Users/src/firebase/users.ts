import { getAuth } from 'firebase-admin/auth';
import { IUser, User } from '../common/models/user.js';

class Users {
    static async getAllUsers(userUid: string): Promise<IUser[]> {
        const result = await getAuth().listUsers();
        const users = result.users.filter((user) => user.uid !== userUid);
        return users.map((user) => {
            return new User(user.uid, user.displayName!, user.email!);
        });
    }
}

export default Users;
