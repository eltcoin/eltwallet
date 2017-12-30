import { Navigation, ScreenVisibilityListener } from 'react-native-navigation';
import { Sentry } from 'react-native-sentry';
import './shim';
import {
  AddToken,
  Camera,
  CreateWallet,
  Home,
  PinCode,
  PrivateKey,
  RecoverWallet,
  Settings,
  WalletHome,
  WalletOptions,
  WalletReceive,
  WalletSend,
} from './screens';
import AnalyticsUtils from './utils/analytics';

Sentry.config(
  'https://0c7d72d067e34a6bb432bdc9a91c58a5:f84ff22cb0224a428aaee5937f7c435b@sentry.io/265240',
).install();

Navigation.registerComponent('AddToken', () => AddToken);
Navigation.registerComponent('Camera', () => Camera);
Navigation.registerComponent('CreateWallet', () => CreateWallet);
Navigation.registerComponent('Home', () => Home);
Navigation.registerComponent('PinCode', () => PinCode);
Navigation.registerComponent('PrivateKey', () => PrivateKey);
Navigation.registerComponent('RecoverWallet', () => RecoverWallet);
Navigation.registerComponent('Settings', () => Settings);
Navigation.registerComponent('WalletHome', () => WalletHome);
Navigation.registerComponent('WalletOptions', () => WalletOptions);
Navigation.registerComponent('WalletReceive', () => WalletReceive);
Navigation.registerComponent('WalletSend', () => WalletSend);

new ScreenVisibilityListener({
  didAppear: ({ screen }) => AnalyticsUtils.trackScreen(screen),
}).register();

Navigation.startSingleScreenApp({
  screen: {
    title: 'Home',
    screen: 'Home',
  },
});
