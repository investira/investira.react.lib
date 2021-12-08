import { objects, validators } from 'investira.sdk';

const localStorages = require('../utils/localStorages');

const bindStateToLocalStorage = {
    /**
     * Remove do objeto json os atributos que inicial om '_'.
     * Atributos com nome iniciados com '_' não serão restaurados do localstore
     * @constructor
     * @param {object} pSource Elemento origem
     * @return {object} Copia do elemento
     */
    removeTemporaryAttr: obj => {
        // Handle the 3 simple types, and null or undefined
        if (obj == null || typeof obj != 'object') return obj;

        // Handle Date
        if (obj instanceof Date) {
            let copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }

        // Handle Array
        if (obj instanceof Array) {
            let copy = [];
            for (let i = 0, len = obj.length; i < len; i++) {
                copy[i] = bindStateToLocalStorage.removeTemporaryAttr(obj[i]);
            }
            return copy;
        }

        // Handle Object
        if (obj instanceof Object) {
            let copy = {};
            for (let attr in obj) {
                if (obj.hasOwnProperty(attr))
                    if (!attr.startsWith('_')) {
                        copy[
                            attr
                        ] = bindStateToLocalStorage.removeTemporaryAttr(
                            obj[attr]
                        );
                    }
            }
            return copy;
        }

        throw new Error("Unable to copy obj! Its type isn't supported.");
    },

    removeLocalStoreStates: obj => {
        // Handle the 3 simple types, and null or undefined
        if (obj == null || typeof obj != 'object') return obj;

        // Handle Object
        if (obj instanceof Object) {
            let copy = {};
            for (let attr in obj) {
                if (obj[attr] != null && typeof obj[attr] == 'object') {
                    let xCopy = bindStateToLocalStorage.removeLocalStoreStates(
                        obj[attr]
                    );
                    if (Object.keys(xCopy).length > 0) {
                        copy[attr] = xCopy;
                    }
                } else if (!attr.startsWith('__') && attr.startsWith('_')) {
                    // console.log(attr);
                    copy[attr] = obj[attr];
                }
            }
            return copy;
        }
    },

    /**
     * Salva state no localStorage sempre que um action é disparado
     * e restaura o state a partir do localStorage no inicio da aplicação ou quando recebe o action "RESET_STATE"
     * @param {*} reducer
     */
    bind: reducer => (state, action) => {
        //console.log(action, state);
        //const { app, auth, message, server, ...investiraUser } = state;
        let xDefaultState = {};
        let xInit = action.type.match(/@@redux\/INIT/g) ? true : false;

        // Separa dados pertecentes a app e dados do usuário

        if (
            action.type === '@@INIT' ||
            xInit ||
            action.type === 'RESET_STATE'
        ) {
            //Inicializa state a partir do reducer
            xDefaultState = reducer({}, action);
            //Le localStorage e exclui atributos temporários (iniciados com "_")
            // const xLocalState =
            //     bindStateToLocalStorage.removeTemporaryAttr(
            //         localStorages.getItem('investiraState')
            //     ) || {};
            const xLocalState = localStorages.getItem('investiraState') || {};
            let xNewState = objects.deepMerge(xDefaultState, xLocalState);
            xDefaultState = xNewState;
        } else {
            //Processa o reducer
            xDefaultState = reducer(state, action);
            //Salva estado atual do localStorage
            localStorages.setItem('investiraState', xDefaultState);
        }
        return xDefaultState;
    },

    bindListener: (reducer, pLocalItemPrefix) => (pState, pAction) => {
        let xUserId = null;
        let xDefaultState = {};
        let xInit = pAction.type.match(/@@redux\/INIT/g) ? true : false;

        const localApp = pLocalItemPrefix + 'App';
        const localUser = pLocalItemPrefix + 'User';

        if (
            pAction.type === '@@INIT' ||
            xInit ||
            pAction.type === 'RESET_STATE'
        ) {
            // Inicializa state a partir do reducer
            xDefaultState = reducer({}, pAction);

            // Recupera do local somente os dados referentes a app:
            // app, auth, message, server
            const xLocalStateApp = localStorages.getItem(localApp) || {};

            const xNewState = objects.deepMerge(xDefaultState, xLocalStateApp);
            xDefaultState = xNewState;
        } else if (
            pAction.type === 'USER_LOADED' ||
            pAction.type === 'APP_CONNECTION_CHANGED'
        ) {
            xDefaultState = reducer(pState, pAction);
            xUserId = xDefaultState.user.usuario_id;

            const xLocalStateUser = localStorages.getItem(localUser) || {};

            const xLocalState = {
                ...(xUserId && {
                    ...xLocalStateUser[xUserId]
                })
            };

            let xNewState = objects.deepMerge(xDefaultState, xLocalState);

            xDefaultState = xNewState;
        } else {
            //Processa o reducer
            xDefaultState = reducer(pState, pAction);
            xUserId = xDefaultState.user.usuario_id;

            let xInvestiraApp = {};
            let xInvestiraUser = {};

            if (!validators.isEmpty(xDefaultState)) {
                const {
                    app,
                    auth,
                    message,
                    server,
                    user,
                    ...rest
                } = objects.deepCopy(xDefaultState);

                xInvestiraApp = { app, auth, message, server, user };
                xInvestiraUser = { user, ...rest };
            }

            //Salva estado atual do localStorage
            const xLocalStateUser = localStorages.getItem(localUser) || {};

            localStorages.setItem(localApp, xInvestiraApp);

            localStorages.setItem(localUser, {
                ...(xUserId
                    ? {
                          ...xLocalStateUser,
                          [xUserId]: {
                              ...xInvestiraUser
                          }
                      }
                    : { ...xLocalStateUser })
            });
        }

        return xDefaultState;
    }
};

export default bindStateToLocalStorage.bindListener;
