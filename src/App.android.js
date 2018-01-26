import { AsyncStorage } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';
import { Sentry } from 'react-native-sentry';
import registerScreens from './screens';
import { getPersistor, store } from './config/store';
import {
  ADD_TOKEN,
  SET_DEFAULT_TOKEN,
  SET_PIN_CODE,
  SET_PRIVATE_KEY,
  SET_WALLET_ADDRESS,
} from './config/actionTypes';

if (process.env.NODE_ENV === 'production') {
  Sentry.config(
    'https://0c7d72d067e34a6bb432bdc9a91c58a5:f84ff22cb0224a428aaee5937f7c435b@sentry.io/265240',
  ).install();
}

export default class App {
  static async migrateFromAsyncStorage() {
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
      store.dispatch({
        type: SET_WALLET_ADDRESS,
        walletAddress: walletAddress[1],
      });
    }

    if (availableTokens[1]) {
      JSON.parse(availableTokens[1])
        .slice(2)
        .forEach(token => {
          store.dispatch({
            type: ADD_TOKEN,
            token,
          });
        });
    }

    if (selectedToken[1]) {
      store.dispatch({
        type: SET_DEFAULT_TOKEN,
        token: JSON.parse(selectedToken[1]),
      });
    }

    if (pinCode[1]) {
      store.dispatch({
        type: SET_PIN_CODE,
        pinCode: pinCode[1],
      });
    }

    if (privateKey[1]) {
      store.dispatch({
        type: SET_PRIVATE_KEY,
        privateKey: privateKey[1],
      });
    }

    return AsyncStorage.multiRemove(keys);
  }

  static start() {
    registerScreens(store, Provider);

    getPersistor(async () => {
      const { walletAddress } = store.getState();

      if (!walletAddress) {
        await this.migrateFromAsyncStorage();
      }

      Navigation.startSingleScreenApp({
        screen: {
          title: walletAddress ? 'PinCode' : 'Home',
          screen: walletAddress ? 'PinCode' : 'Home',
        },
      });
    });
  }
}
