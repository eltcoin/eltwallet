import { Navigation, ScreenVisibilityListener } from 'react-native-navigation';
import AnalyticsUtils from '../utils/analytics';
import AddToken from './AddToken';
import Camera from './Camera';
import CreateWallet from './CreateWallet';
import Home from './Home';
import PinCode from './PinCode';
import PrivateKey from './PrivateKey';
import RecoverWallet from './RecoverWallet';
import Settings from './Settings';
import TokenPicker from './TokenPicker';
import WalletHome from './WalletHome';
import WalletReceive from './WalletReceive';
import WalletSend from './WalletSend';

export default (store, Provider) => {
  Navigation.registerComponent('AddToken', () => AddToken, store, Provider);
  Navigation.registerComponent('Camera', () => Camera, store, Provider);
  Navigation.registerComponent(
    'CreateWallet',
    () => CreateWallet,
    store,
    Provider,
  );
  Navigation.registerComponent('Home', () => Home, store, Provider);
  Navigation.registerComponent('PinCode', () => PinCode, store, Provider);
  Navigation.registerComponent('PrivateKey', () => PrivateKey, store, Provider);
  Navigation.registerComponent(
    'RecoverWallet',
    () => RecoverWallet,
    store,
    Provider,
  );
  Navigation.registerComponent('Settings', () => Settings, store, Provider);
  Navigation.registerComponent(
    'TokenPicker',
    () => TokenPicker,
    store,
    Provider,
  );
  Navigation.registerComponent('WalletHome', () => WalletHome, store, Provider);
  Navigation.registerComponent(
    'WalletReceive',
    () => WalletReceive,
    store,
    Provider,
  );
  Navigation.registerComponent('WalletSend', () => WalletSend, store, Provider);

  new ScreenVisibilityListener({
    didAppear: ({ screen }) => AnalyticsUtils.trackScreen(screen),
  }).register();
};
