import moment from 'moment';

export interface IMessage {
    from: string;
    message: string;
    sentAt: string;
}

export class Message implements IMessage {
    from: string;
    message: string;
    sentAt: string;

    constructor(from: string, message: string) {
        this.from = from;
        this.message = message;
        this.sentAt = moment().format();
    }
}
