import React from 'react';

import { Layout } from 'antd';
import { useLocation } from 'react-router';

const { Footer } = Layout;

const AppFooter = () => {

    const location = useLocation();
    return (
        <div>
            <Footer className="footer">Mephisto MAL Client = &lsquo;Developed by lijidea&rsquo; [{location.pathname}]</Footer>
        </div>
    );
};

export default AppFooter;
