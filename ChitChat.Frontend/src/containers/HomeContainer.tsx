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
    MESSAGE_CHAT,
    SUBSCRIBE_TO_CHAT_CREATED,
    SUBSCRIBE_TO_MESSAGE_ADDED,
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
export interface IChatMessages {
    [key: string]: IMessage[];
}
function HomeContainer() {
    const navigate = useNavigate();
    const { state, dispatch } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);

    const [targetChat, setTargetChat] = useState<IChat | null>(null);
    const [chatItemStates, setChatItemStates] =
        useState<IChatItemStates | null>(null);

    const messageListRef = useRef({} as HTMLDivElement);
    const txtMessageRef = useRef({} as HTMLInputElement);
    const [chatMessages, setChatMessages] = useState<IChatMessages | null>(
        null
    );

    const [targetUsers, setTargetUsers] = useState<IUser[]>([]);
    const [userItemStates, setUserItemStates] =
        useState<IUserItemStates | null>(null);

    const dialogRef = useRef({} as HTMLDialogElement);

    const {
        subscribeToMore: subscribeToChat,
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
        subscribeToMore: subscribeToMessages,
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

    const [messageChat, { error: messageChatError }] = useMutation(
        MESSAGE_CHAT,
        {
            context: {
                headers: {
                    token: state?.token,
                },
            },
            client: userClient,
        }
    );

    const handleMessageChat = (event: React.FormEvent): void => {
        event.preventDefault();
        const message = txtMessageRef.current.value;
        if (!targetChat || !message) return;
        messageChat({
            variables: {
                input: { chatId: targetChat.id, users: targetUsers, message },
            },
        });
        txtMessageRef.current.value = '';
    };

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

    const handleChatClicked = (chat: IChat): void => {
        if (!chatItemStates) return;
        if (targetChat && targetChat.id === chat.id) return;
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
        setTargetUsers(chat.users);
        setChatMessages((prev) => {
            const newState = prev ?? {};
            if (!newState[chat.id]) {
                newState[chat.id] = [];
            }
            return newState;
        });
    };

    const handleUserClicked = (user: IUser): void => {
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

    const handleCreateChat = (): void => {
        setTargetUsers([]);
        setTargetChat(null);
        setUserItemStates((prev) => {
            if (!prev) return prev;
            Object.keys(prev).forEach((uid) => {
                prev[uid].isActive = false;
            });
            return prev;
        });
        dialogRef.current.showModal();
    };

    const handleClose = (): void => {
        if (!targetUsers) return;
        createChat({
            variables: {
                input: {
                    users: targetUsers,
                },
            },
        });
        return;
    };

    useEffect(() => {
        const populateChat = (): void => {
            if (!chatData) return;
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
        populateChat();
    }, [chatData]);
    useEffect(() => {
        const populateMessages = (): void => {
            if (!messageData) return;
            const { chatId, messages } = (
                messageData as {
                    getAllMessages: { chatId: string; messages: IMessage[] };
                }
            ).getAllMessages;
            setChatMessages((prev) => {
                const newState = prev ?? {};
                if (newState[chatId]) {
                    if (newState[chatId].length > messages.length) {
                        return newState;
                    }
                }
                return {
                    ...prev,
                    [chatId]: messages,
                };
            });
        };
        populateMessages();
    }, [messageData]);
    useEffect(() => {
        const populateUser = (): void => {
            if (!userData) return;
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
        populateUser();
    }, [userData]);

    useEffect(() => {
        const subscribeToChatCreated = (): (() => void) | void => {
            if (!state) return;
            return subscribeToChat({
                document: SUBSCRIBE_TO_CHAT_CREATED,
                variables: {
                    userUid: state?.user.uid,
                },
                updateQuery: (prev, { subscriptionData }) => {
                    if (!subscriptionData.data) return prev;
                    const chatCreated = subscriptionData.data.chatCreated;
                    return Object.assign({}, prev, {
                        getAllChats: [...prev.getAllChats, chatCreated],
                    });
                },
            });
        };
        const subscribeToMessageAdded = (): (() => void) | void => {
            if (!state || !chatItemStates) return;
            return subscribeToMessages({
                document: SUBSCRIBE_TO_MESSAGE_ADDED,
                variables: {
                    userUid: state?.user.uid,
                },
                updateQuery: (prev, { subscriptionData }) => {
                    if (!subscriptionData.data) return prev;
                    const { chatId, messages } =
                        subscriptionData.data.messageAdded;
                    console.log(messages.length);
                    return Object.assign({}, prev, {
                        getAllMessages: {
                            chatId,
                            messages,
                        },
                    });
                },
            });
        };
        const unSubChatCreated = subscribeToChatCreated();
        const unSubMessageAdded = subscribeToMessageAdded();

        return () => {
            if (!unSubChatCreated) return;
            if (!unSubMessageAdded) return;
            unSubChatCreated();
            unSubMessageAdded();
        };
    }, [subscribeToChat, subscribeToMessages, state, chatItemStates]);

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
            if (chatError) alert(`chat error: ${chatError.message}`);
            if (userError) alert(`user error: ${userError.message}`);
            if (createChatError)
                alert(`create chat error: ${createChatError.message}`);
            if (messageError) alert(`message error: ${messageError.message}`);
            if (messageChatError)
                alert(`message chat error: ${messageChatError.message}`);
        };
        alertError();
    }, [chatError, userError, createChatError, messageError, messageChatError]);

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
                                        </div>
                                        <div
                                            id="message-list"
                                            ref={messageListRef}
                                            className="h-[80%] flex flex-col gap-2 overflow-auto p-2 pr-0"
                                        >
                                            {chatMessages &&
                                                chatMessages[targetChat.id].map(
                                                    (m, i) => (
                                                        <MessageItemComponent
                                                            key={i}
                                                            message={m}
                                                            user={state.user}
                                                            messageListRef={
                                                                messageListRef
                                                            }
                                                        />
                                                    )
                                                )}
                                        </div>
                                        <div className="h-[10%]">
                                            <form
                                                className="flex gap-4"
                                                onSubmit={handleMessageChat}
                                            >
                                                <input
                                                    type="text"
                                                    ref={txtMessageRef}
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
