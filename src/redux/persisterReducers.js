import { persistReducer } from 'redux-persist';
import createStorage from '../storage/createStorage';

const persisterReducers = (pReducers, pPrefix, pStorage) => {
    const xEntries = Object.entries(pReducers);
    const xStorage = createStorage(pStorage);

    const xReducers = xEntries.map(xEntry => {
        let xAttributes = {
            key: `${pPrefix}-${xEntry[0]}`,
            storage: xStorage,
            timeout: 0
        };
        if (xEntry[1][1]) {
            xAttributes.blacklist = xEntry[1][1];
        }

        return [xEntry[0], persistReducer(xAttributes, xEntry[1][0])];
    });

    return Object.fromEntries(xReducers);
};

export default persisterReducers;
