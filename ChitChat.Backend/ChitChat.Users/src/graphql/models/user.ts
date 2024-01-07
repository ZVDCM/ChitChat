import crypto from 'crypto';

export interface IUser {
    id: string;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserResponse {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

class User implements IUser {
    id: string;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(
        name: string,
        email: string,
        password: string,
        id?: string,
        createdAt?: Date,
        updatedAt?: Date
    ) {
        this.id = id ?? crypto.randomUUID();

        this.name = name;
        this.email = email;
        this.password = password;

        const now = new Date();
        this.createdAt = createdAt ?? now;
        this.updatedAt = updatedAt ?? now;
    }

    getValue(): IUserResponse {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}

export default User;
