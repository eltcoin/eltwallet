import React, { Component } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { StackNavigator } from 'react-navigation';
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';
import './shim';
import { CreateWallet, Home, WalletHome, WalletReceive } from './screens';

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
});

const WalletNavigator = StackNavigator(
  {
    Home: {
      screen: WalletHome,
    },
    Receive: {
      screen: WalletReceive,
    },
  },
  {
    headerMode: 'none',
    navigationOptions: {
      gesturesEnabled: false,
    },
  },
);

const MainNavigator = StackNavigator(
  {
    Home: {
      screen: Home,
    },
    CreateWallet: {
      screen: CreateWallet,
    },
    Wallet: {
      screen: WalletNavigator,
    },
  },
  {
    headerMode: 'none',
    navigationOptions: {
      gesturesEnabled: false,
    },
    transitionConfig: () => ({
      screenInterpolator: sceneProps => {
        // Disable the transition animation when resetting to the home screen.
        if (
          sceneProps.index === 0 &&
          sceneProps.scene.route.routeName !== 'Home' &&
          sceneProps.scenes.length > 2
        ) {
          return null;
        }

        return CardStackStyleInterpolator.forHorizontal(sceneProps);
      },
    }),
  },
);

export default class App extends Component {
  render() {
    return (
      <View style={styles.view}>
        <StatusBar translucent barStyle="light-content" />
        <MainNavigator />
      </View>
    );
  }
}
