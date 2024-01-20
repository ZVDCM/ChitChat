import { CorsOptions } from 'cors';

const corsOptions: CorsOptions = {
    origin: (
        origin: string | undefined,
        callback: (err: Error | null, origin?: any) => void
    ): void => {
        if (!origin) return callback(null, true);
        const corsError = new Error(
            'The CORS policy for this site does not allow access from the specified Origin.'
        );
        const clients = process.env.CLIENTS;
        if (!clients) return callback(corsError, false);
        const allowedOrigins = clients.split(',');
        if (allowedOrigins.indexOf(origin) === -1) {
            return callback(corsError, false);
        }
        return callback(null, true);
    },
    credentials: true,
    optionsSuccessStatus: 204,
};

export default corsOptions;
