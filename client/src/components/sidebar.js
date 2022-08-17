import React from 'react';
import { Layout, Menu } from 'antd';
import { FaBabyCarriage, FaCogs, FaCommentAlt, FaMagento, FaMandalorian } from 'react-icons/fa';
import { AiFillHome, AiFillInfoCircle } from 'react-icons/ai';
import { Link } from 'react-router-dom';

const { Sider } = Layout;

const AppSidebar = () => {

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
        getItem('Post 2', '/post/2', <FaCommentAlt />),
        getItem('404', '/crinky', <FaMagento />),
        getItem('Mando', null, <FaMandalorian />, [
            getItem('Option 5'),
            getItem('Option 6'),
            getItem('Option 7'),
            getItem('Option 8'),
        ]),
        getItem('Admin', null, <FaBabyCarriage />, [
            getItem('Option 9'),
            getItem('Option 10')
        ]),
    ];

    let nextKey = 1;

    const createMenuItem = (item) => {
        let linkVal = item.label;

        if (item.link) {
            linkVal = <Link to={item.link}>{item.label}</Link>;
        }

        return <Menu.Item key={nextKey++} icon={item.icon}>{linkVal}</Menu.Item>;
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
                style={{ height: '100%' }} >
                {getMenu()}
            </Menu>
        </Sider>
    );
};

export default AppSidebar;
