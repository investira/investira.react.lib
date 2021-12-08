import { openDB } from 'idb';

export default function createIdbStorage(pDefinedOptions = {}) {
    const options = {
        name: 'keyval-store', // Nome do banco de dados
        storeName: 'keyval', // Nome da store
        version: 1,
        upgradeCallback: upgradeDb =>
            upgradeDb.createObjectStore(options.storeName),
        ...pDefinedOptions
    };

    const dbPromise = openDB(options.name, options.version, {
        upgrade: options.upgradeCallback
    });

    return {
        async getItem(pKey) {
            const xDb = await dbPromise;
            const xTrans = xDb.transaction(options.storeName);

            return xTrans.objectStore(options.storeName).get(pKey);
        },

        async setItem(pKey, pItem) {
            const xDb = await dbPromise;
            const xTrans = xDb.transaction(options.storeName, 'readwrite');

            xTrans.objectStore(options.storeName).put(pItem, pKey);

            return xTrans.complete;
        },

        async removeItem(pKey) {
            const xDb = await dbPromise;
            const xTrans = xDb.transaction(options.storeName, 'readwrite');

            xTrans.objectStore(options.storeName).delete(pKey);
        },

        async getAllKeys() {
            const xDb = await dbPromise;
            const xTrans = xDb.transaction(options.storeName);

            return xTrans.objectStore(options.storeName).getAllKeys();
        },

        async getAll() {
            const xDb = await dbPromise;
            const xTrans = xDb.transaction(options.storeName, 'readwrite');

            return xTrans.objectStore(options.storeName).getAll();
        },

        async clear() {
            const xDb = await dbPromise;
            const xTrans = xDb.transaction(options.storeName, 'readwrite');

            xTrans.objectStore(options.storeName).clear();

            return xTrans.complete;
        }
    };
}
