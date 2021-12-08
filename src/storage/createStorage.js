import storage from 'redux-persist/lib/storage';

export default function createStorage(pDB) {
    if (pDB) {
        return pDB;
    }

    return storage;
}
