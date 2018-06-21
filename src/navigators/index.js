import { createStackNavigator, createSwitchNavigator } from 'react-navigation';
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

const WelcomeNavigator = createStackNavigator(
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

const WalletMainNavigator = createStackNavigator(
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

const SendNavigator = createStackNavigator(
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

const WalletNavigator = createStackNavigator(
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

export default createSwitchNavigator(
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
