import { IMessage } from '../models/message.js';
import { IUser } from '../models/user.js';

export interface IMessageChat {
    chatId: string;
    users: IUser[];
    message: IMessage;
}

class MessageChat implements IMessageChat {
    chatId: string;
    users: IUser[];
    message: IMessage;

    constructor(chatId: string, users: IUser[], message: IMessage) {
        this.chatId = chatId;
        this.users = users;
        this.message = message;
    }
}

export default MessageChat;
