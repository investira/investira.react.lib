import React from 'react';
import { validators } from 'investira.sdk';

const displays = {
    format: (pMask, pValue) => {
        //const xValue = pValue;

        if (validators.isNull(pMask)) {
            return;
        }

        if (validators.isNull(pValue)) {
            return '';
        }

        for (let xI = 0; xI <= pValue.length; xI++) {
            pMask = pMask.replace('#', pValue.charAt(xI));
        }
        return pMask;
    },
    formatDinamic: (pMask, pValue) => {
        if (validators.isNull(pValue)) {
            return '';
        }

        const xFirstMaskElem = pMask[0];
        const xLastMaskElem = pMask[pMask.length - 1];
        const xFirsMaksSize = xFirstMaskElem.match(/#/g).length;
        const xLastMaskSize = xLastMaskElem.match(/#/g).length;

        let xValue = pValue;

        if (xValue.length < xFirsMaksSize) {
            return xValue;
        }

        if (xValue.length > xLastMaskSize) {
            xValue = xValue.slice(0, xLastMaskSize);
        }

        const xMasks = {};

        pMask.forEach(xMask => {
            const xKey = xMask.match(/#/g).length;
            xMasks[xKey] = xMask;
        });

        return displays.format(xMasks[xValue.length], xValue) || '';
    },
    cnpj: pValue => {
        if (validators.isNull(pValue)) {
            return '';
        }
        return displays.format('##.###.###/####-##', pValue);
    },
    cpf: (pValue = '') => {
        if (validators.isNull(pValue)) {
            return '';
        }

        let xValue = pValue;

        if (xValue.length < 4) {
            return xValue;
        }

        if (xValue.length > 11) {
            xValue = xValue.slice(0, 11);
        }

        const xMasks = {
            3: '###',
            4: '###.#',
            5: '###.##',
            6: '###.###',
            7: '###.###.#',
            8: '###.###.##',
            9: '###.###.###',
            10: '###.###.###.#',
            11: '###.###.###-##'
        };

        return displays.format(xMasks[xValue.length], pValue) || '';
    },
    cep: pValue => {
        if (validators.isNull(pValue)) {
            return '';
        }
        return displays.format('#####-###', pValue);
    },
    agencia: (pValue = '') => {
        if (validators.isNull(pValue)) {
            return '';
        }

        let xValue = pValue;

        if (xValue.length < 4) {
            return xValue;
        }

        if (xValue.length > 6) {
            xValue = xValue.slice(0, 6);
        }

        const xMasks = { 4: '####', 5: '####-#', 6: '####-##' };
        return displays.format(xMasks[xValue.length], xValue) || '';
    },
    conta: (pValue = '') => {
        if (validators.isNull(pValue)) {
            return '';
        }

        let xValue = pValue;

        if (xValue.length < 6) {
            return xValue;
        }

        if (xValue.length > 12) {
            xValue = xValue.slice(0, 12);
        }

        const xMasks = {
            6: '#####-#',
            7: '######-#',
            8: '#######-#',
            9: '########-#',
            10: '#########-#',
            11: '##########-#',
            12: '###########-#'
        };

        return displays.format(xMasks[xValue.length], xValue) || '';
    },
    initialsLetters: (pStrings, pSize = 2) => {
        if (!pStrings) {
            return '';
        }

        const xSize = pSize <= 0 ? 0 : pSize - 1;
        const xArray = pStrings.split(' ');

        return Object.values(xArray)
            .map((xString, xIndex) => {
                if (xString !== null && xIndex <= xSize && xString !== 'null') {
                    return xString.charAt(0).toUpperCase();
                } else {
                    return null;
                }
            })
            .join('');
    },
    highlightSearch: (pPesquisa, pText) => {
        if (pPesquisa && pText) {
            // Separa os termos da pesquisa
            let xTerms = pPesquisa.split(new RegExp(/\s|,|;/, 'gi'));

            xTerms = xTerms
                .filter(xTerm => xTerm)
                .map(xTerm => xTerm.toLowerCase()); //Remove vazios e normaliza para lowercase;

            const xPesquisa = xTerms.join('|');
            const xRegex = new RegExp(`(${xPesquisa})`, 'gi');
            const xParts = pText.split(xRegex);

            if (validators.isEmpty(xParts)) {
                return pText;
            }

            return xParts.map((xPart, xIndex) => {
                const isPesquisa = xTerms.includes(xPart.toLowerCase());

                return (
                    <span
                        key={xIndex}
                        style={
                            isPesquisa
                                ? { fontWeight: 'bold', color: '#64ffda' }
                                : {}
                        }>
                        {xPart}
                    </span>
                );
            });
        }

        return pText;
    }
};

export default displays;
