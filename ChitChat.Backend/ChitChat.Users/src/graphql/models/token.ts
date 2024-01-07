import crypto from 'crypto';
export interface IToken {
    id: string;
    userID: string;
    value: string;
    disabled: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface ITokenResponse {
    value: string;
}

class Token implements IToken {
    id: string;
    userID: string;
    value: string;
    disabled: boolean;
    createdAt: Date;
    updatedAt: Date;

    constructor(
        userID: string,
        value: string,
        disabled?: boolean,
        id?: string,
        createdAt?: Date,
        updatedAt?: Date
    ) {
        this.id = id ?? crypto.randomUUID();

        this.userID = userID;
        this.value = value;
        this.disabled = disabled ?? false;

        const now = new Date();
        this.createdAt = createdAt ?? now;
        this.updatedAt = updatedAt ?? now;
    }

    disable(): void {
        this.disabled = true;
        this.updatedAt = new Date();
    }

    getValue(): ITokenResponse {
        return { value: this.value };
    }
}

export default Token;
