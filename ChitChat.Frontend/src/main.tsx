import React from 'react';
import ReactDOM from 'react-dom/client';
import '@styles/index.css';
import HomePage from '@pages/HomePage';
import LoginPage from '@pages/LoginPage';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import RegisterPage from '@pages/RegisterPage';

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
        <RouterProvider router={router} />
    </React.StrictMode>
);
