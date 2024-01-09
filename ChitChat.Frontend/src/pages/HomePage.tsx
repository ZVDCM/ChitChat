import React from 'react';
import HeaderLayout from '@components/layouts/HeaderLayout';
import HomeContainer from '@containers/HomeContainer';
import FooterLayout from '@components/layouts/FooterLayout';

function HomePage() {
    throw new Error('Not implemented');
    return (
        <>
            <HeaderLayout header={'Home'} />
            <HomeContainer />
            <FooterLayout />
        </>
    );
}

export default HomePage;
