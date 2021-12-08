const { lerp } = require('investira.sdk').numbers;

/**
 *
 *
 * @param {object} pElement
 * @param {object} pOptions
 * - speed: Velocidade do scroll. 0-4
 * - duration: Duração do scroll até acabar. 0-4
 * - directions: direção do scroll. 1 - Horizontal, 2 - Vertical, 3 - Ambos
 * @returns
 */

const momentumScroll = (pElement, pOptions) => {
    let xControl = Object.assign(
        {},
        { options: { speed: 2, duration: 2, directions: 3, ...pOptions } }
    );

    xControl.isHorizontal = xControl.options.directions & 1;
    xControl.isVertical = xControl.options.directions & 2;
    xControl.options.speed = Math.max(Math.min(xControl.options.speed, 4), 0);
    xControl.options.duration =
        ((5 - Math.max(Math.min(xControl.options.duration, 4), 0)) * 2) / 100;
    xControl.options.bounce = Math.max(Math.min(xControl.options.bounce, 4), 0);

    pElement.style.webkitOverflowScrolling = 'auto';
    pElement.style.overflowX = xControl.isHorizontal ? 'scroll' : 'hidden';
    pElement.style.overflowY = xControl.isVertical ? 'scroll' : 'hidden';

    const mount = () => {
        resetControl();
        pElement.addEventListener('touchstart', onTouchStart);
        pElement.addEventListener('touchmove', onTouchMove);
        pElement.addEventListener('touchend', onTouchEnd);
    };
    const unmount = () => {
        pElement.removeEventListener('touchstart', onTouchStart);
        pElement.removeEventListener('touchmove', onTouchMove);
        pElement.removeEventListener('touchend', onTouchEnd);
        resetControl();
    };

    const onTouchStart = e => {
        startScroll(e);
    };

    const onTouchMove = e => {
        doScrollMove(e);
        e.preventDefault();
    };

    const onTouchEnd = e => {
        endScroll(e);
    };

    const startScroll = e => {
        resetControl();
        saveLastPosition(e.touches[0]);
        xControl.startTime = Date.now();
    };

    const endScroll = e => {
        saveLastPosition(e.changedTouches[0]);
        startScrollMomentum();
    };

    const doScrollMove = e => {
        stopScrollMomentum();
        if (xControl.isVertical) {
            pElement.scrollTop = calcDirections(
                xControl.y,
                e.touches[0].clientY,
                pElement.scrollTop,
                pElement.scrollHeight,
                pElement.clientHeight
            );
        }
        if (xControl.isHorizontal) {
            pElement.scrollLeft = calcDirections(
                xControl.x,
                e.touches[0].clientX,
                pElement.scrollLeft,
                pElement.scrollWidth,
                pElement.clientWidth
            );
        }
        saveLastPosition(e.touches[0]);
    };

    const calcDirections = (
        pAxis,
        pClient,
        pScroll,
        pScrollSize,
        pClientSize
    ) => {
        let xScroll = 0;
        let xDelta = pAxis.client - pClient;
        let xMaxScroll = pScrollSize - pClientSize;
        let xNewScroll = pScroll + xDelta;
        pAxis.scrollMomentum = -1;
        pAxis.speed = xDelta / (Date.now() - xControl.startTime);
        if (xNewScroll < 0) {
            xDelta = -pScroll;
        } else if (xNewScroll > xMaxScroll) {
            xDelta = -(pScroll - xMaxScroll);
        } else {
            pAxis.scrollMomentum = pScrollSize * pAxis.speed;
            xNewScroll = pScroll + xDelta + pAxis.scrollMomentum;
            if (xNewScroll < 0) {
                pAxis.scrollMomentum = -(pScroll - xDelta);
            } else if (xNewScroll > xMaxScroll) {
                pAxis.scrollMomentum = xMaxScroll - pScroll - xDelta;
            }
            pAxis.scrollMomentum = Math.round(
                pAxis.scrollMomentum * xControl.options.speed
            );
        }
        xScroll = pScroll + xDelta;
        pAxis.scrollMomentum += xScroll;

        return xScroll;
    };

    const startScrollMomentum = () => {
        let xAnimate = false;
        if (xControl.isHorizontal) {
            if (
                xControl.x.scrollMomentum != -1 &&
                pElement.scrollLeft != 0 &&
                pElement.scrollLeft !=
                    pElement.scrollWidth - pElement.clientWidth &&
                Math.round(xControl.x.scrollMomentum) !=
                    Math.round(pElement.scrollLeft)
            ) {
                pElement.scrollLeft = lerp(
                    pElement.scrollLeft,
                    xControl.x.scrollMomentum,
                    xControl.options.duration
                );
                xAnimate = true;
            }
        }
        if (xControl.isVertical) {
            if (
                xControl.y.scrollMomentum != -1 &&
                pElement.scrollTop != 0 &&
                pElement.scrollTop !=
                    pElement.scrollHeight - pElement.clientHeight &&
                Math.round(xControl.y.scrollMomentum) !=
                    Math.round(pElement.scrollTop)
            ) {
                pElement.scrollTop = lerp(
                    pElement.scrollTop,
                    xControl.y.scrollMomentum,
                    xControl.options.duration
                );
                xAnimate = true;
            }
        }
        if (xAnimate) {
            xControl.af = window.requestAnimationFrame(startScrollMomentum);
        } else {
            resetControl();
        }
    };

    const stopScrollMomentum = () => {
        cancelAnimationFrame(xControl.af);
    };

    const resetControl = () => {
        stopScrollMomentum();
        const xAxis = {
            speed: 0,
            client: 0,
            deltaMom: 0,
            scrollMomentum: -1
        };
        xControl = Object.assign(xControl, {
            af: 0,
            startTime: 0,
            x: Object.assign({}, xAxis),
            y: Object.assign({}, xAxis)
        });
    };

    const saveLastPosition = e => {
        xControl.x.client = e.clientX;
        xControl.y.client = e.clientY;
    };

    return { mount, unmount };
};

module.exports = momentumScroll;
