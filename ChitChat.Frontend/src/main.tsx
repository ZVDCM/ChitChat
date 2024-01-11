import React from 'react';
import ReactDOM from 'react-dom/client';
import '@styles/index.css';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { BACKEND_URL } from '@consts/server';
import { initializeApp } from 'firebase/app';
import UseAuthProvider from '@hooks/UseAuthProvider';
import App from './App';

const firebaseConfig = {
    apiKey: 'AIzaSyBOAWcEpuvpYZaI_i_dwZCZFGml3tOazfA',
    authDomain: 'chit-chat-6e006.firebaseapp.com',
    projectId: 'chit-chat-6e006',
    storageBucket: 'chit-chat-6e006.appspot.com',
    messagingSenderId: '1066258505010',
    appId: '1:1066258505010:web:0d4b7a1ab5477eb38e8b2b',
};
initializeApp(firebaseConfig);

export const client = new ApolloClient({
    uri: BACKEND_URL,
    cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <UseAuthProvider>
                <App />
            </UseAuthProvider>
        </ApolloProvider>
    </React.StrictMode>
);
