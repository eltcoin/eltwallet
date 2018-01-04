import React, { Component } from 'react';
import { Alert, Linking, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { GradientBackground, Header, Menu } from '../../components';
import { LOGOUT } from '../../config/actionTypes';
import { getPersistor } from '../../config/store';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 15,
  },
});

class Settings extends Component {
  static propTypes = {
    logout: PropTypes.func.isRequired,
    navigator: PropTypes.shape({
      pop: PropTypes.func.isRequired,
      push: PropTypes.func.isRequired,
      resetTo: PropTypes.func.isRequired,
    }).isRequired,
  };

  static navigatorStyle = {
    navBarHidden: true,
    screenBackgroundColor: '#181724',
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
      title: 'View private key',
      onPress: () => {
        this.props.navigator.push({
          screen: 'PrivateKey',
          animationType: 'slide-horizontal',
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
                await this.props.logout();

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

const mapDispatchToProps = dispatch => ({
  logout: async () => {
    dispatch({ type: LOGOUT });
    await getPersistor(null).flush();
  },
});

export default connect(null, mapDispatchToProps)(Settings);
