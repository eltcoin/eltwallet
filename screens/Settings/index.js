import React, { Component } from 'react';
import { Alert, AsyncStorage, Linking, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { GradientBackground, Header, Menu } from '../../components';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 15,
  },
});

export default class Settings extends Component {
  static propTypes = {
    navigator: PropTypes.shape({
      pop: PropTypes.func.isRequired,
      push: PropTypes.func.isRequired,
      resetTo: PropTypes.func.isRequired,
    }).isRequired,
  };

  static navigatorStyle = {
    navBarHidden: true,
    statusBarColor: 'transparent',
    statusBarTextColorScheme: 'light',
  };

  menuOptions = [
    {
      title: 'Change PIN',
      onPress: () => {
        this.props.navigator.push({
          screen: 'CreateWallet',
          animationType: 'slide-horizontal',
          passProps: {
            editMode: true,
          },
        });
      },
    },
    {
      title: 'ELTCOIN Website',
      onPress: () => {
        Linking.openURL('https://www.eltcoin.tech');
      },
    },
    {
      title: 'Logout',
      onPress: () => {
        Alert.alert(
          'Logout',
          'Your wallet will be erased from your device. Make sure to backup your private key before going further.',
          [
            {
              text: 'Cancel',
              onPress: () => {},
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: async () => {
                await AsyncStorage.clear();
                this.props.navigator.resetTo({
                  screen: 'Home',
                });
              },
            },
          ],
          { cancelable: false },
        );
      },
    },
  ];

  render() {
    return (
      <GradientBackground>
        <View style={styles.container}>
          <Header
            onBackPress={() => this.props.navigator.pop()}
            title="Settings"
          />
          <Menu options={this.menuOptions} />
        </View>
      </GradientBackground>
    );
  }
}
