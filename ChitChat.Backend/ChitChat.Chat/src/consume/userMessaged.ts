import { pubSub, rabbitMQ } from '../index.js';
import { IMessageChat } from '../common/events/messageChat.js';
import Chat from '../firebase/chat.js';
import { triggerName } from '../graphql/chatSchema.js';

const queueName = 'USERS';
const userMessaged = () => {
    rabbitMQ.consume(queueName, async (data) => {
        if (!data) return;
        const { chatId, users, message, createdAt } = JSON.parse(
            data
        ) as IMessageChat;
        await Chat.message(chatId, users, message, createdAt);
        const messageAdded = { chatId, message };
        await pubSub.publish(triggerName, { messageAdded });
    });
};

export default userMessaged;
