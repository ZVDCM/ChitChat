export interface IUser {
    uid: string;
    displayName: string;
    email: string;
}

export class User implements IUser {
    uid: string;
    displayName: string;
    email: string;

    constructor(uid: string, displayName: string, email: string) {
        this.uid = uid;
        this.displayName = displayName;
        this.email = email;
    }
}
