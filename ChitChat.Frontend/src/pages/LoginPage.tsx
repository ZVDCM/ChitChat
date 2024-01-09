import React from 'react';
import HeaderLayout from '@components/layouts/HeaderLayout';
import LoginContainer from '@containers/LoginContainer';
import FooterLayout from '@components/layouts/FooterLayout';

function LoginPage() {
    return (
        <>
            <HeaderLayout header="Login" />
            <LoginContainer />
            <FooterLayout />
        </>
    );
}

export default LoginPage;
