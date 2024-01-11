import React, { useContext, useEffect } from 'react';
import HeaderLayout from '@components/layouts/HeaderLayout';
import LoginContainer from '@containers/LoginContainer';
import FooterLayout from '@components/layouts/FooterLayout';
import { AuthContext } from '@hooks/UseAuthProvider';
import { useNavigate } from 'react-router-dom';
import { HOME } from '@consts/urls';

function LoginPage() {
    const navigate = useNavigate();
    const { state } = useContext(AuthContext);
    
    useEffect(() => {
        const redirectIfAuthenticated = (): void => {
            if (!state) return;
            navigate(HOME);
        };
        redirectIfAuthenticated();
    }, [state, navigate]);

    return (
        <>
            {!state && (
                <>
                    <HeaderLayout header="Login" />
                    <LoginContainer />
                    <FooterLayout />
                </>
            )}
        </>
    );
}

export default LoginPage;
