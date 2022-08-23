import React from 'react';

const HomePage = () => {
    return (
        <main className="HomePage">
            <div className='homeAnnounce'>
                <h1>Mephisto v1 is here!</h1>
                <p>The realisation of a backend open source abstraction layer which facilitates the interchange of maritime data is finally here. The concept has been brewing for several years, but due to modern web technologies of Node / Express with React, the implementaion of a REST api servicing SARIS and other apllications in a platform agnostic fashion has arrived. Mephisto along with its smaller sibling thog are the most powerful solution available today.</p>
            </div>
        </main >
    );
};

export default HomePage;