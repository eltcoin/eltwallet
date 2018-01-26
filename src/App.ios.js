import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';
import { Sentry } from 'react-native-sentry';
import UserDefaults from 'react-native-userdefaults-ios';
import registerScreens from './screens';
import { getPersistor, store } from './config/store';
import {
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
      const { pinCode, walletAddress } = store.getState();

      if (!walletAddress) {
        await this.migrateFromUserDefaults();
      }

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
