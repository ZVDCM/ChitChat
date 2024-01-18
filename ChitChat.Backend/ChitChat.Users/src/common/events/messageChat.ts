import Crypto from 'crypto';
import { IUser } from '../models/user.js';
import { IMessage } from '../models/message.js';

export interface IMessageChat {
    chatId: string;
    users: IUser[];
    message: IMessage;
    createdAt: string;
}

class MessageChat implements IMessageChat {
    chatId: string;
    users: IUser[];
    message: IMessage;
    createdAt: string;

    constructor(
        chatId: string | null,
        users: IUser[],
        message: IMessage,
        createdAt: string
    ) {
        this.chatId = chatId ?? Crypto.randomUUID();
        this.users = users;
        this.message = message;
        this.createdAt = createdAt;
    }
}

export default MessageChat;
