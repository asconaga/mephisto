import { Layout, Dropdown, Popover, Menu, Button } from 'antd';

import React from 'react';
import { Link } from 'react-router-dom';
import { GiDevilMask } from 'react-icons/gi';
import PropTypes from 'prop-types';
import { FaChevronDown, FaMoon, FaSun } from 'react-icons/fa';

const { Header } = Layout;

const AppHeader = ({ appTheme, setAppTheme }) => {
    const switchTheme = () => {
        const newTheme = (appTheme === 'light') ? 'dark' : 'light';

        setAppTheme(newTheme);
    };

    const content = (
        <div>
            <Button type="primary" onClick={switchTheme} >Toggle Dark Mode (currently &#39;{appTheme}&#39;)</Button>
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
                    <div className="headerUtil flexCenter">{(appTheme === 'light') ? <FaSun /> : <FaMoon />}</div>
                </Popover>
            </Header>
        </div>
    );
};

AppHeader.propTypes = {
    appTheme: PropTypes.string.isRequired,
    setAppTheme: PropTypes.func.isRequired,
};

export default AppHeader;