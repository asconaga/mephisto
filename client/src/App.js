import React, { useState } from 'react';
import './App.css';
import { Button, Dropdown, Layout, Menu, Modal, Popover, Result } from 'antd';
import { Link, BrowserRouter, Route, Routes, useParams } from 'react-router-dom';
import { FaBabyCarriage, FaBars, FaBolt, FaChevronDown, FaCogs, FaCommentAlt, FaInfoCircle, FaJenkins, FaMagento, FaMandalorian } from 'react-icons/fa';
import ServicesPage from './pages/servicesPage';
import HomePage from './pages/homePage';
import { GiDevilMask } from 'react-icons/gi';
import { AiFillHome, AiFillInfoCircle } from 'react-icons/ai';

const { Header, Footer, Sider, Content } = Layout;

function App() {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const content = (
        <div>
            <p>this is going to be some good stuff - <Link to='/photos/'>Maya Hawke Photos</Link> </p>
        </div>
    );

    const Missing = () => {
        return (
            <main className='Missing'>
                <Result
                    status="404"
                    title="404"
                    subTitle="Sorry, something went horribly wrong..."
                    extra={
                        <Button type="primary" key="console">
                            <Link to='/'>Visit Our Homepage</Link>
                        </Button>
                    } />
            </main>
        );
    };

    const PostPage = () => {
        const { id } = useParams();

        return (
            <main className="PostPage">
                <h2>Post {id}</h2>
                <p style={{ marginTop: "1rem" }}>This blog app is a project in the Learn React tutorial series.</p>
            </main>
        );
    };

    const About = () => {
        return (
            <main className="About">
                <h2>About</h2>
                <p style={{ marginTop: "1rem" }}>This blog app is a project in the Learn React tutorial series.</p>
            </main>
        );
    };

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
        <div className="App">
            <BrowserRouter>
                <Layout style={{ minHeight: '100vh' }}>
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
                    <Layout className="innerLayout">
                        <Sider collapsed={true} collapsedWidth={48}>
                            <Menu
                                mode="inline"
                                style={{ height: '100%' }} >
                                {getMenu()}
                            </Menu>
                        </Sider>
                        <Layout>
                            <Content style={{ display: 'flex' }}>
                                <div className="main">
                                    <Routes>
                                        <Route path="/" element={<HomePage />} />
                                        <Route path="/services" element={<ServicesPage />} />
                                        <Route path="/about" element={<About />} />
                                        <Route path="/post/:id" element={<PostPage />} />
                                        <Route path="*" element={<Missing />} />
                                    </Routes>
                                </div>
                            </Content>
                            <Footer className="footer">Mephisto MAL Client = &lsquo;Developed by lijidea&rsquo;</Footer>
                        </Layout>
                    </Layout>
                </Layout>
                <div className='floater'>
                    <Button onClick={showModal}><FaInfoCircle /></Button>
                </div>
                <Modal title="Quck Help" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                    {content}
                </Modal>
            </BrowserRouter>
        </div>
    );
}

export default App;
