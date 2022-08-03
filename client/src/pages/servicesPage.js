import {  Carousel, Col, message, Row } from 'antd';
import React, { useEffect } from 'react'

const cardItems = [
    {
      key: '1',
      title: 'Services',
    },
    {
      key: '2',
      title: 'Methods',

    },
    {
      key: '3',
      title: 'Posts',
    },
  ]

const carItems = [
    {
      key: '1',
      title: 'Web and mobile payment built for developers',
      content: 'An vim odio ocurreret consetetur, justo constituto ex mea. Quidam facilisis vituperata pri ne. Id nostrud gubergren urbanitas sed, quo summo animal qualisque ut, cu nostro dissentias consectetuer mel. Ut admodum conceptam mei, cu eam tation fabulas abhorreant. His ex mandamus.',
    },
    {
      key: '2',
      title: 'Work better together. Schedule meetings',
      content: 'An vim odio ocurreret consetetur, justo constituto ex mea. Quidam facilisis vituperata pri ne. Id nostrud gubergren urbanitas sed, quo summo animal qualisque ut, cu nostro dissentias consectetuer mel. Ut admodum conceptam mei, cu eam tation fabulas abhorreant. His ex mandamus.',
    },
    {
      key: '3',
      title: 'The best app to increase your productivity',
      content: 'An vim odio ocurreret consetetur, justo constituto ex mea. Quidam facilisis vituperata pri ne. Id nostrud gubergren urbanitas sed, quo summo animal qualisque ut, cu nostro dissentias consectetuer mel. Ut admodum conceptam mei, cu eam tation fabulas abhorreant. His ex mandamus.',
    },
  ]

const ServicesPage = () => {
  return (
    <div id="services">  
      <ServicesSelection/>
    </div>
  )
}

const ServicesSelection = () => {
  const API_URL = 'http://localhost:1337/api/services/';
  // const [fetchItems, setFetchItems] = useState([]); 

  const info = (msg) => {
    message.success(msg);
  };


  useEffect(() => {
    async function reqCallback(response) {
      if (response.ok) {
        const resObj = await response.json();

        console.log();

        info(`${resObj.services.service.length} Service(s) successfully fected`);
      }
    }

    let request = {
      method: 'GET',
      mode: 'cors',
      headers: { "Content-type": "application/json" }
    }

    const doFetchItems = async () => {
      await fetch(API_URL, request)
        .then(reqCallback)
        .catch(function (error) {
          console.log('Request failed', error);
        })
    };

    (async () => await doFetchItems())();
  }, []);

    return (
        <div className="block servicesBlock">
          <div className="container-fluid">
            <div className="titleHolder">
              <h2>Services</h2>
              <p>Information on the services available along with their associated methods and associated posts are available below.</p>
            </div>
            <Row gutter={[16, 16]}>   
              {cardItems.map(item => {
                return (
                  <Col md={{ span: 8 }} key={item.key}>
                    <div className="content">
                    <ServicesCarousel subject = {item.title}/>
                    </div>
                  </Col>
                );
              })}
            </Row>
          </div>
        </div>
    )
  }

  const ServicesCarousel = (props) => {



    return (
      <div>
        <div className="container-fluid">
        <h2>{props.subject}</h2>          
          <Carousel>
            {carItems.map(item => {
              return (
                <div key={item.key} className="container-fluid">
                  <div className="content">
                    <h3>{item.title}</h3>
                    <p>{item.content}</p>      
                  </div>
                </div>
              );
            })}
          </Carousel>
        </div>
      </div>      
      )
    };
  


 
  export default ServicesPage; 


