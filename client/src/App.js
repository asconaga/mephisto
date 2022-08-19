import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';
import './App.css';

import { BrowserRouter } from 'react-router-dom';

import AppHeader from './components/header';
import AppSidebar from './components/sidebar';
import AppFooter from './components/footer';
import AppFloater from './components/floater';
import AppContent from './components/content';

function App() {

    const storedTheme = localStorage.getItem('malTheme') || 'light';

    const [appTheme, setAppTheme] = useState(storedTheme);

    useEffect(() => {

        localStorage.setItem('malTheme', appTheme);
    }, [appTheme]);



    return (
        <div className="App" data-theme={appTheme}>
            <BrowserRouter>
                <Layout style={{ minHeight: '100vh' }}>
                    <AppHeader appTheme={appTheme} setAppTheme={setAppTheme} />
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
