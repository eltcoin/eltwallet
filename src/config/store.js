import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import { persistReducer, persistStore } from 'redux-persist';
import createSensitiveStorage from 'redux-persist-sensitive-storage';
import { defaultState, rootReducer } from './reducer';

const storage = createSensitiveStorage({
  encrypt: true,
  keychainService: 'eltwallet',
  sharedPreferencesName: 'eltwallet',
});

const config = {
  key: 'eltwallet',
  version: 1,
  storage,
};

const store = createStore(
  persistReducer(config, rootReducer),
  defaultState,
  process.env.NODE_ENV === 'production'
    ? undefined
    : applyMiddleware(createLogger()),
);

const getPersistor = cb => persistStore(store, null, cb);

export { getPersistor, store };
