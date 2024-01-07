import bcrypt from 'bcrypt';
import tryCatch from './tryCatch.js';

const hashPassword = tryCatch(async (password: string): Promise<string> => {
    const salt = parseInt(process.env.SALT_ROUNDS ?? '12');
    const hash = await bcrypt.hash(password, salt);
    return hash;
});

export default hashPassword;
