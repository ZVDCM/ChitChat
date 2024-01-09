import React from 'react';
import HeaderLayout from '@components/layouts/HeaderLayout';
import RegisterContainer from '@containers/RegisterContainer';
import FooterLayout from '@components/layouts/FooterLayout';

function RegisterPage() {
    return (
        <>
            <HeaderLayout header="Register" />
            <RegisterContainer />
            <FooterLayout />
        </>
    );
}

export default RegisterPage;
