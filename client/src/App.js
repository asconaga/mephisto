import React from 'react';
import { Layout } from 'antd';
import './App.css';

import { BrowserRouter } from 'react-router-dom';

import AppHeader from './components/header';
import AppSidebar from './components/sidebar';
import AppFooter from './components/footer';
import AppFloater from './components/floater';
import AppContent from './components/content';

const { Content } = Layout;

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Layout style={{ minHeight: '100vh' }}>
                    <AppHeader />
                    <Layout className="innerLayout">
                        <AppSidebar />
                        <AppContent />
                    </Layout>
                    <AppFooter />
                </Layout>
                <AppFloater />
            </BrowserRouter>
        </div>
    );
}

export default App;
