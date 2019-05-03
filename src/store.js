import { createStore as theRealCreateStore, combineReducers } from 'redux';

/**
 * isAsyncFn
 *
 * @param {any} fn
 * @return {boolean} True if the argument appears to be an async function
 */
const isAsyncFn = (fn) => {
  const str = fn.toString();
  return str.includes('regeneratorRuntime.mark(') || str.includes('.apply(');
};

/**
 * createReducer
 *
 * @param {string} name
 * @param {object} model
 * @return {function} Reducer
 */
const createReducer = (name, model) => {
  const { state, reducers, actions } = model;
  state.loading = {};
  Object.keys(actions).forEach((actionName) => {
    if (isAsyncFn(actions[actionName])) state.loading[actionName] = false;
  });

  return (currentState = state, action) => {
    if (action.type === `@${name}/SET_STATE`) {
      return { ...currentState, ...action.nextState };
    }
    const [namespace, reducerName] = action.type.split('/');
    if (namespace !== name) return currentState;
    return reducers[reducerName](currentState, ...action.payload);
  };
};

/**
 * createMethods
 *
 * @param {object} store
 * @param {string} name
 * @param {object} model
 * @return {object} Formatted model
 */
const createMethods = (store, name, model) => {
  const { dispatch, getState } = store;
  const { reducers, actions } = model;

  // Reducers
  const newReducers = {};
  const setState = function reducer(nextState) {
    dispatch({ type: `@${name}/SET_STATE`, nextState });
  };
  if (reducers === undefined) {
    newReducers.setState = setState;
  } else {
    Object.keys(reducers).forEach((reducerName) => {
      newReducers[reducerName] = function reducer(...payload) {
        dispatch({ type: `${name}/${reducerName}`, payload });
      };
    });
  }

  // Actions
  const newActions = {};
  const context = (actionName) => {
    const { [actionName]: self, ...otherMethods } = dispatch[name]; // eslint-disable-line
    return {
      state: getState()[name],
      ...otherMethods,
      ...Object.keys(dispatch).reduce((root, modelName) => {
        if (modelName !== name) {
          root[modelName] = {
            state: getState()[modelName],
            ...dispatch[modelName],
          };
        }
        return root;
      }, {}),
    };
  };
  const loading = () => getState()[name].loading;
  Object.keys(actions).forEach((actionName) => {
    const action = (...args) => actions[actionName].bind(context(actionName))(...args);
    newActions[actionName] =
      loading()[actionName] === undefined
        ? action
        : async function asyncAction(...args) {
            setState({ loading: { ...loading(), [actionName]: true } });
            const resolve = await action(...args);
            setState({ loading: { ...loading(), [actionName]: false } });
            return resolve;
          };
  });

  // bind methods to dispatch
  dispatch[name] = { ...newReducers, ...newActions };
  // return new model
  return { reducers: newReducers, actions: newActions };
};

/**
 * createStore
 *
 * @param {object} models - { model: { state, actions } } or { model: () => import() }
 * @return {object} Store or Promise
 */
const createStore = (models) => {
  const isAsyncImport = Object.values(models).some((model) => typeof model === 'function');
  const rootReducers = {};

  const getStore = () => {
    const store = theRealCreateStore(combineReducers(rootReducers));
    Object.keys(models).forEach((name) => {
      const model = models[name];
      models[name] = createMethods(store, name, model);
    });
    store.addModel = (name, model) => {
      if (name in rootReducers) return;
      rootReducers[name] = createReducer(name, model);
      store.replaceReducer(combineReducers(rootReducers));
      models[name] = createMethods(store, name, model);
    };
    return store;
  };

  // static import
  if (!isAsyncImport) {
    Object.keys(models).forEach((name) => {
      const model = models[name];
      rootReducers[name] = createReducer(name, model);
    });
    return getStore(true);
  }

  // dynamic import
  const modelMap = {};
  return Promise.all(
    Object.keys(models).map((name, index) => {
      modelMap[index] = { name };
      const model = models[name];
      if (typeof model === 'function') {
        modelMap[index].async = true;
        return model();
      }
      modelMap[index].async = false;
      return model;
    }),
  ).then((modelList) => {
    modelList.forEach((model, index) => {
      const { name, async } = modelMap[index];
      if (async) {
        model = model.default; // eslint-disable-line
        models[name] = model;
      }
      rootReducers[name] = createReducer(name, model);
    });
    return getStore(false);
  });
};

/**
 * withStore
 *
 * @param {...string} names - ['modelA', 'modelB', ...]
 * @return {array} [mapState, mapMethods]
 */
const withStore = (...names) => [
  (state) => Object.assign({}, ...names.map((name) => state && state[name])),
  (dispatch) => Object.assign({ dispatch }, ...names.map((name) => dispatch && dispatch[name])),
];

/**
 * exports
 */
export { createStore, withStore };
