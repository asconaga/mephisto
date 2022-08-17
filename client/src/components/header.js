import { Layout, Dropdown, Popover, Menu } from 'antd';

import React from 'react';
import { Link } from 'react-router-dom';
import { GiDevilMask } from 'react-icons/gi';

import { FaBars, FaChevronDown } from 'react-icons/fa';

const { Header } = Layout;

const AppHeader = () => {
    const content = (
        <div>
            <p>this is going to be some good stuff - <Link to='/photos/'>Maya Hawke Photos</Link> </p>
        </div>
    );

    const menu = (
        <Menu
            items={[
                {
                    key: '1',
                    label: (
                        <a target="_blank" rel="noopener noreferrer" href="/about">
                            1st menu item
                        </a>
                    ),
                },
                {
                    key: '2',
                    label: (
                        <a target="_blank" rel="noopener noreferrer" href="/services">
                            3rd menu item (disabled)
                        </a>
                    ),
                },
                {
                    key: '3',
                    danger: true,
                    label: 'a danger item',
                },
            ]}
        />
    );


    return (
        <div>
            <Header className="header">
                <div className="logo flexCenter">
                    <Link to='/'><GiDevilMask /> - Mephisto</Link>
                </div>
                <Dropdown overlay={menu}>
                    <div className="headerUtil flexCenter"><FaChevronDown /></div>
                </Dropdown>
                <Popover placement="bottomRight" content={content} title="Jack's Menus">
                    <div className="headerUtil flexCenter"><FaBars /></div>
                </Popover>
            </Header>
        </div>
    );
};

export default AppHeader;


