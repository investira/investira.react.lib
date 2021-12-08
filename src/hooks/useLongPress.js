import { useCallback, useRef, useState, useEffect } from 'react';
import { validators } from 'investira.sdk';

const useLongPress = (
    onLongPress,
    onClick,
    { shouldPreventDefault = true, delay = 300, listenElemOnScroll = null } = {}
) => {
    const [longPressTriggered, setLongPressTriggered] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);

    const timeout = useRef(null);
    const scrolling = useRef(null);
    const target = useRef();
    const scrollElemId = useRef(listenElemOnScroll);
    const scrollElem = useRef(null);

    useEffect(() => {
        const xElemId = scrollElemId.current;
        if (
            validators.isNull(scrollElem.current) &&
            !validators.isNull(xElemId)
        ) {
            const xScroll =
                document.getElementById(xElemId) ||
                document.getElementsByClassName(xElemId)[0];

            scrollElem.current = xScroll;

            xScroll.addEventListener(
                'scroll',
                e => {
                    timeout.current && clearTimeout(timeout.current);
                },
                {
                    passive: false
                }
            );
        }
    }, []);

    const start = useCallback(
        pEvent => {
            if (shouldPreventDefault && pEvent.target) {
                pEvent.target.addEventListener('touchend', preventDefault, {
                    passive: false
                });

                target.current = pEvent.target;
            }

            timeout.current = setTimeout(() => {
                onLongPress(pEvent);
                setLongPressTriggered(true);
            }, delay);
        },
        [onLongPress, delay, shouldPreventDefault]
    );

    const clear = useCallback(
        (pEvent, pShouldTriggerClick = true) => {
            timeout.current && clearTimeout(timeout.current);

            if (pShouldTriggerClick && !longPressTriggered && onClick) {
                !isScrolling && onClick(pEvent);
                setIsScrolling(false);
            }

            // pShouldTriggerClick &&
            //     !longPressTriggered &&
            //     onClick &&
            //     onClick(pEvent);

            setLongPressTriggered(false);

            if (shouldPreventDefault && target.current) {
                target.current.removeEventListener('touchend', preventDefault);
            }
        },
        [shouldPreventDefault, onClick, longPressTriggered, isScrolling]
    );

    const move = e => {
        scrolling.current && clearTimeout(scrolling.current);
        setIsScrolling(true);

        scrolling.current = setTimeout(() => {
            setIsScrolling(false);
        }, 300);
    };

    return {
        onMouseDown: pEvent => start(pEvent),
        onTouchStart: pEvent => start(pEvent),
        onMouseUp: pEvent => clear(pEvent),
        onMouseLeave: pEvent => clear(pEvent, false),
        onTouchMove: move,
        onTouchEnd: pEvent => clear(pEvent)
    };
};

const isTouchEvent = pEvent => {
    return 'touches' in pEvent;
};

const preventDefault = (pEvent, pAction) => {
    if (!pEvent.cancelable) {
        return;
    }

    if (!isTouchEvent(pEvent)) return;

    if (pEvent.touches.length < 2 && pEvent.preventDefault) {
        pEvent.preventDefault();
    }
};

export default useLongPress;
