import browsers from './browsers';

const vibrate = {
    /**
     * Inicia a vibração.
     * @param {number | Array} pPattern
     */
    startVibrate: (pPattern = 1) => {
        browsers.isAndroid() && window.navigator.vibrate(pPattern);
    },
    /**
     * Parar a vibração.
     */
    stopVibrate: () => {
        browsers.isAndroid() && window.navigator.vibrate(0);
    }
};

export default vibrate;
