import { Carousel, Col, message, Row } from 'antd';
import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaFrown } from 'react-icons/fa';

const ServicesPage = () => {
    return (
        <div id="services">
            <ServicesSelection />
        </div>
    );
};

const ServicesSelection = () => {
    const API_FULL = '';
    const API_URL = API_FULL + '/api/services?complete=true';
    const [fetchItems, setFetchItems] = useState(null);
    const [carouselState, setCarouselState] = useState({ service: 0, method: 0 });

    const info = (msg) => {
        message.success(msg);
    };

    useEffect(() => {
        async function reqCallback(response) {
            if (response.ok) {
                const resObj = await response.json();

                console.log(resObj);

                setFetchItems(resObj);

                const nServices = resObj.length;

                const szServiceMsm = "Service" + ((nServices !== 1) ? "s" : "");

                info(`${nServices} ${szServiceMsm} successfully fetched`);
            }
        }

        let request = {
            method: 'GET',
            mode: 'cors',
            headers: { "Content-type": "application/json" }
        };

        const doFetchItems = async () => {
            await fetch(API_URL, request)
                .then(reqCallback)
                .catch(function (error) {
                    console.log('Request failed', error);
                });
        };

        (async () => await doFetchItems())();
    }, []);

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

    if (serviceArr) {
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

            if ((elemArr?.arr === undefined) || ((elemArr?.arr.length === 0))) {
                elemArr.arr = [{
                    "name": "no " + sectionItems[index].title,
                    "description": "no entries",
                    "image": <FaFrown />
                }];
            }

            elemArr.arr?.forEach(service => {
                tmpConArr.push(
                    <div className="container-fluid">
                        <div className="innerContent">
                            <div className="innerImage">
                                {service?.image ?? <FaCheckCircle />}
                            </div>
                            <div className="innerText">
                                <h1>{service.name}</h1>
                                <p>{service.description}</p>
                            </div>

                        </div>
                    </div>
                );
            });

            tmpArr.push(<Col md={{ span: 8 }} key={elemArr.key}>
                <div className="content">
                    <h2>{elemArr.title}</h2>
                    <Carousel arrows={false} dots={true} infinite slidesToShow={1} slidesToScroll={1} swipeToSlide draggable afterChange={arrChangers[index]}>
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