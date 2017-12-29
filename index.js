import { Navigation } from 'react-native-navigation';
import './shim';
import {
  CreateWallet,
  Home,
  WalletHome,
  WalletReceive,
  WalletSend,
} from './screens';

Navigation.registerComponent('CreateWallet', () => CreateWallet);
Navigation.registerComponent('Home', () => Home);
Navigation.registerComponent('WalletHome', () => WalletHome);
Navigation.registerComponent('WalletReceive', () => WalletReceive);
Navigation.registerComponent('WalletSend', () => WalletSend);

Navigation.startSingleScreenApp({
  screen: {
    title: 'Home',
    screen: 'Home',
  },
});
