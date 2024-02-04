import React, { useContext, useEffect, useRef, useState } from 'react';
import LoadingComponent from '@components/LoadingComponent';
import { AuthContext } from '@hooks/UseAuthProvider';
import { useNavigate } from 'react-router-dom';
import { LOGIN } from '@consts/urls';
import Auth from '@_firebase/auth';
import { useMutation, useQuery } from '@apollo/client';
import { AUTH_SET_CREDENTIALS } from '@consts/actions';
import UserItemComponent, {
    IUserItemState,
} from '@components/UserItemComponent';
import {
    CREATE_CHAT,
    GET_ALL_CHATS,
    GET_ALL_MESSAGES,
    SUBSCRIBE_TO_CHAT_CREATED,
} from '@graphql/chats';
import { IChat } from '@models/chat';
import ChatItemComponent, {
    IChatItemState,
} from '@components/ChatItemComponent';
import { GET_ALL_USERS } from '@graphql/users';
import { IUser } from '@models/user';
import UserChipComponent from '@components/UserChipComponent';
import chatClient from '@_apollo/chatClient';
import userClient from '@_apollo/userClient';
import { IMessage } from '@models/message';
import MessageItemComponent from '@components/MessageItemComponent';

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

    const [messages, setMessages] = useState<IMessage[] | null>(null);

    const [targetUsers, setTargetUsers] = useState<IUser[] | null>(null);
    const [userItemStates, setUserItemStates] =
        useState<IUserItemStates | null>(null);

    const dialogRef = useRef({} as HTMLDialogElement);

    const {
        subscribeToMore,
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
        data: messageData,
        loading: messageLoading,
        error: messageError,
    } = useQuery(GET_ALL_MESSAGES, {
        variables: {
            chatId: targetChat?.id,
        },
        skip: !targetChat,
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

    const [createChat, { loading: createChatLoading, error: createChatError }] =
        useMutation(CREATE_CHAT, {
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

    const handleLogout = async (): Promise<void> => {
        setIsLoading(true);
        await Auth.logout();
        setCredentials();
        setIsLoading(false);
        navigate(LOGIN);
    };

    const setTargetUsersAndUserItemStates = (users: IUser[]) => {
        if (!userItemStates) return;
        setTargetUsers(users);
        setUserItemStates(
            Object.keys(userItemStates).reduce((prev, key) => {
                prev[key] = {
                    user: userItemStates[key].user,
                    isActive: false,
                };
                if (users.some((u) => u.uid === key)) {
                    prev[key].isActive = true;
                }
                return prev;
            }, {} as IUserItemStates)
        );
    };

    const handleChatClicked = (chat: IChat) => {
        if (!chatItemStates) return;
        setChatItemStates((prev) => {
            if (!prev) return prev;
            const newState = {
                ...prev,
                [chat.id]: {
                    chat,
                    isActive: true,
                },
            };
            if (targetChat) {
                newState[targetChat.id] = {
                    chat: targetChat,
                    isActive: false,
                };
            }
            return newState;
        });
        setTargetChat(chat);
    };

    const handleUserClicked = (user: IUser) => {
        if (!userItemStates) return;
        setUserItemStates((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                [user.uid]: {
                    user,
                    isActive: !userItemStates[user.uid].isActive,
                },
            };
        });
        if (!userItemStates[user.uid].isActive) {
            setTargetUsers((prev) => {
                if (!prev) return [user];
                return [...prev, user];
            });
        }
    };

    const handleCreateChat = () => {
        setTargetUsersAndUserItemStates([]);
        dialogRef.current.showModal();
    };

    const handleAddUser = () => {
        if (!targetChat) return;
        setTargetUsersAndUserItemStates(targetChat.users);
        dialogRef.current.showModal();
    };

    const handleClose = () => {
        if (!targetUsers) return;
        if (!targetChat) {
            createChat({
                variables: {
                    input: {
                        users: targetUsers,
                    },
                },
            });
            return;
        }
    };

    useEffect(() => {
        const populateChat = (): void => {
            if (!chatData || !state) return;
            const chats = chatData as { getAllChats: IChat[] };
            if (chats.getAllChats.length === 0) return;
            setChatItemStates(
                chats.getAllChats.reduce(
                    (acc, { id, users, messages, createdAt }) => {
                        acc[id] = {
                            chat: {
                                id,
                                users,
                                messages,
                                createdAt,
                            },
                            isActive: false,
                        };
                        return acc;
                    },
                    {} as IChatItemStates
                )
            );
        };
        const populateMessages = (): void => {
            if (!messageData || !state) return;
            const messages = messageData as { getAllMessages: IMessage[] };
            if (messages.getAllMessages.length === 0) return;
            setMessages(messages.getAllMessages);
        };
        const populateUser = (): void => {
            if (!userData || !state) return;
            const users = userData as { getAllUsers: IUser[] };
            if (users.getAllUsers.length === 0) return;
            setUserItemStates(
                users.getAllUsers.reduce((acc, { uid, displayName, email }) => {
                    acc[uid] = {
                        user: {
                            uid,
                            displayName,
                            email,
                        },
                        isActive: false,
                    };
                    return acc;
                }, {} as IUserItemStates)
            );
        };
        populateChat();
        populateMessages();
        populateUser();
    }, [chatData, messageData, userData, state]);

    useEffect(() => {
        const subscribeToChatCreated = () => {
            if (!state) return;
            subscribeToMore({
                document: SUBSCRIBE_TO_CHAT_CREATED,
                variables: {
                    userUid: state?.user.uid,
                },
                updateQuery: (prev, { subscriptionData }) => {
                    if (!subscriptionData.data) return prev;
                    const chatCreated = subscriptionData.data.chatCreated;
                    console.log(chatCreated);
                    return Object.assign({}, prev, {
                        getAllChats: [chatCreated, ...prev.getAllChats],
                    });
                },
            });
        };
        subscribeToChatCreated();
    }, [subscribeToMore, state]);

    useEffect(() => {
        const setLoading = (): void => {
            setIsLoading(
                chatLoading ||
                    userLoading ||
                    createChatLoading ||
                    messageLoading
            );
        };
        setLoading();
    }, [
        chatLoading,
        userLoading,
        createChatLoading,
        messageLoading,
        setIsLoading,
    ]);

    useEffect(() => {
        const alertError = (): void => {
            setIsLoading(false);
            if (chatError) alert(chatError.message);
            if (userError) alert(userError.message);
            if (createChatError) alert(createChatError.message);
            if (messageError) alert(messageError.message);
        };
        alertError();
    }, [chatError, userError, createChatError, messageError]);

    return (
        <>
            {isLoading && <LoadingComponent />}
            <dialog
                ref={dialogRef}
                onClose={handleClose}
                className="m-auto backdrop:backdrop-blur-[1px]"
            >
                <article className="h-[500px]  w-[400px] flex flex-col border">
                    <section className="h-[10%] border-b flex justify-between items-center pl-4">
                        <h1 className="font-bold">Chat Members</h1>
                        <button
                            className="w-[50px] h-[50px] border-l"
                            onClick={() => dialogRef.current.close()}
                        >
                            X
                        </button>
                    </section>
                    <section id="user-list" className="h-[90%] overflow-auto">
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
                                className="relative w-[30%] border-r overflow-auto"
                            >
                                <div className="sticky top-0 left-0">
                                    <button onClick={handleCreateChat}>
                                        + Create chat
                                    </button>
                                </div>
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
                                        <div className="h-[10%] flex border-b">
                                            <div
                                                id="user-chip-list"
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
                                            <button onClick={handleAddUser}>
                                                + Add User
                                            </button>
                                        </div>
                                        <div
                                            id="message-list"
                                            className="h-[80%] overflow-auto p-2 pr-0"
                                        >
                                            {messages &&
                                                messages.map((m, i) => (
                                                    <MessageItemComponent
                                                        key={i}
                                                        message={m}
                                                        user={state.user}
                                                    />
                                                ))}
                                        </div>
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
                                        <span className="text-[#ccc]">
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
