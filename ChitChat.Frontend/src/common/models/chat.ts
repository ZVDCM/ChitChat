import { IUser } from './user.js';
import { IMessage } from './message.js';

export interface IChat {
    id: string;
    users: IUser[];
    messages: IMessage[];
    createdAt: string;
}

class Chat implements IChat {
    id: string;
    users: IUser[];
    messages: IMessage[];
    createdAt: string;

    constructor(
        id: string,
        users: IUser[],
        messages: IMessage[],
        createdAt: string
    ) {
        this.id = id;
        this.users = users;
        this.messages = messages;
        this.createdAt = createdAt;
    }
}

export default Chat;
