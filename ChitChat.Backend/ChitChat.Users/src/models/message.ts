export interface IMessage {
    from: string;
    to: string;
    message: string;
}

export class Message implements IMessage {
    from: string;
    to: string;
    message: string;

    constructor(from: string, to: string, message: string) {
        this.from = from;
        this.to = to;
        this.message = message;
    }
}
