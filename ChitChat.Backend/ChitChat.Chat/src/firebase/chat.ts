import { getFirestore } from 'firebase-admin/firestore';
import { IMessage } from '../common/models/message.js';
import { IUser } from '../common/models/user.js';

const collection = 'chats';
const subCollectionMessage = 'messages';

class Chat {
    static async createChat(
        chatId: string,
        users: IUser[],
        message: IMessage,
        createdAt: string
    ): Promise<void> {
        const db = getFirestore();
        const docRef = db.collection(collection).doc(chatId);
        const snapshot = await docRef.get();
        if (!snapshot.exists) {
            const data = { users, messages: [message], createdAt };
            await db.collection(collection).doc(chatId).set(data);
            return;
        }
        await docRef.update({
            messages: [message, ...snapshot.data()?.messages],
        });
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
