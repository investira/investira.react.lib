const lists = {
    mergeList: (pList, pItem, pKey) => {
        const xKey = `_${pItem[pKey]}`;
        let xList = { ...pList };
        const xItem = { ...pItem };

        if (Object.keys(xList).includes(xKey)) {
            xList = { ...xList, [xKey]: xItem };
        } else {
            xList = { [xKey]: xItem, ...xList };
        }

        return xList;
    },
    removeItem: (pList, pItem, pKey) => {
        const xKey = `_${pItem[pKey]}`;
        let xList = { ...pList };

        delete xList[xKey];

        return xList;
    }
};

export default lists;
