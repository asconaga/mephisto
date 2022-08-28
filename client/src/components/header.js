import { Layout, Dropdown, Popover, Menu, Button, message } from 'antd';

import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { GiDevilMask } from 'react-icons/gi';
import PropTypes from 'prop-types';
import { FaChevronDown, FaMoon, FaSun } from 'react-icons/fa';
import { PollUpdateContext } from '../App';

const { Header } = Layout;

const AppHeader = ({ appTheme, setAppTheme }) => {
    const setPolled = useContext(PollUpdateContext);

    const switchTheme = () => {
        const newTheme = (appTheme === 'light') ? 'dark' : 'light';

        setAppTheme(newTheme);
    };

    const info = (msg, status) => {
        if (status)
            message.success(msg);
        else
            message.error(msg);
    };

    // YAKUBU: do we need to handle the unmount on this?
    useEffect(() => {
        let timer = null;
        let count = 0;

        async function reqCallback(response) {
            if (response.ok) {
                const resObj = await response.text();

                setPolled(true); // inform that a poll has arrived
                info(`${++count} ${resObj}`, true);

                timer = setTimeout(() => getItems(), 100);
            }
        }

        const getItems = () => {
            clearTimeout(timer);
            timer = null;
            (async () => await doFetchItems())();
        };

        let request = {
            method: 'GET',
            mode: 'cors',
            headers: { "Content-type": "application/json" }
        };

        const doFetchItems = async () => {
            await fetch('/api/admin/poll?key=SARIS', request)
                .then(reqCallback)
                .catch(function (error) {
                    console.log('Request failed', error);
                });
        };

        console.log("header UseEffect");

        (async () => await doFetchItems())();
        // eslint-disable-next-line react-hooks/exhaustive-deps           
    }, []);

    const content = (
        <div>
            <Button type="primary" onClick={switchTheme}>Toggle Dark Mode (currently &#39;{appTheme}&#39;)</Button>
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
        <Header className="page-header">
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
    );
};

AppHeader.propTypes = {
    appTheme: PropTypes.string.isRequired,
    setAppTheme: PropTypes.func.isRequired,
};

export default AppHeader;