import PouchDBStorage from 'redux-persist-pouchdb';

const pouchStorage = (pDBName, pOptions) =>
    new PouchDBStorage(pDBName, { ...pOptions });

export default pouchStorage;
