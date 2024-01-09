import React from 'react';
import ReactDOM from 'react-dom/client';
import '@styles/index.css';
import HomePage from '@pages/HomePage';
import LoginPage from '@pages/LoginPage';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import RegisterPage from '@pages/RegisterPage';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { BACKEND_URL } from '@consts/server';

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
