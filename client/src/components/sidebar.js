import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { FaCogs, FaMagento, FaMandalorian } from 'react-icons/fa';
import { AiFillHome, AiFillInfoCircle } from 'react-icons/ai';
import { GiHypodermicTest } from 'react-icons/gi';

const { Sider } = Layout;

const AppSidebar = () => {
    let location = useLocation();

    const getItem = (label, link, icon, children, type) => {
        return {
            link,
            icon,
            children,
            label,
            type,
        };
    };

    const items = [
        getItem('Home', '/', <AiFillHome />),
        getItem('About', '/about', <AiFillInfoCircle />),
        getItem('Services', '/services', <FaCogs />),
        getItem('Test', '/test', <GiHypodermicTest />),
        getItem('404', '/crinky', <FaMagento />),
        getItem('Mando', null, <FaMandalorian />, [
            getItem('This is the way'),
            getItem('I have spoken'),
        ])
    ];

    let nextKey = 1;

    const createMenuItem = (item) => {
        let linkVal = item.label;

        if (item.link) {
            linkVal = <NavLink to={item.link}>{item.label}</NavLink>;
        }

        return <Menu.Item key={item.link} icon={item.icon}>{linkVal}</Menu.Item>;
    };

    // only for two level menus
    const getMenu = () => {
        let retVal = [];

        nextKey = 1;

        for (let i = 0; i < items.length; i++) {
            if (items[i].children) {
                let subVal = [];

                for (let j = 0; j < items[i].children.length; j++)
                    subVal.push(createMenuItem(items[i].children[j]));

                retVal.push(<Menu.SubMenu key={nextKey++} title={items[i].label} icon={items[i].icon}>{subVal}</Menu.SubMenu>);
            }
            else
                retVal.push(createMenuItem(items[i]));
        }

        return retVal;
    };


    return (
        <Sider collapsed={true} collapsedWidth={48}>
            <Menu
                mode="inline"
                selectedKeys={[location.pathname]}
                style={{ height: '100%' }} >
                {getMenu()}
            </Menu>
        </Sider>
    );
};

export default AppSidebar;
