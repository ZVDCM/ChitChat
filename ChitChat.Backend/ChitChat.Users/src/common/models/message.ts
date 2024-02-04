export interface IMessage {
    from: string;
    fromDisplayName: string;
    message: string;
    sentAt: string;
}

export class Message implements IMessage {
    from: string;
    fromDisplayName: string;
    message: string;
    sentAt: string;

    constructor(
        from: string,
        fromDisplayName: string,
        message: string,
        sentAt: string
    ) {
        this.from = from;
        this.fromDisplayName = fromDisplayName;
        this.message = message;
        this.sentAt = sentAt;
    }
}
