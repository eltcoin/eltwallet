import { StackNavigator, SwitchNavigator } from 'react-navigation';
import {
  AddTokenScreen,
  AppLoadingScreen,
  CameraScreen,
  CreateWalletScreen,
  HomeScreen,
  NetworkPickerScreen,
  PinCodeScreen,
  PrivateKeyScreen,
  RecoverWalletScreen,
  SettingsScreen,
  TokenPickerScreen,
  WalletHomeScreen,
  WalletReceiveScreen,
  WalletSendScreen,
} from '../screens';

const WelcomeNavigator = StackNavigator(
  {
    Camera: {
      screen: CameraScreen,
    },
    CreateWallet: {
      screen: CreateWalletScreen,
    },
    Home: {
      screen: HomeScreen,
    },
    RecoverWallet: {
      screen: RecoverWalletScreen,
    },
  },
  {
    cardStyle: {
      backgroundColor: '#181724',
    },
    headerMode: 'none',
    initialRouteName: 'Home',
  },
);

const WalletMainNavigator = StackNavigator(
  {
    AddToken: {
      screen: AddTokenScreen,
    },
    Camera: {
      screen: CameraScreen,
    },
    CreateWallet: {
      screen: CreateWalletScreen,
    },
    WalletHome: {
      screen: WalletHomeScreen,
    },
    NetworkPicker: {
      screen: NetworkPickerScreen,
    },
    PrivateKey: {
      screen: PrivateKeyScreen,
    },
    Settings: {
      screen: SettingsScreen,
    },
    TokenPicker: {
      screen: TokenPickerScreen,
    },
  },
  {
    cardStyle: {
      backgroundColor: '#181724',
    },
    headerMode: 'none',
    initialRouteName: 'WalletHome',
  },
);

const SendNavigator = StackNavigator(
  {
    Camera: {
      screen: CameraScreen,
    },
    SendMain: {
      screen: WalletSendScreen,
    },
    TokenPicker: {
      screen: TokenPickerScreen,
    },
  },
  {
    cardStyle: {
      backgroundColor: '#181724',
    },
    headerMode: 'none',
    initialRouteName: 'SendMain',
  },
);

const WalletNavigator = StackNavigator(
  {
    Camera: {
      screen: CameraScreen,
    },
    WalletMain: {
      screen: WalletMainNavigator,
    },
    Receive: {
      screen: WalletReceiveScreen,
    },
    Send: {
      screen: SendNavigator,
    },
  },
  {
    cardStyle: {
      backgroundColor: '#181724',
    },
    headerMode: 'none',
    initialRouteName: 'WalletMain',
    mode: 'modal',
  },
);

export default SwitchNavigator(
  {
    AppLoading: AppLoadingScreen,
    PinCode: PinCodeScreen,
    Wallet: WalletNavigator,
    Welcome: WelcomeNavigator,
  },
  {
    initialRouteName: 'AppLoading',
  },
);
