const currency = {
    currencyToNumber: (pValue, pSeparator = '.', pDecimal) => {
        const xDigits = currency.getDigitsFromValue(pValue);
        const xDigitsWithPadding = currency.padDigits(xDigits, pDecimal);

        let xValue = currency.addDecimalToNumber(
            xDigitsWithPadding,
            pSeparator,
            pDecimal
        );
        return xValue;
    },

    getDigitsFromValue: (pValue = '') => {
        return pValue.replace(/(-(?!\d))|[^0-9|-]/g, '') || '';
    },

    padDigits: (pDigits, pDecimal) => {
        const xDesiredLength = pDecimal + 1; //3
        const xActualLength = pDigits.length;

        if (xActualLength >= xDesiredLength) {
            return pDigits;
        }

        const xAmountToAdd = xDesiredLength - xActualLength;

        const xPadding = '0'.repeat(xAmountToAdd);

        return xPadding + pDigits;
    },

    removeLeadingZeros: pNumber => {
        return pNumber.replace(/^0+([0-9]+)/, '$1');
    },

    addDecimalToNumber: (pNumber, pSeparator, pDecimal) => {
        const xDecimalStartingPosition = pNumber.length - pDecimal;
        const xThousands = currency.removeLeadingZeros(
            pNumber.substring(0, xDecimalStartingPosition)
        );

        const xDecimal = pNumber.substring(xDecimalStartingPosition);

        return xThousands + pSeparator + xDecimal;
    },

    toCurrency: (
        pValue,
        pSeparator = '.',
        pCurrency = 'BRL',
        pLocale = 'pt-BR',
        pDecimal
    ) => {
        let xValue = currency.currencyToNumber(pValue, pSeparator, pDecimal);

        xValue = parseFloat(xValue).toLocaleString(pLocale, {
            style: 'currency',
            currency: pCurrency,
            currencyDisplay: 'code',
            minimumFractionDigits: pDecimal
        });

        return xValue.replace(/[a-z]{3}/i, '').trim();
    }
};

//module.exports = currency;

export default currency;
