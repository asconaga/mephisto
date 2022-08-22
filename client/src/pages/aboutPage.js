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

    let thogImage = new Image();

    let points = [],
        tick = 0,
        bImageLoaded = false,
        stars = null,
        opt = {
            count: 35, // vary this over time
            range: {
                x: 10,
                y: 120
            },
            duration: {
                min: 20,
                max: 120
            },
            thickness: 6,
            strokeColor: 'red',
            level: .35,
            curved: true
        };

    const rand = function (min, max) {
        return Math.floor((Math.random() * (max - min + 1)) + min);
    };

    const ease = function (t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t + b;
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
    };

    const drawStar = (x, y, brightness) => {
        const ctx = ctxRef.current;

        const intensity = brightness * 255;
        const rgb = "rgb(" + intensity + "," + 0 + "," + 0 + ")";

        ctx.beginPath();
        ctx.arc(x, y, brightness * 4, 0, Math.PI * 2, false);
        ctx.fillStyle = rgb;
        ctx.fill();

        // ctx.fillRect(x - 1, y - 1, 3, 3);
    };

    const moveStars = distance => {
        const count = stars.length;
        for (var i = 0; i < count; i++) {
            const s = stars[i];
            s.z -= distance;
            if (s.z <= 1) {
                s.z += 999;
            }
        }
    };

    const paintStars = () => {
        const canvas = canvasRef.current;

        const cw = canvas.width;
        const ch = canvas.height;

        const cx = cw / 2;
        const cy = ch / 2;

        const count = stars.length;
        for (var i = 0; i < count; i++) {
            const star = stars[i];

            const x = cx + star.x / (star.z * 0.001);
            const y = cy + star.y / (star.z * 0.001);

            if (x < 0 || x >= cw || y < 0 || y >= ch) {
                continue;
            }

            const d = star.z / 1000.0;
            const b = 1 - d * d;

            drawStar(x, y, b);
        }
    };

    const makeStars = count => {
        const out = [];
        for (let i = 0; i < count; i++) {
            const s = {
                x: Math.random() * 1600 - 800,
                y: Math.random() * 900 - 450,
                z: Math.random() * 1000
            };
            out.push(s);
        }
        return out;
    };

    const Point = function (config) {
        this.anchorX = config.x;
        this.anchorY = config.y;
        this.x = config.x;
        this.y = config.y;
        this.setTarget();
    };

    Point.prototype.setTarget = function () {
        this.initialX = this.x;
        this.initialY = this.y;
        this.targetX = this.anchorX + rand(0, opt.range.x * 2) - opt.range.x;
        this.targetY = this.anchorY + rand(0, opt.range.y * 2) - opt.range.y;
        this.tick = 0;
        this.duration = rand(opt.duration.min, opt.duration.max);
    };

    Point.prototype.update = function () {
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (Math.abs(dist) <= 0) {
            this.setTarget();
        } else {
            const t = this.tick;
            let b = this.initialY;
            let c = this.targetY - this.initialY;
            let d = this.duration;
            this.y = ease(t, b, c, d);

            b = this.initialX;
            c = this.targetX - this.initialX;
            d = this.duration;
            this.x = ease(t, b, c, d);

            this.tick++;
        }
    };

    Point.prototype.render = () => {
        const ctx = ctxRef.current;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2, false);
        ctx.fillStyle = '#fff';
        ctx.fill();
    };

    const updatePoints = () => {
        let i = points.length;
        while (i--) {
            points[i].update();
        }
    };

    const renderPoints = () => {
        let i = points.length;
        while (i--) {
            points[i].render();
        }
    };

    var renderShape = () => {
        const ctx = ctxRef.current;

        const canvas = canvasRef.current;

        const cw = canvas.width;
        const ch = canvas.height;

        const grd = ctx.createLinearGradient(0, 0, cw, ch);
        grd.addColorStop(0, "crimson");
        grd.addColorStop(0.33, "DarkOrange");
        grd.addColorStop(0.5, "darkRed");
        grd.addColorStop(0.66, "Orange");
        grd.addColorStop(1, "Firebrick");

        ctx.lineJoin = 'round';
        ctx.lineWidth = opt.thickness;
        ctx.strokeStyle = opt.strokeColor;

        ctx.beginPath();
        var pointCount = points.length;
        ctx.moveTo(points[0].x, points[0].y);

        for (let i = 0; i < pointCount - 1; i++) {
            if (opt.curved) {
                const c = (points[i].x + points[i + 1].x) / 2;
                const d = (points[i].y + points[i + 1].y) / 2;

                ctx.quadraticCurveTo(points[i].x, points[i].y, c, d);
            }
            else {
                ctx.lineTo(points[i].x, points[i].y);
            }
        }
        ctx.lineTo(-opt.range.x - opt.thickness, ch + opt.thickness);
        ctx.lineTo(cw + opt.range.x + opt.thickness, ch + opt.thickness);
        ctx.closePath();
        ctx.fillStyle = grd;
        ctx.fill();
        ctx.stroke();
    };

    const init = () => {
        const ctx = ctxRef.current;
        const canvas = canvasRef.current;

        const cw = canvas.width;
        const ch = canvas.height;

        stars = makeStars(2000);

        let i = opt.count + 2;
        const spacing = (cw + (opt.range.x * 2)) / (opt.count - 1);
        while (i--) {
            points.push(new Point({
                x: (spacing * (i - 1)) - opt.range.x,
                y: ch - (ch * opt.level)
            }));
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;

        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        ctxRef.current = canvas.getContext("2d");

        init();

        const intervalId = setInterval(() => {
            draw();
        }, 1000 / 60);

        thogImage.src = "thog.png";

        return () => clearInterval(intervalId);

        // eslint-disable-next-line react-hooks/exhaustive-deps        
    }, []);


    const draw = () => {
        const ctx = ctxRef.current;

        let canvas = canvasRef.current;

        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        //Fill canvas with black color
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = "rgba(0,0,0,0.15)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        moveStars(2);

        paintStars();

        const tw = thogImage.width / 1000 * tick;
        const th = thogImage.height / 1000 * tick;

        if (++tick > 1500)
            tick = 0;
        updatePoints();
        renderShape();

        if (!opt.curved) {
            renderPoints();
        }

        ctx.globalAlpha = (tick < 1200) ? (tick / 1200) : (1500 - tick) / 300;
        ctx.drawImage(thogImage, canvas.width / 2 - tw / 2, canvas.height / 2 - th / 2, tw, th);
        ctx.globalAlpha = 1;
    };

    return (
        <canvas className="AppCanvas"
            tabIndex="0"
            id="canvas"
            ref={canvasRef}
        ></canvas>
    );
};

export default AboutPage;




