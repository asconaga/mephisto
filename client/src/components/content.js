import React from 'react';
import { Layout } from 'antd';
import { Route, Routes, useParams } from 'react-router-dom';

import HomePage from '../pages/homePage';
import MissingPage from '../pages/missingPage';
import ServicesPage from '../pages/servicesPage';
import TestPage from '../pages/testPage';

const { Content } = Layout;

const AppContent = () => {

    const AboutPage = () => {
        return (
            <main className="About">
                <div className="block">
                    <div className="titleHolder">
                        <h2>About</h2>
                        <p style={{ marginTop: "1rem" }}>Information about the Mephisto MAL client and lijidea the power behind it</p>
                    </div>
                </div>
            </main>
        );
    };

    return (
        <Content style={{ display: 'flex' }}>
            <div className="main">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/test" element={<TestPage />} />
                    <Route path="*" element={<MissingPage />} />
                </Routes>
            </div>
        </Content>
    );
};

export default AppContent;
