import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@_apollo': path.resolve(__dirname, './src/apollo'),
            '@consts': path.resolve(__dirname, './src/common/consts'),
            '@models': path.resolve(__dirname, './src/common/models'),
            '@_types': path.resolve(__dirname, './src/common/types'),
            '@utils': path.resolve(__dirname, './src/common/utils'),
            '@components': path.resolve(__dirname, './src/components'),
            '@containers': path.resolve(__dirname, './src/containers'),
            '@_firebase': path.resolve(__dirname, './src/firebase'),
            '@graphql': path.resolve(__dirname, './src/graphql'),
            '@hooks': path.resolve(__dirname, './src/hooks'),
            '@pages': path.resolve(__dirname, './src/pages'),
            '@styles': path.resolve(__dirname, './src/styles'),
        },
    },
});
