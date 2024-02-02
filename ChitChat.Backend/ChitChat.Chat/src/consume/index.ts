import chatCreated from './chatCreated.js';
import userMessaged from './userMessaged.js';

const consumeEvents = () => {
    chatCreated();
    userMessaged();
};

export default consumeEvents;
