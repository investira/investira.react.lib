const localStorages = {
    /**
     * Insere um novo item composto de chave e valor no Window​.local​Storage
     *
     * @param {string} pKey Chave
     * @param {string} pValue Valor
     */
    setItem: (pKey, pValue) => {
        try {
            localStorage.setItem(pKey, JSON.stringify(pValue));
        } catch (err) {
            console.error('saveState \t' + err);
        }
    },
    /**
     * Recupera um item armazenado no Window​.local​Storage
     *
     * @param {string} pKey Chave
     */
    getItem: pKey => {
        try {
            const xItemValue = localStorage.getItem(pKey);
            return xItemValue ? JSON.parse(xItemValue) : undefined;
        } catch (err) {
            return undefined;
        }
    },
    /**
     * Remove um item armazenado no Window​.local​Storage
     *
     * @param {string} pKey Chave
     */
    removeItem: pKey => {
        try {
            localStorage.removeItem(pKey);
        } catch (err) {
            return undefined;
        }
    },
    /**
     * Verifica se Window​.local​Storage está disponível
     */
    checkLocalStorageExists: () => {
        const xTestKey = 'test';
        try {
            localStorage.setItem(xTestKey, xTestKey);
            localStorage.removeItem(xTestKey);
            return true;
        } catch (e) {
            return false;
        }
    }
};

module.exports = localStorages;
