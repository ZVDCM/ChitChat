import { IMessage } from '@models/message';
import { IUser } from '@models/user';
import moment from 'moment';
import React, { useEffect } from 'react';

interface IProps {
    message: IMessage;
    user: IUser;
    messageListRef: React.RefObject<HTMLDivElement>;
}
function MessageItemComponent({ message, user, messageListRef }: IProps) {
    const isMine = message.from === user.uid;
    useEffect(() => {
        const scrollToBottom = (): void => {
            if (!messageListRef.current) return;
            messageListRef.current.scrollTop =
                messageListRef.current.scrollHeight;
        };
        scrollToBottom();
    }, [messageListRef]);

    return (
        <div
            className={`message-item ${
                isMine ? 'justify-end' : 'justify-start'
            }`}
        >
            <article
                className={`w-fit flex flex-col gap-2 p-2 border border-gray-300 ${
                    isMine ? 'border-r-4' : 'border-l-4'
                }`}
            >
                {!isMine && (
                    <span className="text-[.8rem] text-[gray]">
                        {message.fromDisplayName}
                    </span>
                )}
                <span>{message.message}</span>
                <span className="text-[.8rem] text-[gray]">
                    {moment(message.sentAt).fromNow()}
                </span>
            </article>
        </div>
    );
}

export default MessageItemComponent;
