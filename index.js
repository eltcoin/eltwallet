import React from 'react';
import { AppRegistry, StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import './shim';
import Navigator from './src/navigators';
import { persistor, store } from './src/config/store';

const App = () => (
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <Navigator />
      <StatusBar barStyle="light-content" />
    </PersistGate>
  </Provider>
);

AppRegistry.registerComponent('Eltwallet', () => App);
