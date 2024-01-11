import React, { useContext, useEffect } from 'react';
import LoginPage from '@pages/LoginPage';
import RegisterPage from '@pages/RegisterPage';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { AuthContext } from '@hooks/UseAuthProvider';
import { User, getAuth, onAuthStateChanged } from 'firebase/auth';
import { HOME, LOGIN, REGISTER } from '@consts/urls';
import { AUTH_SET_CREDENTIALS } from '@consts/actions';
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
        const setCredentials = async (user: User): Promise<void> => {
            dispatch({
                type: AUTH_SET_CREDENTIALS,
                payload: {
                    user: {
                        displayName: user.displayName!,
                        email: user.email!,
                        uid: user.uid,
                    },
                    token: await user.getIdToken(),
                },
            });
        };
        const unsubscribe = onAuthStateChanged(getAuth(), async (user) => {
            if (!user) return;
            await setCredentials(user);
        });

        return () => unsubscribe();
    }, [dispatch]);

    return <RouterProvider router={router} />;
}

export default App;
