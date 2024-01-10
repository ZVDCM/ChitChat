import React from 'react';

function NotFound() {
    return (
        <div className="h-screen flex flex-col items-center p-[15rem]">
            <h1 className="text-[5rem]">404 NOT FOUND</h1>
            <a href="/" className="text-[2rem] hover:underline cursor-pointer">
                Chit Chat
            </a>
        </div>
    );
}

export default NotFound;
