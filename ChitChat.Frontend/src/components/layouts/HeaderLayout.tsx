import React from 'react';

interface IProps {
    header: string;
}

function HeaderLayout({ header }: IProps) {
    return (
        <header className="h-[200px] flex justify-center items-center flex-col">
            <span className="text-[1rem]">ASK HERE</span>
            <h1 className="page-header text-[5rem] leading-[4rem]">{header}</h1>
        </header>
    );
}

export default HeaderLayout;
