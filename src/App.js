import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';
import { Sentry } from 'react-native-sentry';
import registerScreens from './screens';
import { getPersistor, store } from './config/store';

if (process.env.NODE_ENV === 'production') {
  Sentry.config(
    'https://0c7d72d067e34a6bb432bdc9a91c58a5:f84ff22cb0224a428aaee5937f7c435b@sentry.io/265240',
  ).install();
}

export default class App {
  static start() {
    registerScreens(store, Provider);

    getPersistor(() => {
      const { walletAddress } = store.getState();

      Navigation.startSingleScreenApp({
        screen: {
          title: walletAddress ? 'PinCode' : 'Home',
          screen: walletAddress ? 'PinCode' : 'Home',
        },
      });
    });
  }
}
