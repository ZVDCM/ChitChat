import { rabbitMQ } from '../index.js';
import { IMessageChat } from '../common/events/messageChat.js';
import Chat from '../firebase/chat.js';

const queueName = 'users';

const userMessaged = () => {
    rabbitMQ.consume(queueName, async (data) => {
        if (!data) return;
        const { chatId, users, message, createdAt } = JSON.parse(
            data
        ) as IMessageChat;
        await Chat.createChat(chatId, users, [message], createdAt);
    });
};

export default userMessaged;
