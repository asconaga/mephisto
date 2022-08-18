import { Carousel } from 'antd';
import React, { Component } from 'react';


const HomePage = () => {
    return (
        <main className="Home">
            <div className="block">
                <div className="titleHolder">
                    <h2>Home</h2>
                    <p style={{ marginTop: "1rem" }}>This is the home of the app.</p>
                </div>
                <CarouselComponent />
                <CarouselComponent />
            </div>

        </main >
    );
};
function customPag(i) {
    return <p style={{ userSelect: 'none' }}>{i + 1}</p>;
}

function appendDots(dots) {
    return (
        <div style={{ backgroundColor: "lightgray" }}>
            <ul style={{ color: "black", margin: "3px" }}> {dots} </ul>
        </div>
    );
}
class CarouselComponent extends Component {
    render() {
        const props = {
            dots: true,
            infinite: true,
            slidesToShow: 3,
            slidesToScroll: 1,
            swipeToSlide: true,
            customPaging: customPag,
            appendDots: appendDots,
            // autoplay: true,
            cssEase: "cubic-bezier(0.600, -0.280, 0.735, 0.045)",
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 1
                    }
                }]
        };

        return (
            <div >
                <div className='outerHome'>
                    <Carousel swipeToSlide draggable ref={node => (this.carousel = node)} {...props}>
                        <div className='innerHome'>
                            <h3>1<img src="http://placekitten.com/g/400/200" /></h3>
                        </div>
                        <div className='innerHome'>
                            <h3>2<img src="http://placekitten.com/g/400/200" /></h3>
                        </div>
                        <div className='innerHome'>
                            <h3>3<img src="http://placekitten.com/g/400/200" /></h3>
                        </div>
                        <div className='innerHome'>
                            <h3>4<img src="http://placekitten.com/g/400/200" /></h3>
                        </div>
                    </Carousel>
                </div>
            </div >
        );
    }
}

export default HomePage;
