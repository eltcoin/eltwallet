import { Navigation } from 'react-native-navigation';
import './shim';
import {
  Camera,
  CreateWallet,
  Home,
  PrivateKey,
  RecoverWallet,
  Settings,
  WalletHome,
  WalletOptions,
  WalletReceive,
  WalletSend,
} from './screens';

Navigation.registerComponent('Camera', () => Camera);
Navigation.registerComponent('CreateWallet', () => CreateWallet);
Navigation.registerComponent('Home', () => Home);
Navigation.registerComponent('PrivateKey', () => PrivateKey);
Navigation.registerComponent('RecoverWallet', () => RecoverWallet);
Navigation.registerComponent('Settings', () => Settings);
Navigation.registerComponent('WalletHome', () => WalletHome);
Navigation.registerComponent('WalletOptions', () => WalletOptions);
Navigation.registerComponent('WalletReceive', () => WalletReceive);
Navigation.registerComponent('WalletSend', () => WalletSend);

Navigation.startSingleScreenApp({
  screen: {
    title: 'Home',
    screen: 'Home',
  },
});
