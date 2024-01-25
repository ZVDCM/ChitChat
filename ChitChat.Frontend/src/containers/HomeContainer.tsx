import React, { useContext, useEffect, useRef, useState } from 'react';
import LoadingComponent from '@components/LoadingComponent';
import { AuthContext } from '@hooks/UseAuthProvider';
import { useNavigate } from 'react-router-dom';
import { LOGIN } from '@consts/urls';
import Auth from '@_firebase/auth';
import { useQuery } from '@apollo/client';
import { AUTH_SET_CREDENTIALS } from '@consts/actions';
import UserItemComponent, {
    IUserItemState,
} from '@components/UserItemComponent';
import { GET_ALL_CHATS } from '@graphql/queries/chats';
import { IChat } from '@models/chat';
import ChatItemComponent, {
    IChatItemState,
} from '@components/ChatItemComponent';
import { chatClient, userClient } from '../main';
import { GET_ALL_USERS } from '@graphql/queries/users';
import { IUser } from '@models/user';
import UserChipComponent from '@components/UserChipComponent';

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
    const [targetUsers, setTargetUsers] = useState<IUser[] | null>(null);
    const [userItemStates, setUserItemStates] =
        useState<IUserItemStates | null>(null);
    const [targetChat, setTargetChat] = useState<IChat | null>(null);
    const [chatItemStates, setChatItemStates] =
        useState<IChatItemStates | null>(null);

    const dialogRef = useRef({} as HTMLDialogElement);

    const {
        data: chatData,
        loading: chatLoading,
        error: chatError,
    } = useQuery(GET_ALL_CHATS, {
        context: {
            headers: {
                token: state?.token,
            },
        },
        client: chatClient,
    });
    const {
        data: userData,
        loading: userLoading,
        error: userError,
    } = useQuery(GET_ALL_USERS, {
        context: {
            headers: {
                token: state?.token,
            },
        },
        client: userClient,
    });

    const setCredentials = (): void => {
        dispatch({
            type: AUTH_SET_CREDENTIALS,
        });
    };
    const resetUserItemStates = (): void => {
        if (!userItemStates) return;
        setTargetUsers(null);
        setUserItemStates(
            Object.keys(userItemStates).reduce((prev, key) => {
                prev[key] = {
                    user: userItemStates[key].user,
                    isActive: false,
                };
                return prev;
            }, {} as IUserItemStates)
        );
    };

    const handleLogout = async (): Promise<void> => {
        setIsLoading(true);
        await Auth.logout();
        setCredentials();
        setIsLoading(false);
        navigate(LOGIN);
    };

    const handleChatClicked = (chat: IChat) => {
        resetUserItemStates();
        setTargetChat(chat);
        setTargetUsers(chat.users);
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
    const handleUserClicked = (user: IUser) => {
        console.log(targetUsers);
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
        const populateChat = (): void => {
            if (!chatData || !state) return;
            const chats = chatData as { getAllChats: IChat[] };
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
        const populateUser = (): void => {
            if (!userData || !state) return;
            const users = userData as { getAllUsers: IUser[] };
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
        populateChat();
        populateUser();
    }, [chatData, userData, state]);
    useEffect(() => {
        const setLoading = (): void => {
            setIsLoading(chatLoading || userLoading);
        };
        setLoading();
    }, [chatLoading, userLoading, setIsLoading]);
    useEffect(() => {
        const alertError = (): void => {
            setIsLoading(false);
            if (chatError) alert(chatError.message);
            if (userError) alert(userError.message);
        };
        alertError();
    }, [chatError, userError]);

    return (
        <>
            {isLoading && <LoadingComponent />}
            <dialog
                ref={dialogRef}
                className="m-auto backdrop:backdrop-blur-[1px]"
            >
                <article className="h-[500px]  w-[400px] flex flex-col border">
                    <section className="h-[10%] border-b flex justify-between items-center pl-4">
                        <h1 className="font-bold">Users</h1>
                        <button
                            className="w-[50px] h-[50px] border-l"
                            onClick={() => dialogRef.current.close()}
                        >
                            X
                        </button>
                    </section>
                    <section id="user-list" className="h-[80%] overflow-auto">
                        {userItemStates &&
                            Object.keys(userItemStates).map((key) => (
                                <UserItemComponent
                                    key={key}
                                    user={userItemStates[key].user}
                                    isActive={userItemStates[key].isActive}
                                    handleUserClicked={handleUserClicked}
                                />
                            ))}
                    </section>
                    <section className="h-[20%] flex flex-col border-t">
                        <button className="h-[50%]">Save</button>
                        <button className="h-[50%] border-t">Cancel</button>
                    </section>
                </article>
            </dialog>
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
                                id="chat-list"
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
                                        <div className="flex border-b">
                                            <div
                                                id="user-list"
                                                className="flex items-center overflow-auto gap-2 flex-1 px-2"
                                            >
                                                {targetChat.users.map(
                                                    (user) => (
                                                        <UserChipComponent
                                                            key={user.uid}
                                                            user={user}
                                                        />
                                                    )
                                                )}
                                            </div>
                                            <button
                                                className="py-4"
                                                onClick={() =>
                                                    dialogRef.current.showModal()
                                                }
                                            >
                                                + Add User
                                            </button>
                                        </div>
                                        <div
                                            id="message-list"
                                            className="h-[75%] overflow-auto"
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
                                            Select a chat
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
