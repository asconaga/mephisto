import React from 'react';

import { Layout } from 'antd';
import { useLocation } from 'react-router';

const { Footer } = Layout;

const AppFooter = () => {

    const location = useLocation();
    return (
        <Footer className="page-footer">Mephisto MAL Client = &lsquo;Developed by lijidea&rsquo; [{location.pathname}]</Footer>
    );
};

export default AppFooter;
