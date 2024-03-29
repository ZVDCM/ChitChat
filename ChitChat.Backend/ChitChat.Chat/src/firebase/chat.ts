import { getFirestore } from 'firebase-admin/firestore';
import { IMessage } from '../common/models/message.js';
import { IUser } from '../common/models/user.js';
import { IChat } from '../common/models/chat.js';
import { forbidden, notFound, unprocessable } from '../common/consts/errors.js';
import Collections from '../common/consts/collections.js';

class Chat {
    static async getAllChats(user: IUser): Promise<IChat[]> {
        const db = getFirestore();
        const snapshot = await db
            .collection(Collections.CHATS)
            .where('users', 'array-contains', user)
            .get();
        if (snapshot.empty) return [];
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

    static async getAllMessages(
        chatId: string,
        user: IUser
    ): Promise<IMessage[]> {
        const db = getFirestore();
        const docRef = db.collection(Collections.CHATS).doc(chatId);
        const snapshot = await docRef.get();
        if (!snapshot.exists) {
            throw notFound(`Chat ${chatId} is not found`);
        }
        const chat = snapshot.data() as IChat;
        if (!chat.users.some((u: IUser) => u.uid === user.uid)) {
            throw forbidden();
        }
        return this.sortByDate(chat.messages) ?? [];
    }

    static async create(
        chatId: string,
        users: IUser[],
        createdAt: string
    ): Promise<void> {
        const db = getFirestore();
        const data = { users, messages: [], createdAt };
        if (users.length < 2)
            throw unprocessable('Chat must have at least 2 users');
        await db.collection(Collections.CHATS).doc(chatId).set(data);
    }

    static async message(
        chatId: string,
        message: IMessage
    ): Promise<IMessage[]> {
        const db = getFirestore();
        const docRef = db.collection(Collections.CHATS).doc(chatId);
        const snapshot = await docRef.get();
        if (!snapshot.exists) throw notFound(`Chat ${chatId} is not found`);
        const messages = [message, ...(snapshot.data()?.messages ?? [])];
        await docRef.update({
            messages,
        });
        return this.sortByDate(messages);
    }

    private static sortByDate(messages: IMessage[]): IMessage[] {
        return messages.sort(
            (a, b) =>
                new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
        );
    }
}

export default Chat;
