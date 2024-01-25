import React, { useContext, useEffect, useState } from 'react';
import LoadingComponent from '@components/LoadingComponent';
import { AuthContext } from '@hooks/UseAuthProvider';
import { useNavigate } from 'react-router-dom';
import { LOGIN } from '@consts/urls';
import Auth from '@_firebase/auth';
import { useQuery } from '@apollo/client';
import { AUTH_SET_CREDENTIALS } from '@consts/actions';
import { IUserItemState } from '@components/UserItemComponent';
import { GET_ALL_CHATS } from '@graphql/queries/chats';
import { IChat } from '@models/chat';
import ChatItemComponent, {
    IChatItemState,
} from '@components/ChatItemComponent';
import { chatClient } from '../main';

export interface IUserItemStates {
    [key: string]: IUserItemState;
}
export interface IChatItemStates {
    [key: string]: IChatItemState;
}
function HomeContainer() {
    const navigate = useNavigate();
    const { state, dispatch } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [targetChat, setTargetChat] = useState<IChat | null>(null);
    const [chatItemStates, setChatItemStates] =
        useState<IChatItemStates | null>(null);

    const { data, loading, error } = useQuery(GET_ALL_CHATS, {
        context: {
            headers: {
                token: state?.token,
            },
        },
        client: chatClient,
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

    const handleChatClicked = (chat: IChat) => {
        setTargetChat(chat);
        setChatItemStates((prev) => {
            if (!prev) return prev;
            prev[chat.id].isActive = true;
            Object.keys(prev).forEach((key) => {
                if (key === chat.id) return;
                prev[key].isActive = false;
            });
            return prev;
        });
    };

    useEffect(() => {
        const populateChat = (): void => {
            if (!data || !state) return;
            const chats = data as { getAllChats: IChat[] };
            setChatItemStates((prev) => {
                prev = {};
                chats.getAllChats.forEach((chat) => {
                    chat = {
                        ...chat,
                        users: chat.users.filter(
                            (u) => u.uid !== state.user.uid
                        ),
                    };
                    prev[chat.id] = {
                        chat,
                        isActive: false,
                    };
                });
                return prev;
            });
        };
        populateChat();
    }, [data, state]);

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
                                {chatItemStates &&
                                    Object.keys(chatItemStates).map((key) => (
                                        <ChatItemComponent
                                            key={key}
                                            chat={chatItemStates[key].chat}
                                            isActive={
                                                chatItemStates[key].isActive
                                            }
                                            handleChatClicked={
                                                handleChatClicked
                                            }
                                        />
                                    ))}
                            </div>
                            <div id="chat" className="w-[70%]">
                                {targetChat ? (
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
