import fs from 'fs/promises';
import { cert, initializeApp } from 'firebase-admin/app';
import path from 'path';

const startDatabase = async () => {
    const keysDirectory = path.join(process.cwd(), 'keys');
    const data = await fs.readFile(
        path.join(keysDirectory, 'serviceAccount.json'),
        'utf-8'
    );
    const serviceAccount = JSON.parse(data);

    initializeApp({
        credential: cert(serviceAccount),
    });
};

export default startDatabase;
