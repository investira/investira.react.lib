import { combineReducers as mergeReducers } from 'redux';
import persisterReducers from './persisterReducers';

const combineReducers = (pReducers = {}, pStoreName, pStorage) => {
    let xReducers = pReducers;

    if (pStoreName) {
        xReducers = persisterReducers(xReducers, pStoreName, pStorage);
    }

    return mergeReducers(xReducers);
};

export default combineReducers;
