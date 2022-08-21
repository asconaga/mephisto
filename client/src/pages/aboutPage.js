import React, { useRef, useEffect } from 'react';

const AboutPage = () => {
    return (
        <main className="About">
            <div className="block">
                <div className="titleHolder">
                    <h2>About Page</h2>
                    <AppCanvas />
                </div>
            </div>
        </main >
    );
};

const AppCanvas = () => {
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    let hue = 0;
    let xPos = 0;
    let yPos = 0;
    let angle = 90;
    let drawMethod = 0;

    let circles = [];

    //Random Circles creator
    class create {
        constructor(x, y) {
            this.x = x;
            this.y = y;

            //Random radius between 12 and 15
            this.radius = 12 + Math.random() * 3;

            //Random velocities
            this.vx = -5 + Math.random() * 10;
            this.vy = -5 + Math.random() * 10;

            this.fillStyle = `HSLA(${hue}, 100%, 50%, 0.5)`;

            this.angle = angle;

            if (++hue > 255) {
                hue = 0;
            }

            if (++angle > 360) {
                angle = 0;
            }
        }
    }

    const init = (x, y) => {
        for (var i = 0; i < 1000; i++) {
            circles.push(new create(x, y));
        }
    };

    const doFunction = (evt) => {
        drawMethod = evt.key - "0";
    };

    const explode = () => {
        circles = [];
        init(xPos, yPos);
    };

    const defaultPos = () => {
        let canvas = canvasRef.current;
        xPos = canvas.width / 2;
        yPos = canvas.height / 2;
    };

    useEffect(() => {
        let canvas = canvasRef.current;

        console.log(canvas.offsetWidth);

        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        ctxRef.current = canvas.getContext("2d");

        init(canvas.width / 2, canvas.height / 2);
        defaultPos();

        const intervalId = setInterval(() => {
            draw();
        }, 1000 / 60);

        return () => clearInterval(intervalId);

        // eslint-disable-next-line react-hooks/exhaustive-deps        
    }, []);

    const setPos = (evt) => {
        xPos = evt.clientX - evt.target.offsetLeft;
        yPos = evt.clientY - evt.target.offsetTop;
    };

    const draw = () => {
        const ctx = ctxRef.current;

        let canvas = canvasRef.current;

        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = "rgba(0,0,0,0.15)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        //Fill canvas with black color
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = "rgba(0,0,0,0.15)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        //Fill the canvas with circles
        for (var j = 0; j < circles.length; j++) {
            let c = circles[j];

            //Create the circles
            ctx.beginPath();
            ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2, false);
            ctx.fillStyle = c.fillStyle;
            ctx.fill();

            const rangle = (c.angle * Math.PI) / 180;

            switch (drawMethod) {
                case 0:
                    c.x += c.vx;
                    c.y += c.vy;
                    c.radius -= 0.25;
                    break;
                case 1:
                    c.x += c.vx * Math.cos(rangle);
                    c.y += c.vy * Math.sin(rangle);
                    c.radius -= 0.25;
                    c.angle += 1;
                    break;
                case 2:
                    c.x += c.vx * Math.cos(rangle);
                    c.y += c.vy * Math.sin(rangle);
                    c.radius -= 0.5;
                    c.angle += 10;
                    break;
                case 3:
                    c.x += (c.vx / 8) + rangle * 0.2 * Math.cos(rangle);
                    c.y += (c.vy / 8) + rangle * 0.2 * Math.sin(rangle);
                    c.radius -= 0.04;
                    c.angle += 1;
                    break;
            }

            if (c.radius < 0) circles[j] = new create(xPos, yPos);
        }
    };

    return (
        <canvas className="AppCanvas"
            tabIndex="0"
            id="canvas"
            ref={canvasRef}
            onMouseLeave={defaultPos}
            onMouseMove={setPos}
            onMouseDown={explode}
            onKeyDown={doFunction}
        ></canvas>
    );
};

export default AboutPage;




