import React from 'react';
import { Layout } from 'antd';
import { Route, Routes, useParams } from 'react-router-dom';

import HomePage from '../pages/homePage';
import MissingPage from '../pages/missingPage';
import ServicesPage from '../pages/servicesPage';
import TestPage from '../pages/testPage';
import AboutPage from '../pages/aboutPage';
import PostPage from '../pages/postPage';

const { Content } = Layout;

const AppContent = () => {
    return (
        <Content style={{ display: 'flex' }}>
            <div className="main">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/test" element={<TestPage />} />
                    <Route path="/post/:id" element={<PostPage />} />
                    <Route path="*" element={<MissingPage />} />
                </Routes>
            </div>
        </Content>
    );
};

export default AppContent;
