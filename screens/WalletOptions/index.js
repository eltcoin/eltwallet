import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
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

export default class WalletActions extends Component {
  static propTypes = {
    navigator: PropTypes.shape({
      pop: PropTypes.func.isRequired,
      push: PropTypes.func.isRequired,
    }).isRequired,
  };

  static navigatorStyle = {
    navBarHidden: true,
    statusBarTextColorScheme: 'light',
    statusBarColor: 'transparent',
  };

  menuOptions = [
    {
      title: 'View private key',
      onPress: () => {
        this.props.navigator.push({
          screen: 'PrivateKey',
          animationType: 'slide-horizontal',
        });
      },
    },
  ];

  render() {
    return (
      <GradientBackground>
        <View style={styles.container}>
          <Header
            onBackPress={() => this.props.navigator.pop()}
            title="Wallet actions"
          />
          <Menu options={this.menuOptions} />
        </View>
      </GradientBackground>
    );
  }
}
