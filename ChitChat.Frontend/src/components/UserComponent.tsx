import React from 'react';
import { IUser } from '../models/user';

interface IProps {
    user: IUser;
}
function UserComponent({ user }: IProps) {
    return (
        <div
            id={user.uid}
            className="user-item flex flex-col justify-center p-4 hover:bg-[#ccc] cursor-pointer"
        >
            <span className="text-[.8rem] text-[gray]">{user.email}</span>
            <span className="text-[1.5rem] font-bold">@{user.displayName}</span>
        </div>
    );
}

export default UserComponent;
