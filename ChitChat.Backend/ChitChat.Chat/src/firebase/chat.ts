import { getFirestore } from 'firebase-admin/firestore';
import { IMessage } from '../common/models/message.js';
import { IUser } from '../common/models/user.js';

const collection = 'chats';
const subCollectionMessage = 'messages';

class Chat {
    static async createChat(
        chatId: string,
        users: IUser[],
        messages: IMessage[],
        createdAt: string
    ): Promise<void> {
        const db = getFirestore();
        const data = { users, messages, createdAt };
        await db.collection(collection).doc(chatId).set(data);
    }
    static async addMessage(chatId: string, message: IMessage): Promise<void> {
        const db = getFirestore();
        await db
            .collection(collection)
            .doc(chatId)
            .collection(subCollectionMessage)
            .add(message);
    }
}

export default Chat;
