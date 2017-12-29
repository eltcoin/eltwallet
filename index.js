import { Navigation } from 'react-native-navigation';
import './shim';
import {
  Camera,
  CreateWallet,
  Home,
  RecoverWallet,
  WalletHome,
  WalletReceive,
  WalletSend,
} from './screens';

Navigation.registerComponent('Camera', () => Camera);
Navigation.registerComponent('CreateWallet', () => CreateWallet);
Navigation.registerComponent('Home', () => Home);
Navigation.registerComponent('RecoverWallet', () => RecoverWallet);
Navigation.registerComponent('WalletHome', () => WalletHome);
Navigation.registerComponent('WalletReceive', () => WalletReceive);
Navigation.registerComponent('WalletSend', () => WalletSend);

Navigation.startSingleScreenApp({
  screen: {
    title: 'Home',
    screen: 'Home',
  },
});
