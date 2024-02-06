import { pubSub, rabbitMQ } from '../index.js';
import { IMessageChat } from '../common/events/messageChat.js';
import Chat from '../firebase/chat.js';
import Queue from '../common/consts/queues.js';
import Triggers from '../common/consts/triggers.js';

const userMessaged = () => {
    rabbitMQ.consume(Queue.MESSAGE, async (data) => {
        if (!data) return;
        const { chatId, users, message } = JSON.parse(data) as IMessageChat;
        const messages = await Chat.message(chatId, message);
        const messageAdded = { chatId, users, messages };
        await pubSub.publish(Triggers.MESSAGE_ADDED, { messageAdded });
    });
};

export default userMessaged;
