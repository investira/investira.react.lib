import { combineReducers as mergeReducers } from 'redux';
import { bindStateToLocalStorage } from '..';

const combineReducersLegacy = (pReducers = {}, pStoreName) => {
    return bindStateToLocalStorage(mergeReducers(pReducers), pStoreName);
};

export default combineReducersLegacy;
