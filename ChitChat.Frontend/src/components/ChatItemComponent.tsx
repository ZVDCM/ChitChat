import { IChat } from '@models/chat';
import React from 'react';
import moment from 'moment';

interface IProps {
    chat: IChat;
    isActive: boolean;
    handleChatClicked: (chat: IChat) => void;
}
export interface IChatItemState {
    chat: IChat;
    isActive: boolean;
}
function ChatItemComponent({ chat, isActive, handleChatClicked }: IProps) {
    const handleClick = () => {
        handleChatClicked(chat);
    };

    return (
        <div
            id={chat.id}
            className={`user-item border-b last:border-b-0 ${
                isActive ? 'active' : ''
            }`}
            onClick={handleClick}
        >
            <span className="text-[1.5rem] font-bold">
                {chat.users
                    .map((u) => u.displayName)
                    .join(', ')
                    .replace(/,\s*$/, '')}
            </span>
            <span className="text-[.8rem] text-[gray]">
                {moment(chat.createdAt).format('LL')}
            </span>
        </div>
    );
}

export default ChatItemComponent;
