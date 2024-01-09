export interface ILoginRequest {
    email: string;
    password: string;
}

export interface IRegisterRequest {
    displayName: string;
    email: string;
    password: string;
    confirmPassword: string;
}
