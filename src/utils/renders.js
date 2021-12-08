import classNames from 'classnames';
import { objects, validators, numbers } from 'investira.sdk';

const renders = {
    /**
     * Retorna class sem espaços extras
     *
     * @param {object} pSource Elemento origem
     * @return {object} Copia do elemento
     */
    resolvePropSize(props) {
        const xSizes = ['sm', 'lg'];
        let xClass = classNames({
            [`-${props.size}`]: xSizes.includes(props.size)
        });
        return xClass;
    },

    resolvePropBlock(props) {
        const xClass = classNames({
            [`-block`]: props.block
        });
        return xClass;
    },

    getTimeFromTextLength(pTextLength = 0) {
        if (pTextLength === 0) {
            return 0;
        }
        return (pTextLength / 2) * 200 + 1000;
    },

    /**
     * Calcula o tempo médio de leitura
     * O cálculo é baseado na velocidade média de leitura que cerca de 200 palavras por minuto (ppm)
     *
     * @param {String} pText
     * @returns {Number} Tempo em milesegundos
     */

    avgReadTime(pText = '') {
        if (validators.isEmpty(pText)) {
            return 0;
        }

        const countWords = pText => {
            const xTextCleaned = pText.replace(/\s+/g, ' ').trim();
            return xTextCleaned.split(' ').length;
        };

        const xTime = countWords(pText) / 200;
        const xTimeInSeconds = xTime * 60;

        return numbers.round(xTimeInSeconds * 1000, 0);
    },

    messageDuration(pText = '') {
        return renders.avgReadTime(pText) * 3;
    },

    randomColors: pColors => {
        const xMin = 0;
        const xMax = pColors.length;
        const xIndex = Math.floor(Math.random() * (xMax - xMin)) + xMin;
        return pColors[xIndex];
    },

    /**
     * Copia um elemento para outro.
     *
     * @constructor
     * @param {object} pSource Elemento origem
     * @return {object} Copia do elemento
     */
    setId(component, props) {
        if (objects.getNotEmpty(props.id)) {
            return props.id;
        } else {
            return null;
        }
    },
    //   childrenWithProps(props) {
    //     return React.Children.map(props.children, child =>
    //       React.cloneElement(child, { ...props })
    //     );
    //   }
    getEpicenterLeftTop(e, pCentralized) {
        let xEpicenter = renders.getEpicenter(e, pCentralized);
        return {
            left: -(xEpicenter.radius / 2) + xEpicenter.x,
            top: -(xEpicenter.radius / 2) + xEpicenter.y,
            radius: xEpicenter.radius
        };
    },
    getEpicenter(e, pCentralized) {
        let xEpicenter = {
            x: 0,
            y: 0,
            radius: 0
        };

        if (e.type === 'touchstart') {
            this.ignoringMouseDown = true;
        }
        const element = e.currentTarget;
        const rect = element
            ? element.getBoundingClientRect()
            : {
                  width: 0,
                  height: 0,
                  left: 0,
                  top: 0
              };

        if (
            pCentralized ||
            (e.clientX === 0 && e.clientY === 0) ||
            (!e.clientX && !e.touches)
        ) {
            xEpicenter.x = Math.round(rect.width / 2);
            xEpicenter.y = Math.round(rect.height / 2);
        } else {
            const clientX = e.clientX ? e.clientX : e.touches[0].clientX;
            const clientY = e.clientY ? e.clientY : e.touches[0].clientY;
            xEpicenter.x = Math.round(clientX - rect.left);
            xEpicenter.y = Math.round(clientY - rect.top);
        }

        const xEpicenterX =
            Math.max(
                Math.abs((element ? element.clientWidth : 0) - xEpicenter.x),
                xEpicenter.x
            ) *
                2 +
            2;
        const xEpicenterY =
            Math.max(
                Math.abs((element ? element.clientHeight : 0) - xEpicenter.y),
                xEpicenter.y
            ) *
                2 +
            2;
        xEpicenter.radius = Math.sqrt(xEpicenterX ** 2 + xEpicenterY ** 2);

        return xEpicenter;
    }
};

export default renders;
