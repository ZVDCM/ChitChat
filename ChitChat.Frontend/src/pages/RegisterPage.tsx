import React, { useContext, useEffect } from 'react';
import HeaderLayout from '@components/layouts/HeaderLayout';
import RegisterContainer from '@containers/RegisterContainer';
import FooterLayout from '@components/layouts/FooterLayout';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@hooks/UseAuthProvider';
import { HOME } from '@consts/urls';

function RegisterPage() {
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
                    <HeaderLayout header="Register" />
                    <RegisterContainer />
                    <FooterLayout />
                </>
            )}
        </>
    );
}

export default RegisterPage;
