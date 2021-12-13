import { combineReducers as mergeReducers } from 'redux';
import bindStateToLocalStorage from '../middleware/bindStateToLocalStorage';

const combineReducersLegacy = (pReducers = {}, pStoreName) => {
    return bindStateToLocalStorage(mergeReducers(pReducers), pStoreName);
};

export default combineReducersLegacy;
