import React from 'react';
import ReactDOM from 'react-dom/client';
import '@styles/index.css';
import HomePage from '@pages/HomePage';
import LoginPage from '@pages/LoginPage';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import RegisterPage from '@pages/RegisterPage';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { BACKEND_URL } from '@consts/server';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyBOAWcEpuvpYZaI_i_dwZCZFGml3tOazfA',
    authDomain: 'chit-chat-6e006.firebaseapp.com',
    projectId: 'chit-chat-6e006',
    storageBucket: 'chit-chat-6e006.appspot.com',
    messagingSenderId: '1066258505010',
    appId: '1:1066258505010:web:0d4b7a1ab5477eb38e8b2b',
};
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const client = new ApolloClient({
    uri: BACKEND_URL,
    cache: new InMemoryCache(),
});

const router = createBrowserRouter([
    {
        path: '/',
        element: <HomePage />,
        errorElement: <LoginPage />,
    },
    {
        path: '/login',
        element: <LoginPage />,
        errorElement: <HomePage />,
    },
    {
        path: '/register',
        element: <RegisterPage />,
        errorElement: <HomePage />,
    },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <RouterProvider router={router} />
        </ApolloProvider>
    </React.StrictMode>
);
