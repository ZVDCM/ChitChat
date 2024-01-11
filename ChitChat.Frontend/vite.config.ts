import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@components': path.resolve(__dirname, './src/components'),
            '@consts': path.resolve(__dirname, './src/consts'),
            '@containers': path.resolve(__dirname, './src/containers'),
            '@_firebase': path.resolve(__dirname, './src/firebase'),
            '@graphql': path.resolve(__dirname, './src/graphql'),
            '@hooks': path.resolve(__dirname, './src/hooks'),
            '@pages': path.resolve(__dirname, './src/pages'),
            '@styles': path.resolve(__dirname, './src/styles'),
            '@_types': path.resolve(__dirname, './src/types'),
            '@utils': path.resolve(__dirname, './src/utils'),
        },
    },
});
