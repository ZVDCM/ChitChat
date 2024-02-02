import { pubSub, rabbitMQ } from '../index.js';
import Chat from '../firebase/chat.js';
import Queue from '../common/consts/queues.js';
import Triggers from '../common/consts/triggers.js';
import { ICreateChat } from '../common/events/createChat.js';

const chatCreated = () => {
    rabbitMQ.consume(Queue.CHAT, async (data) => {
        if (!data) return;
        const { id, users, createdAt } = JSON.parse(data) as ICreateChat;
        if (users.length < 2) return;
        await Chat.create(id, users, createdAt);
        const chatCreated = { id, users, createdAt };
        await pubSub.publish(Triggers.CHAT_CREATED, { chatCreated });
    });
};

export default chatCreated;
