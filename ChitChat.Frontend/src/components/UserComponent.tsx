import React from 'react';
import { IUser } from '../models/user';

interface IProps {
    user: IUser;
    isActive: boolean;
    handleUserClicked: (user: IUser) => void;
}

export interface IUserItemState {
    user: IUser;
    isActive: boolean;
}
function UserComponent({ user, isActive, handleUserClicked }: IProps) {
    const handleClick = () => {
        handleUserClicked(user);
    };

    return (
        <div
            id={user.uid}
            className={`user-item border-b last:border-b-0 ${
                isActive ? 'active' : ''
            }`}
            onClick={handleClick}
        >
            <span className="text-[.8rem] text-[gray]">{user.email}</span>
            <span className="text-[1.5rem] font-bold">@{user.displayName}</span>
        </div>
    );
}

export default UserComponent;
