import React from 'react';
import { AppRegistry, StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import Config from 'react-native-config';
import { PersistGate } from 'redux-persist/integration/react';
import { Sentry } from 'react-native-sentry';
import './shim';
import Navigator from './src/navigators';
import { persistor, store } from './src/config/store';
import AnalyticsUtils from './src/utils/analytics';

if (process.env.NODE_ENV === 'production') {
  Sentry.config(Config.SENTRY_API_KEY).install();
}

const getCurrentRouteName = navigationState => {
  if (!navigationState) {
    return null;
  }

  const route = navigationState.routes[navigationState.index];

  if (route.routes) {
    return getCurrentRouteName(route);
  }

  return route.routeName;
};

const App = () => (
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <Navigator
        onNavigationStateChange={(prevState, currentState) => {
          const currentScreen = getCurrentRouteName(currentState);
          const prevScreen = getCurrentRouteName(prevState);

          if (prevScreen !== currentScreen) {
            AnalyticsUtils.trackScreen(currentScreen);
          }
        }}
      />
      <StatusBar barStyle="light-content" />
    </PersistGate>
  </Provider>
);

AppRegistry.registerComponent('Eltwallet', () => App);
