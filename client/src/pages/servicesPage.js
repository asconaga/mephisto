import { Button, Carousel, Col, message, Row } from 'antd';
import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaFrown } from 'react-icons/fa';

const ServicesPage = () => {
    return (
        <ServicesSelection />
    );
};

const ServicesSelection = () => {
    const API_FULL = '';
    const API_URL = API_FULL + '/api/services?complete=true';
    const [fetchItems, setFetchItems] = useState(null);
    const [carouselState, setCarouselState] = useState({ service: 0, method: 0 });

    const info = (msg, status) => {
        if (status)
            message.success(msg);
        else
            message.error(msg);
    };

    useEffect(() => {
        async function reqCallback(response) {
            if (response.ok) {
                const resObj = await response.json();

                console.log(resObj);

                setFetchItems(resObj);

                const nServices = resObj.length;

                const szServiceMsm = "Service" + ((nServices !== 1) ? "s" : "");

                info(`${nServices} ${szServiceMsm} successfully fetched`, true);
            }
            else {
                info("Cannot communicate with server", false);
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
    }, [API_URL]);

    return (
        <div className="ServicesPage">
            <div className="container-fluid">
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
                title: 'Services'
            },
            {
                key: '2',
                title: 'Methods'
            },
            {
                key: '3',
                title: 'Posts'
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

        const customPag = (i) => {
            return <p style={{ userSelect: 'none' }}>{i + 1}</p>;
        };

        const appendDots = (dots) => {
            return (
                <div style={{ backgroundColor: "lightgray" }}>
                    <ul style={{ color: "black", margin: "3px" }}> {dots} </ul>
                </div>
            );
        };

        const showPostDetails = () => {
        };

        const arrChangers = [onChangeService, onChangeMethod, null];

        const order = [0, 2, 1]; // posts in the middle

        order.forEach(index => {
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

                                {(() => {
                                    if ((index === 2) && (!service?.image)) {
                                        return <Button onClick={showPostDetails} type="primary">See Incident Detail</Button>;
                                    }
                                })()}
                            </div>
                        </div>
                    </div>
                );
            });

            tmpArr.push(<div key={elemArr.key} className={(index !== 2) ? "content" : "posts"}>
                <h2>{elemArr.title}</h2>
                <Carousel arrows={false}
                    dots={true}
                    infinite
                    slidesToShow={Math.min(tmpConArr.length, 3)}
                    slidesToScroll={1}
                    swipeToSlide
                    draggable
                    centerMode={true}
                    centerPadding="0px"
                    className="center"
                    focusOnSelect={true}
                    responsive={[
                        {
                            breakpoint: 1024,
                            settings: {
                                slidesToShow: 1
                            }
                        }]}
                    customPaging={customPag}
                    appendDots={appendDots}
                    cssEase="cubic-bezier(0.600, -0.280, 0.735, 0.045)"
                    afterChange={arrChangers[index]}>
                    {tmpConArr}
                </Carousel>
            </div>
            );
        });
        retVal = tmpArr;
    }

    return retVal;
};

export default ServicesPage;