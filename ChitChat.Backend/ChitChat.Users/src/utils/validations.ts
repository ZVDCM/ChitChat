import {
    EMAIL_REGEX,
    NOT_EMPTY_REGEX,
    PASSWORD_REGEX,
} from '../const/regex.js';

class Validations {
    static isStringEmpty(str: string): boolean {
        return NOT_EMPTY_REGEX.test(str);
    }
    static isValidEmail(email: string): boolean {
        return NOT_EMPTY_REGEX.test(email) && EMAIL_REGEX.test(email);
    }
    static isValidPassword(password: string): boolean {
        return NOT_EMPTY_REGEX.test(password) && PASSWORD_REGEX.test(password);
    }
}

export default Validations;
