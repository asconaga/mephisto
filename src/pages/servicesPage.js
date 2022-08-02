import { Button, Carousel, Col, Row } from 'antd';
import React from 'react'
import { FaGrunt } from 'react-icons/fa';

const cardItems = [
    {
      key: '1',
      title: 'High Performance',
      content: 'cu nostro dissentias consectetuer mel. Ut admodum conceptam mei, cu eam tation fabulas abhorreant. His ex mandamus.',
    },
    {
      key: '2',
      title: 'Flat Design',
      content: 'cu nostro dissentias consectetuer mel. Ut admodum conceptam mei, cu eam tation fabulas abhorreant. His ex mandamus.',
    },
    {
      key: '3',
      title: 'Simplified Workflow',
      content: 'cu nostro dissentias consectetuer mel. Ut admodum conceptam mei, cu eam tation fabulas abhorreant. His ex mandamus.',
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
    <div>
      <ServicesSelection/>
      <ServicesResult/>
    </div>
  )
}



const ServicesSelection = () => {
    return (
      <div id="services" className='servicesBlock'>
      <Carousel>
      {carItems.map(item => {
          return (
            <div key={item.key} className="container-fluid">
              <div className="content">
                <h3>{item.title}</h3>
                <p>{item.content}</p>
                <div className="btnHolder">
                  <Button type="primary" size="large">Learn More</Button>
                  <Button size="large"><FaGrunt/> Watch a Demo</Button>
                </div>
              </div>         
            </div>  
          );
        })}
      </Carousel>
    </div>  
    )
  };



const ServicesResult = () => {
    return (
        <div>
        <div id="about" className="block servicesBlock">
          <div className="container-fluid">
            <div className="titleHolder">
              <h2>About Us</h2>
              <p>dolor sit amet, consectetur adipisicing elit</p>
            </div>
            <div className="contentHolder">
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Velit necessitatibus officiis repudiandae est deserunt delectus dolorem iure porro distinctio fuga, nostrum doloremque. Facilis porro in laborum dolor amet ratione hic? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magnam aut a porro, adipisci quidem sint enim pariatur ducimus, saepe voluptatibus inventore commodi! Quis, explicabo molestias libero tenetur temporibus perspiciatis deserunt.</p>
            </div>
            <Row gutter={[16, 16]}>   
              {cardItems.map(item => {
                return (
                  <Col md={{ span: 8 }} key={item.key}>
                    <div className="content">
                      <div className="icon">
                        {item.icon}
                      </div>
                      <h3>{item.title}</h3>
                      <p>{item.content}</p>
                    </div>
                  </Col>
                );
              })}
            </Row>
          </div>
        </div>
        </div>
    )
  }
 
  export default ServicesPage; 


