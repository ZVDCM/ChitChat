import Crypto from 'crypto';
import { IUser } from '../models/user.js';
import moment from 'moment';

export interface ICreateChat {
    id: string;
    users: IUser[];
    createdAt: string;
}

class CreateChat implements ICreateChat {
    id: string;
    users: IUser[];
    createdAt: string;

    constructor(users: IUser[]) {
        this.id = Crypto.randomUUID();
        this.users = users;
        this.createdAt = moment().format();
    }
}

export default CreateChat;
