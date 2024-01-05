import { ITokenResponse } from "./token.js";
import { IUserResponse } from "./user.js";

export interface ILoginRequest {
	email: string;
	password: string;
}

export interface IRegisterRequest {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
}

export interface IAuthResponse {
	user: IUserResponse;
	token: ITokenResponse;
}
