import { IUser } from '@models/user';
import React from 'react';

interface IProps {
    user: IUser;
}
function UserChipComponent({ user }: IProps) {
    return (
        <div id={user.uid} className="user-chip">
            <span className="text-[1rem] font-bold">@{user.displayName}</span>
        </div>
    );
}

export default UserChipComponent;
