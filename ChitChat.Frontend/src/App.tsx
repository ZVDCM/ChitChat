import React, { useContext, useEffect } from 'react';
import LoginPage from '@pages/LoginPage';
import RegisterPage from '@pages/RegisterPage';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { AuthContext } from '@hooks/UseAuthProvider';
import { User, getAuth, onAuthStateChanged } from 'firebase/auth';
import { HOME, LOGIN, REGISTER } from '@consts/urls';
import { AUTH_SET_CREDENTIALS } from '@consts/provider';
import NotFound from '@pages/NotFound';
import HomePage from '@pages/HomePage';

const router = createBrowserRouter([
    {
        path: HOME,
        element: <HomePage />,
    },
    {
        path: LOGIN,
        element: <LoginPage />,
    },
    {
        path: REGISTER,
        element: <RegisterPage />,
    },
    {
        path: '*',
        element: <NotFound />,
    },
]);

function App() {
    const { dispatch } = useContext(AuthContext);

    useEffect(() => {
        const setCredentials = (user: User): void => {
            dispatch({
                type: AUTH_SET_CREDENTIALS,
                payload: {
                    displayName: user.displayName!,
                    email: user.email!,
                    idToken: user.uid,
                },
            });
        };
        const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
            if (!user) return;
            setCredentials(user);
        });

        return () => unsubscribe();
    }, [dispatch]);

    return <RouterProvider router={router} />;
}

export default App;
