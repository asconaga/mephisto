import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';
import './App.css';

import { BrowserRouter } from 'react-router-dom';

import AppHeader from './components/header';
import AppSidebar from './components/sidebar';
import AppFooter from './components/footer';
import AppFloater from './components/floater';
import AppContent from './components/content';

export const PollContext = React.createContext();
export const PollUpdateContext = React.createContext();

function App() {
    const storedTheme = localStorage.getItem('malTheme') || 'light';

    const [appTheme, setAppTheme] = useState(storedTheme);
    const [hasPolled, setHasPolled] = useState(false);

    const setPolled = (state) => {
        setHasPolled(state);
    };

    useEffect(() => {
        localStorage.setItem('malTheme', appTheme);
    }, [appTheme]);

    // YAKUBU: wrap PollContext and PollUpdateContext in hook
    return (
        <div className="App" data-theme={appTheme}>
            <BrowserRouter>
                <Layout>
                    <PollContext.Provider value={hasPolled}>
                        <PollUpdateContext.Provider value={setPolled}>
                            <AppHeader appTheme={appTheme} setAppTheme={setAppTheme} />
                            <Layout className="page-main">
                                <AppSidebar />
                                <AppContent />
                            </Layout>
                            <AppFooter />
                        </PollUpdateContext.Provider>
                    </PollContext.Provider>
                </Layout>
                <AppFloater />
            </BrowserRouter>
        </div>
    );
}

export default App;
