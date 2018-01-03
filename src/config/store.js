import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import { persistReducer } from 'redux-persist';
import createSensitiveStorage from 'redux-persist-sensitive-storage';
import { defaultState, rootReducer } from './reducer';

const storage = createSensitiveStorage({
  encrypt: true,
  keychainService: 'eltwallet',
  sharedPreferencesName: 'eltwallet',
});

const config = {
  key: 'eltwallet',
  storage,
};

export default createStore(
  persistReducer(config, rootReducer),
  defaultState,
  process.env.NODE_ENV === 'production'
    ? null
    : applyMiddleware(createLogger()),
);
