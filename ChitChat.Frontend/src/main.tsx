import React from 'react';
import ReactDOM from 'react-dom/client';
import '@styles/index.css';
import { ApolloProvider } from '@apollo/client';
import { initializeApp } from 'firebase/app';
import UseAuthProvider from '@hooks/UseAuthProvider';
import App from './App';
import userClient from './apollo/userClient';
import chatClient from './apollo/chatClient';

const firebaseConfig = {
    apiKey: 'AIzaSyBOAWcEpuvpYZaI_i_dwZCZFGml3tOazfA',
    authDomain: 'chit-chat-6e006.firebaseapp.com',
    projectId: 'chit-chat-6e006',
    storageBucket: 'chit-chat-6e006.appspot.com',
    messagingSenderId: '1066258505010',
    appId: '1:1066258505010:web:0d4b7a1ab5477eb38e8b2b',
};
initializeApp(firebaseConfig);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ApolloProvider client={userClient}>
            <ApolloProvider client={chatClient}>
                <UseAuthProvider>
                    <App />
                </UseAuthProvider>
            </ApolloProvider>
        </ApolloProvider>
    </React.StrictMode>
);
