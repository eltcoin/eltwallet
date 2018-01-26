import { AsyncStorage, Platform } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';
import { Sentry } from 'react-native-sentry';
import UserDefaults from 'react-native-userdefaults-ios';
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

  static async migrateFromUserDefaults() {
    const wallet = await UserDefaults.stringForKey('wallet').then(JSON.parse);

    if (wallet) {
      store.dispatch({
        type: SET_WALLET_ADDRESS,
        walletAddress: wallet.address,
      });

      store.dispatch({
        type: SET_PRIVATE_KEY,
        privateKey: wallet.privKey,
      });

      const pinCode = await UserDefaults.stringForKey('PIN');

      if (pinCode) {
        store.dispatch({
          type: SET_PIN_CODE,
          pinCode,
        });
      }
    }

    return UserDefaults.removeItemForKey('PIN').then(
      UserDefaults.removeItemForKey('wallet'),
    );
  }

  static start() {
    registerScreens(store, Provider);

    getPersistor(async () => {
      let { walletAddress } = store.getState();

      if (Platform.OS === 'android' && !walletAddress) {
        await this.migrateFromAsyncStorage();
      } else if (Platform.OS === 'ios' && !walletAddress) {
        await this.migrateFromUserDefaults();
      }

      let pinCode;

      // eslint-disable-next-line prefer-const
      ({ pinCode, walletAddress } = store.getState());

      let screen = {};

      if (pinCode && walletAddress) {
        screen = {
          title: 'PinCode',
          screen: 'PinCode',
        };
      } else if (walletAddress) {
        screen = {
          screen: 'CreateWallet',
          title: 'CreateWallet',
        };
      } else {
        screen = {
          screen: 'Home',
          title: 'Home',
        };
      }

      Navigation.startSingleScreenApp({
        screen,
        passProps: {
          migrationMode: screen.screen === 'CreateWallet',
        },
      });
    });
  }
}
