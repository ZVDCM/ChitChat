import { EMAIL_REGEX } from '../const/regex.js';

export const isNotEmail = (email: string): boolean => !EMAIL_REGEX.test(email);
