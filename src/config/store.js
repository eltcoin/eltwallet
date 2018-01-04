import { AsyncStorage } from 'react-native';
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
  storage,
  migrate: async (state = {}) => {
    const newState = {};

    const keys = [
      '@ELTWALLET:address',
      '@ELTWALLET:availableTokens',
      '@ELTWALLET:defaultToken',
      '@ELTWALLET:pinCode',
      '@ELTWALLET:privateKey',
    ];

    const [
      walletAddress,
      availableTokens,
      selectedToken,
      pinCode,
      privateKey,
    ] = await AsyncStorage.multiGet(keys);

    if (walletAddress[1]) {
      [, newState.walletAddress] = walletAddress;
    }

    if (availableTokens[1]) {
      newState.availableTokens = JSON.parse(availableTokens[1]);
    }

    if (selectedToken[1]) {
      newState.selectedToken = JSON.parse(selectedToken[1]);
    }

    if (pinCode[1]) {
      [, newState.pinCode] = pinCode;
    }

    if (privateKey[1]) {
      [, newState.privateKey] = privateKey;
    }

    await AsyncStorage.multiRemove(keys);

    return Object.assign(state, newState);
  },
};

const store = createStore(
  persistReducer(config, rootReducer),
  defaultState,
  process.env.NODE_ENV === 'production'
    ? null
    : applyMiddleware(createLogger()),
);

const getPersistor = cb => persistStore(store, null, cb);

export { getPersistor, store };
