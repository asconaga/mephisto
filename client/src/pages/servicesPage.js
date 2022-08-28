import { Button, Carousel, Col, message, Row, Slider } from 'antd';
import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaFrown } from 'react-icons/fa';
import { PollContext, PollUpdateContext } from '../App';

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
    const hasPolled = useContext(PollContext);
    const setPolled = useContext(PollUpdateContext);

    const itemsRef = useRef([]);
    const navigate = useNavigate();

    const info = (msg, status) => {
        if (status)
            message.success(msg);
        else
            message.error(msg);
    };

    // YAKUBU: Can we extract some of these functions out of the effectFunction
    const effectFunction = () => {
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
            setPolled(false);

            await fetch(API_URL, request)
                .then(reqCallback)
                .catch(function (error) {
                    console.log('Request failed', error);
                });
        };

        console.log(hasPolled + " services UseEffect");

        (async () => await doFetchItems())();
    };

    // YAKUBU: check we are not leaking memory here and if we need a return
    useEffect(() => {
        // if mounted and hasPolled hasn't been set 
        if (!hasPolled) {
            effectFunction();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps           
    }, []);

    useEffect(() => {
        // if hasPolled has changed and is true
        if (hasPolled) {
            effectFunction();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps           
    }, [hasPolled]);

    return (
        <div className="ServicesPage">
            {getContent(fetchItems, carouselState, setCarouselState, itemsRef, navigate)}
        </div>
    );
};

const getContent = (serviceArr, carouselState, setCarouselState, itemsRef, navigate) => {
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

        const generateKey = () => {
            return (Math.random() + Date.now());
        };

        const onChangeMethod = (index) => {
            const cloneService = { ...carouselState };

            cloneService.method = index;

            setCarouselState(cloneService);
        };

        const showPostDetails = (e, key) => {
            const serviceName = serviceArr[carouselState.service].name;
            const methodName = serviceArr[carouselState.service]?.methods[carouselState.method].name;

            const queryString = `/post/${key}?service=${serviceName}&method=${methodName}`;

            navigate(queryString);
        };

        const onChange = (val, index) => {
            console.log(val, index, itemsRef.current[index]);

            itemsRef.current[index].goTo(val);
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
                    <div key={generateKey()}>
                        <div className="innerContent">
                            <div className="innerImage">
                                {service?.image ?? <FaCheckCircle />}
                            </div>
                            <div className="innerText">
                                <h1>{service.name}</h1>
                                <p>{service.description}</p>

                                {(() => {
                                    if ((index === 2) && (!service?.image)) {
                                        return <Button onClick={e => showPostDetails(e, service.key)} type="primary">See Incident Detail</Button>;
                                    }
                                })()}
                            </div>
                        </div>
                    </div>
                );
            });

            tmpArr.push(<div key={index} className={(index !== 2) ? "content" : "posts"}>
                <h2>{elemArr.title}</h2>
                <Carousel ref={el => itemsRef.current[index] = el} arrows={false}
                    dots={false}
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
                    cssEase="cubic-bezier(0.600, -0.280, 0.735, 0.045)"
                    afterChange={arrChangers[index]}>
                    {tmpConArr}
                </Carousel>
                <div className="servicesSlider">
                    <Slider min={0} max={tmpConArr.length - 1} disabled={tmpConArr.length == 1} onChange={e => onChange(e, index)} />
                </div>
            </div>
            );
        });
        retVal = tmpArr;
    }

    return retVal;
};

export default ServicesPage;