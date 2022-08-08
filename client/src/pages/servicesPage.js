import { Carousel, Col, message, Row } from 'antd';
import React, { useState, useEffect } from 'react';
import { FaFrown } from 'react-icons/fa';

const testItems = [
    {
        "key": "aaecb368-067c-4d87-b4ec-cfa7a98b702a",
        "name": "bigDog",
        "description": "bigDog information",
        "methods": [
            {
                "key": "c881b7cd-083d-4537-bcb8-0fc00c3664a3",
                "name": "woof",
                "description": "woof information",
                "posts": [
                    {
                        "key": "0d6579ca-f548-432e-b5a3-4ed9ec275412",
                        "date": 1659853352879,
                        "name": "Dog Test 1",
                        "description": "post information",
                        "status": 1
                    },
                    {
                        "key": "0d6579ca-f548-432e-b5a3-4ed9ec275412",
                        "date": 1659853352879,
                        "name": "Dog Test 2",
                        "description": "post information",
                        "status": 1
                    }
                ]
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
        "description": "sarIncident information",
        "methods": [
            {
                "key": "83354767-fe41-4b8d-bc6f-0426367b2c34",
                "name": "config",
                "description": "config information",
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
    const [carouselState, setCarouselState] = useState({ service: 0, method: 0 });

    const info = (msg) => {
        message.success(msg);
    };

    useEffect(() => {
        setFetchItems(testItems);
        console.log('useEffect');
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
                    <h2>Services </h2>
                    <p>Information on the services available along with their associated methods and associated posts are available below.</p>
                </div>
                {getContent(fetchItems, carouselState, setCarouselState)}
            </div>
        </div>
    );
};

const getContent = (serviceArr, carouselState, setCarouselState) => {
    let retVal = [];

    // console.log(serviceArr); // i am being called twice, initially then on setting

    if (serviceArr.length > 0) {

        const sectionItems = [
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

        sectionItems[0]['arr'] = serviceArr;
        sectionItems[1]['arr'] = serviceArr[carouselState.service]?.methods;
        sectionItems[2]['arr'] = serviceArr[carouselState.service]?.methods[carouselState.method]?.posts;

        let tmpArr = [];

        const onChangeService = (index) => {
            const cloneService = { ...carouselState };

            cloneService.service = index;

            setCarouselState(cloneService);
        };

        const onChangeMethod = (index) => {
            const cloneService = { ...carouselState };

            cloneService.method = index;

            setCarouselState(cloneService);
        };

        const arrChangers = [onChangeService, onChangeMethod, null];

        for (let index = 0; index < sectionItems.length; index++) {
            const elemArr = sectionItems[index];

            let tmpConArr = [];

            if ((elemArr?.arr === undefined)) {
                elemArr.arr = [{
                    "name": "no " + sectionItems[index].title,
                    "description": <FaFrown />,
                }];
            }

            elemArr.arr?.forEach(service => {
                tmpConArr.push(
                    <div className="container-fluid">
                        <div className="innerContent">
                            <h1>{service.name}</h1>
                            <p>{service.description}</p>
                        </div>
                    </div>
                );
            });

            tmpArr.push(<Col md={{ span: 8 }} key={elemArr.key}>
                <div className="content">
                    <h3>{elemArr.title}</h3>
                    <Carousel afterChange={arrChangers[index]}>
                        {tmpConArr}
                    </Carousel>
                </div>
            </Col>);
        }
        retVal = <Row gutter={[16, 16]}>{tmpArr} </Row>;
    }

    return retVal;
};

export default ServicesPage;


