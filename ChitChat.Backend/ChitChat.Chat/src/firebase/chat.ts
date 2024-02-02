import { getFirestore } from 'firebase-admin/firestore';
import { IMessage } from '../common/models/message.js';
import { IUser } from '../common/models/user.js';
import { IChat } from '../common/models/chat.js';
import logger from '../common/utils/logger.js';

const collection = 'chats';
class Chat {
    static async getAllChats(user: IUser): Promise<IChat[]> {
        const db = getFirestore();
        const snapshot = await db
            .collection(collection)
            .where('users', 'array-contains', { ...user })
            .get();
        return snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                users: data.users,
                messages: data.messages,
                createdAt: data.createdAt,
            };
        });
    }

    static async create(
        chatId: string,
        users: IUser[],
        createdAt: string
    ): Promise<void> {
        const db = getFirestore();
        const data = { users, messages: [], createdAt };
        await db.collection(collection).doc(chatId).set(data);
    }

    static async message(chatId: string, message: IMessage): Promise<void> {
        const db = getFirestore();
        const docRef = db.collection(collection).doc(chatId);
        const snapshot = await docRef.get();
        if (!snapshot.exists) {
            logger.error(`Chat ${chatId} is not found`);
            return;
        }
        await docRef.update({
            messages: [message, ...snapshot.data()?.messages],
        });
    }
}

export default Chat;
