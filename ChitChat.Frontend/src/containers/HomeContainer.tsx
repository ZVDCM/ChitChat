import React, { useContext, useEffect, useState } from 'react';
import LoadingComponent from '@components/LoadingComponent';
import { AuthContext } from '@hooks/UseAuthProvider';
import { useNavigate } from 'react-router-dom';
import { LOGIN } from '@consts/urls';
import Auth from '@_firebase/auth';
import { useQuery } from '@apollo/client';
import { GET_ALL_USERS } from '@graphql/queries/users';
import { AUTH_SET_CREDENTIALS } from '@consts/actions';
import { IUser } from '../models/user';
import UserComponent, { IUserItemState } from '@components/UserComponent';

export interface IUserItemStates {
    [key: string]: IUserItemState;
}
function HomeContainer() {
    const navigate = useNavigate();
    const { state, dispatch } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [targetUser, setTargetUser] = useState<IUser | null>(null);
    const [userItemStates, setUserItemStates] =
        useState<IUserItemStates | null>(null);

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

    const handleUserClicked = (user: IUser) => {
        setTargetUser(user);
        setUserItemStates((prev) => {
            if (!prev) return prev;
            prev[user.uid].isActive = true;
            Object.keys(prev).forEach((key) => {
                if (key === user.uid) return;
                prev[key].isActive = false;
            });
            return prev;
        });
    };

    useEffect(() => {
        const populateUsers = (): void => {
            if (!data) return;
            const users = data as { getAllUsers: IUser[] };
            setUserItemStates((prev) => {
                prev = {};
                users.getAllUsers.forEach((user) => {
                    prev[user.uid] = {
                        user,
                        isActive: false,
                    };
                });
                return prev;
            });
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
                            <button onClick={handleLogout}>Logout</button>
                        </section>
                        <hr className="my-4" />
                        <section className="h-[calc(100%-2rem)] flex items-stretch">
                            <div
                                id="user-list"
                                className="w-[30%] border-r overflow-auto"
                            >
                                {userItemStates &&
                                    Object.keys(userItemStates).map((key) => (
                                        <UserComponent
                                            key={key}
                                            user={userItemStates[key].user}
                                            isActive={
                                                userItemStates[key].isActive
                                            }
                                            handleUserClicked={
                                                handleUserClicked
                                            }
                                        />
                                    ))}
                            </div>
                            <div id="chat" className="w-[70%]">
                                {targetUser ? (
                                    <div className="h-full">
                                        <div
                                            id="message-list"
                                            className="h-[90%] overflow-auto"
                                        ></div>
                                        <div className="h-[10%]">
                                            <form className="flex gap-4">
                                                <input
                                                    type="text"
                                                    className="w-full p-2 px-4 border border-l-0 outline-none"
                                                    placeholder="Type message here..."
                                                />
                                                <button type="submit">
                                                    Send
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full flex justify-center items-center">
                                        <span className="text-[#ccc] translate-y-[-4rem]">
                                            Select a user
                                        </span>
                                    </div>
                                )}
                            </div>
                        </section>
                    </article>
                </div>
            )}
        </>
    );
}

export default HomeContainer;
