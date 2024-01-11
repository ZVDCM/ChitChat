import React, { useContext, useState } from 'react';
import LoadingComponent from '@components/LoadingComponent';
import { AuthContext } from '@hooks/UseAuthProvider';
import { useNavigate } from 'react-router-dom';
import { LOGIN } from '@consts/urls';
import { AUTH_SET_CREDENTIALS } from '@consts/provider';
import Auth from 'src/firebase/auth';

function HomeContainer() {
    const navigate = useNavigate();
    const { state, dispatch } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);

    const setCredentials = (): void => {
        dispatch({
            type: AUTH_SET_CREDENTIALS,
            payload: null,
        });
    };

    const handleLogout = async (): Promise<void> => {
        setIsLoading(true);
        await Auth.logout();
        setCredentials();
        setIsLoading(false);
        navigate(LOGIN);
    };

    return (
        <>
            {isLoading && <LoadingComponent />}
            {state && (
                <div className="h-[calc(100dvh-400px)] flex justify-center items-center p-4">
                    <article className="h-full w-full max-w-[1000px] p-[2rem]">
                        <section className="flex justify-between items-center">
                            <span>@{state.displayName}</span>
                            <button
                                className="hover:underline"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </section>
                        <hr className="my-4" />
                    </article>
                </div>
            )}
        </>
    );
}

export default HomeContainer;
