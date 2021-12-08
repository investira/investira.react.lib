const browsers = {
    getBrowserVersion: (pRegex, rGroup) => {
        const xUserAgent = navigator.userAgent.match(pRegex);

        return xUserAgent ? xUserAgent[rGroup] : null;
    },
    /**
     * Retorna a versão do Chorme/Chormium.
     *
     * @constructor
     * @return {boolean}
     */
    getNavigatorVersion: () => {
        console.log(navigator.userAgent);
        //navigator.userAgent.match(/Chrom[e|ium]\/([0-9]+)\./)[2]

        let xUserAgent = {
            chrome: browsers.getBrowserVersion(/Chrom[e|ium]\/([0-9]+)\./, 1),
            firefox: browsers.getBrowserVersion(/Firefox\/([0-9]+)\./, 1),
            //edge: null,
            safari: browsers.getBrowserVersion(/Safari\/([0-9]+)\./, 1)
        };
        console.log(xUserAgent);
        //return xAgentRaw ? parseInt(xAgentRaw[2], 10) : false;
        return false;
    },
    /**
     * Verifica se o navegador está no modo online ou offline.
     *
     * @return {boolean}
     */
    isOnline: () => {
        const xConection = navigator.onLine ? true : false;
        return xConection;
    },
    /**
     * Retorna se é IOS
     *
     * @returns {boolean}
     */
    isIOS: () => {
        const xNav = navigator.userAgent.toLowerCase();

        return Boolean(
            xNav.match(/iphone/i) || xNav.match(/ipod/i) || xNav.match(/ipad/i)
        );
    },

    /**
     * Retorna se é android
     *
     * @returns {boolean}
     */
    isAndroid: () => {
        const xNav = navigator.userAgent.toLowerCase();
        return xNav.match(/android/i);
    },

    /**
     * Retorna se é BlackBerry
     *
     * @returns {boolean}
     */
    isBlackBerry: () => {
        const xNav = navigator.userAgent.toLowerCase();
        return xNav.match(/blackberry/i) || xNav.match(/bb/i);
    },

    /**
     * Retorna se é Kindle
     *
     * @returns {boolean}
     */
    isKindle: () => {
        const xNav = navigator.userAgent.toLowerCase();
        return xNav.match(/kindle/i) || xNav.match(/kf/i);
    },

    /**
     * Retorna se é equipamento móvel
     *
     * @returns {boolean}
     */
    isMobile: () => {
        return (
            browsers.isIOS() ||
            browsers.isBlackBerry() ||
            browsers.isKindle() ||
            browsers.isAndroid()
        );
    },

    /**
     * Retorna se é safari
     *
     * @returns {boolean}
     */
    isSafari: () => {
        const xNav = navigator.userAgent.toLowerCase();
        return /safari/.test(xNav);
    },

    /**
     * Retorna se é chorme
     *
     * @returns {boolean}
     */
    isChrome: () => {
        const xNav = navigator.userAgent.toLowerCase();
        return /chrome/.test(xNav);
    },

    isWebView: () => {
        const xNav = navigator.userAgent.toLowerCase();
        let xIsWebView = false;

        if (browsers.isIOS()) {
            if (browsers.isSafari()) {
                xIsWebView = false;
            } else {
                xIsWebView = true;
            }
        }

        if (browsers.isAndroid()) {
            if (/wv/.test(xNav)) {
                xIsWebView = true;
            }
        }

        return xIsWebView;
    }
};

export default browsers;
