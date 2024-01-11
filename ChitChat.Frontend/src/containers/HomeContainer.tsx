import React, { useContext, useEffect, useState } from 'react';
import LoadingComponent from '@components/LoadingComponent';
import { AuthContext } from '@hooks/UseAuthProvider';
import { useNavigate } from 'react-router-dom';
import { LOGIN } from '@consts/urls';
import Auth from '@_firebase/auth';
import { useQuery } from '@apollo/client';
import { GET_ALL_USERS } from '@graphql/queries/users';
import { AUTH_SET_CREDENTIALS } from '@consts/actions';
import { User } from '../models/user';
import UserComponent from '@components/UserComponent';

function HomeContainer() {
    const navigate = useNavigate();
    const { state, dispatch } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState<User[]>([]);

    const { data, loading, error } = useQuery(GET_ALL_USERS, {
        context: {
            headers: {
                token: state?.token,
            },
        },
    });

    const setCredentials = (): void => {
        dispatch({
            type: AUTH_SET_CREDENTIALS,
        });
    };

    const handleLogout = async (): Promise<void> => {
        setIsLoading(true);
        await Auth.logout();
        setCredentials();
        setIsLoading(false);
        navigate(LOGIN);
    };

    useEffect(() => {
        const populateUsers = (): void => {
            if (!data) return;
            const users = data as { getAllUsers: User[] };
            setUsers(
                users.getAllUsers.map(
                    (user) => new User(user.uid, user.displayName, user.email)
                )
            );
        };
        populateUsers();
    }, [data]);

    useEffect(() => {
        const setLoading = (): void => {
            setIsLoading(loading);
        };
        setLoading();
    }, [loading, setIsLoading]);

    useEffect(() => {
        const alertError = (): void => {
            if (!error) return;
            setIsLoading(false);
            alert(error.message);
        };

        alertError();
    }, [error]);

    return (
        <>
            {isLoading && <LoadingComponent />}
            {state && (
                <div className="h-[calc(100dvh-400px)] flex justify-center items-center p-4">
                    <article className="h-full w-full max-w-[1000px] p-[2rem]">
                        <section className="h-[2rem] flex justify-between items-center">
                            <span>@{state.user.displayName}</span>
                            <button
                                className="hover:underline"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </section>
                        <hr className="my-4" />
                        <section className="h-[calc(100%-2rem)] flex items-stretch">
                            <div
                                id="user-list"
                                className="w-[30%] border-r overflow-auto"
                            >
                                {users.length &&
                                    users.map((user) => (
                                        <UserComponent
                                            key={user.uid}
                                            user={user}
                                        />
                                    ))}
                            </div>
                            <div id="chat" className="w-[70%]"></div>
                        </section>
                    </article>
                </div>
            )}
        </>
    );
}

export default HomeContainer;
