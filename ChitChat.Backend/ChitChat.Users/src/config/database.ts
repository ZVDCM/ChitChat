import fs from 'fs/promises';
import admin from 'firebase-admin';
import path from 'path';

const startDatabase = async (): Promise<admin.app.App> => {
    const keysDirectory = path.join(process.cwd(), 'keys');

    const data = await fs.readFile(
        path.join(keysDirectory, 'serviceAccount.json'),
        'utf-8'
    );
    const serviceAccount = JSON.parse(data);

    return admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
};

export default startDatabase;
