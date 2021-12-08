import { createStore as newStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

//Ativa plugin REDUX no Chrome
const devTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();

//Cria store; define reducer e Redux extension
const createStore = pAppReducer => applyMiddleware(thunk)(newStore)(pAppReducer, devTools);

export default createStore;
