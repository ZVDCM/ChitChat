import { IMessage } from '../models/message.js';

export interface IMessageChat {
    chatId: string;
    message: IMessage;
}

class MessageChat implements IMessageChat {
    chatId: string;
    message: IMessage;

    constructor(chatId: string, message: IMessage) {
        this.chatId = chatId;
        this.message = message;
    }
}

export default MessageChat;
