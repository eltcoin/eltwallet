import { StackNavigator, SwitchNavigator } from 'react-navigation';
import {
  AddTokenScreen,
  AppLoadingScreen,
  CreateWalletScreen,
  HomeScreen,
  PinCodeScreen,
  RecoverWalletScreen,
  CameraScreen,
  WalletHomeScreen,
  SettingsScreen,
  TokenPickerScreen,
  WalletReceiveScreen,
  WalletSendScreen,
  PrivateKeyScreen,
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
    Home: {
      screen: WalletHomeScreen,
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
    initialRouteName: 'Home',
  },
);

const SendNavigator = StackNavigator(
  {
    Camera: {
      screen: CameraScreen,
    },
    Main: {
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
    initialRouteName: 'Main',
  },
);

const WalletNavigator = StackNavigator(
  {
    Camera: {
      screen: CameraScreen,
    },
    Main: {
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
    initialRouteName: 'Main',
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
