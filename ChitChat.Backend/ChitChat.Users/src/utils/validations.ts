import {
    EMAIL_REGEX,
    NOT_EMPTY_REGEX,
    PASSWORD_REGEX,
} from '../consts/regex.js';

class Validations {
    static isNotStringEmpty(str: string): boolean {
        return !NOT_EMPTY_REGEX.test(str);
    }
    static isInvalidEmail(email: string): boolean {
        return NOT_EMPTY_REGEX.test(email) && !EMAIL_REGEX.test(email);
    }
    static isInvalidPassword(password: string): boolean {
        return NOT_EMPTY_REGEX.test(password) && !PASSWORD_REGEX.test(password);
    }
}

export default Validations;
