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
		id: string,
		userID: string,
		value: string,
		disabled: boolean,
		createdAt: Date,
		updatedAt: Date
	) {
		this.id = id;
		this.userID = userID;
		this.value = value;
		this.disabled = disabled;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}
}

export default Token;
