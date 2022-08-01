import React from 'react';
import './App.css';
import { Layout, Menu, Popover } from 'antd';
import { BrowserRouter, Route, Routes, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaBabyCarriage, FaBars, FaBolt, FaEarlybirds, FaGrunt, FaJenkins, FaMagento, FaMandalorian } from 'react-icons/fa';

const { Header, Footer, Sider, Content } = Layout;

function App() {
  const Home = () => {
    return (
      <main className="Home">
        <h2>Home</h2>
        <p style={{ marginTop: "1rem" }}>This is the home of the app.</p>
      </main>
    )
  };
  
  const content = (
    <div>
      <p>this is going to be some good stuff - <Link to='/photos/'>Maya Hawke Photos</Link> </p>
      
    </div>
  );

  const Missing = () => {
    return (
      <main className='Missing'>
          <h2>Page Not Found</h2>
          <p>Well, that's disappointing.</p>
          <p>
              <Link to='/'>Visit Our Homepage</Link>
          </p>
      </main>
  )};
  
  const NewPost = () => {
    return (
      <main className="PostPage">
      <h2>Post</h2>
      <p style={{ marginTop: "1rem" }}>This is the post of the app.</p>
    </main>   
    )
  };
  
  const PostPage = () => {
    const { id } = useParams();
  
    return (       
      <main className="PostPage">       
        <h2>Post {id}</h2>
        <p style={{ marginTop: "1rem" }}>This blog app is a project in the Learn React tutorial series.</p>
    </main>    
  )};
  
  const About = () => {
    return (
      <main className="About">
        <h2>About</h2>
        <p style={{ marginTop: "1rem" }}>This blog app is a project in the Learn React tutorial series.</p>
      </main>
    )
  };

  const getItem = (label, link, icon, children, type) => {
    return {
      link,
      icon,
      children,
      label,
      type,
    };
  }


  const items = [
    getItem('Home', '/', <FaBolt />),
    getItem('About', '/about' , <FaEarlybirds />),
    getItem('Post', '/post', <FaGrunt />),
    getItem('Post 2', '/post/2', <FaJenkins />),    
    getItem('404', '/crinky', <FaMagento />),      
    getItem('Services', null, <FaMandalorian />, [
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
      linkVal = <Link to={item.link}>{item.label}</Link> ;
    }

    return <Menu.Item key={nextKey++} icon={item.icon}>{linkVal}</Menu.Item>;
  }
  
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
        <Layout style={{
          minHeight: '100vh',
        }}>
          <Header className="header">
            <div className="logo flexCenter">
              <a href="./"><FaBolt />lijidea</a>
            </div>
            <Popover placement="bottomRight" content={content} title="Jack's Menus">
              <div className="headerUtil flexCenter"><FaBars />
              </div>
            </Popover>
          </Header>
          <Layout className="innerLayout">
            <Sider breakpoint="lg" collapsedWidth={48}>
              <Menu
                mode="inline"
                theme="dark"
                defaultSelectedKeys={['1']}
                style={{ height: '100%' }} >
                {getMenu()}
              </Menu>
            </Sider>
            <Layout>
              <Content style={{ display: 'flex' }}>
                <div className="main">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/post" element={<NewPost />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/post/:id" element={<PostPage />} />
                    <Route path="*" element={<Missing />} />
                  </Routes>
                </div>
              </Content>
              <Footer className="footer">Mephisto MAL Client Developed by lijidea</Footer>
            </Layout>
          </Layout>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;
