import React from 'react';
import { Layout } from 'antd';
import { Route, Routes, useParams } from 'react-router-dom';

import HomePage from '../pages/homePage';
import MissingPage from '../pages/missingPage';
import ServicesPage from '../pages/servicesPage';

const { Content } = Layout;

const AppContent = () => {

    const PostPage = () => {
        const { id } = useParams();

        return (
            <main className="PostPage">
                <h2>Post {id}</h2>
                <p style={{ marginTop: "1rem" }}>This blog app is a project in the Learn React tutorial series.</p>
            </main>
        );
    };

    const AboutPage = () => {
        return (
            <main className="About">
                <h2>About</h2>
                <p style={{ marginTop: "1rem" }}>This blog app is a project in the Learn React tutorial series.</p>
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
                    <Route path="/post/:id" element={<PostPage />} />
                    <Route path="*" element={<MissingPage />} />
                </Routes>
            </div>
        </Content>
    );
};

export default AppContent;
