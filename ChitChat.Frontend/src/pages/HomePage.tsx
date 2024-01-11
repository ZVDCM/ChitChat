import React, { useContext, useEffect } from 'react';
import HeaderLayout from '@components/layouts/HeaderLayout';
import HomeContainer from '@containers/HomeContainer';
import FooterLayout from '@components/layouts/FooterLayout';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@hooks/UseAuthProvider';
import { LOGIN } from '@consts/urls';

function HomePage() {
    const navigate = useNavigate();
    const { state } = useContext(AuthContext);

    useEffect(() => {
        const redirectIfUnauthenticated = (): void => {
            if (state) return;
            navigate(LOGIN);
        };
        redirectIfUnauthenticated();
    }, [state, navigate]);

    return (
        <>
            {state && (
                <>
                    <HeaderLayout header={'Home'} />
                    <HomeContainer />
                    <FooterLayout />
                </>
            )}
        </>
    );
}

export default HomePage;
