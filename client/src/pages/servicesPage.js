import { Carousel, Col, message, Row } from 'antd';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const testItems = [
    {
        "key": "aaecb368-067c-4d87-b4ec-cfa7a98b702a",
        "name": "bigDog",
        "description": "bigDog information",
        "methods": [
            {
                "key": "c881b7cd-083d-4537-bcb8-0fc00c3664a3",
                "name": "woof",
                "description": "woof information"
            },
            {
                "key": "799d812a-2e16-4db6-a711-06199d9eced1",
                "name": "growl",
                "description": "growl information"
            },
            {
                "key": "09c1adc6-d07f-4c53-8569-c35e7dc68dee",
                "name": "poop",
                "description": "poop information"
            }
        ]
    },
    {
        "key": "34a03ee6-2c79-44fb-9432-a9b3870826ab",
        "name": "sarIncident",
        "description": "MsarIncident information",
        "methods": [
            {
                "key": "83354767-fe41-4b8d-bc6f-0426367b2c34",
                "name": "config",
                "description": "configinformation",
                "posts": [
                    {
                        "key": "0d6579ca-f548-432e-b5a3-4ed9ec275412",
                        "date": 1659853352879,
                        "name": "Thailand Test 1",
                        "description": "post information",
                        "status": 1
                    }
                ]
            },
            {
                "key": "2a6d44bf-7b74-49ee-a54b-acc6827dc07e",
                "name": "results",
                "description": "results information"
            }
        ]
    }
];

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
];

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
];

const ServicesPage = () => {
    return (
        <div id="services">
            <ServicesSelection />
        </div>
    );
};

const ServicesSelection = () => {
    const API_FULL = 'http://localhost:1337';
    const API_URL = API_FULL + '/api/services?complete=true';
    const [fetchItems, setFetchItems] = useState([]);

    const info = (msg) => {
        message.success(msg);
    };

    useEffect(() => {
        setFetchItems(testItems);
    }, []);
    // useEffect(() => {
    //     async function reqCallback(response) {
    //         if (response.ok) {
    //             const resObj = await response.json();

    //             console.log(resObj);

    //             setFetchItems(resObj);

    //             const nServices = resObj.length;

    //             const szServiceMsm = "Service" + ((nServices !== 1) ? "s" : "");

    //             info(`${nServices} ${szServiceMsm} successfully fetched`);
    //         }
    //     }

    //     let request = {
    //         method: 'GET',
    //         mode: 'cors',
    //         headers: { "Content-type": "application/json" }
    //     };

    //     const doFetchItems = async () => {
    //         await fetch(API_URL, request)
    //             .then(reqCallback)
    //             .catch(function (error) {
    //                 console.log('Request failed', error);
    //             });
    //     };

    //     (async () => await doFetchItems())();
    // }, []);

    return (
        <div className="block servicesBlock">
            <div className="container-fluid">
                <div className="titleHolder">
                    <h2>Services</h2>
                    <p>Information on the services available along with their associated methods and associated posts are available below.</p>
                </div>
                {getContent(fetchItems)}
            </div>
        </div>
    );
};

const ServicesCarousel = (props) => {
    return (
        <div>
            <div className="container-fluid">
                <h2>{props.subject}</h2>
                <Carousel>
                    {/* {carItems.map(item => {
                        return (
                            <div key={item.key} className="container-fluid">
                                <div className="content">
                                    <h3>{item.title}</h3>
                                    <p>{item.content}</p>
                                </div>
                            </div>
                        );
                    })} */}

                    <div key={1} className="container-fluid">
                        <div className="content">
                            <h3>fred</h3>
                            <p>billy</p>
                        </div>
                    </div>

                </Carousel>
            </div>
        </div>
    );
};

ServicesCarousel.propTypes = {
    subject: PropTypes.string.isRequired
};

const getContent = (serviceArr) => {
    let retVal = [];

    let nService = 1;
    let nMethod = 0;

    console.log(serviceArr); // i am being called twice

    if (serviceArr.length > 0) {

        serviceArr.forEach(service => {
            retVal.push(<p>{service.name} - {service.description}</p>);
        });

        let methodsArr = serviceArr[nService]?.methods ?? [{
            "name": serviceArr[nService].name,
            "description": "No methods"
        }];

        methodsArr.forEach(method => {
            retVal.push(<p>---{method.name} - {method.description}</p>);
        });

        let postsArr = methodsArr[nMethod]?.posts ?? [{
            "name": methodsArr[nMethod].name,
            "description": "No posts"
        }];
        postsArr.forEach(post => {
            retVal.push(<p>-------{post.name} - {post.description}</p>);
        });



        // let retVal = <Row gutter={[16, 16]}>
        //     {cardItems.map(item => {
        //         return (
        //             <Col md={{ span: 8 }} key={item.key}>
        //                 <div className="content">
        //                     <ServicesCarousel subject={item.title} />
        //                 </div>
        //             </Col>
        //         );
        //     })}
        // </Row>;
    }

    const onChange = (index) => {
        console.log(index);
    };

    // let rowArr = [];
    // cardItems.forEach(item => {
    //     rowArr.push(
    //         <Col md={{ span: 8 }} key={item.key}>
    //             <div className="content">
    //                 <div className="container-fluid">
    //                     <h2>{item.title}</h2>
    //                     {<Carousel beforeChange={onChange}>
    //                         <div key={1} className="container-fluid">
    //                             <div className="content">
    //                                 <h3>fred</h3>
    //                                 <p>billy</p>
    //                             </div>
    //                         </div>
    //                         <div key={2} className="container-fluid">
    //                             <div className="content">
    //                                 <h3>fred</h3>
    //                                 <p>billy</p>
    //                             </div>
    //                         </div>
    //                     </Carousel>}
    //                 </div>
    //             </div>
    //         </Col>
    //     );
    // });
    // retVal = <Row gutter={[16, 16]}>{rowArr}</Row>;  


    // const retVal = <div>{tmpArr}</div>;
    {/* {cardItems.map(item => {
            return (
                <div key={item.key}>
                    <div className="content">
                        <p>{item.title}</p>
                    </div>
                </div>
            );
        })}
    </div>; */}




    return retVal;
};


export default ServicesPage;


