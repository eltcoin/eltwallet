import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';
import { Sentry } from 'react-native-sentry';
import { persistStore } from 'redux-persist';
import registerScreens from './screens';
import store from './config/store';

if (process.env.NODE_ENV === 'production') {
  Sentry.config(
    'https://0c7d72d067e34a6bb432bdc9a91c58a5:f84ff22cb0224a428aaee5937f7c435b@sentry.io/265240',
  ).install();
}

export default class App {
  static start() {
    registerScreens(store, Provider);

    persistStore(store, null, () => {
      Navigation.startSingleScreenApp({
        screen: {
          title: 'Home',
          screen: 'Home',
        },
      });
    });
  }
}
