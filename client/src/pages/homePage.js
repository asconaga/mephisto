import { Carousel } from 'antd';
import React, { Component } from 'react';


const HomePage = () => {
    return (
        <main className="Home">
            <h2>Home</h2>
            <p style={{ marginTop: "1rem" }}>This is the home of the app.</p>
            <CarouselComponent />

            <CarouselComponent />
        </main>
    );
};

class CarouselComponent extends Component {
    render() {
        const props = {
            dots: false,
            infinite: true,
            slidesToShow: 3,
            slidesToScroll: 1,
            swipeToSlide: true,
            cssEase: "linear"
        };
        return (
            <div className='finger'>
                <Carousel arrows swipeToSlide draggable ref={node => (this.carousel = node)} {...props}>
                    <div>
                        <h3>1<img src="http://placekitten.com/g/400/200" /></h3>
                    </div>
                    <div>
                        <h3>2<img src="http://placekitten.com/g/400/200" /></h3>
                    </div>
                    <div>
                        <h3>3<img src="http://placekitten.com/g/400/200" /></h3>
                    </div>
                    <div>
                        <h3>4<img src="http://placekitten.com/g/400/200" /></h3>
                    </div>
                </Carousel>

            </div>
        );
    }
}

export default HomePage;
