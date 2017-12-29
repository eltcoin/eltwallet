import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AsyncStorage, Image, StyleSheet, View } from 'react-native';
import {
  GradientBackground,
  PrimaryButton,
  SecondaryButton,
} from '../../components';
import logo from './images/logo.png';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1,
    paddingBottom: 20,
    paddingHorizontal: 15,
  },
  logoContainer: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
    width: '100%',
  },
  logo: {
    width: '65%',
  },
  buttonsContainer: {
    width: '100%',
  },
});

export default class Home extends Component {
  static propTypes = {
    navigator: PropTypes.shape({
      push: PropTypes.func.isRequired,
      resetTo: PropTypes.func.isRequired,
    }).isRequired,
  };

  static navigatorStyle = {
    navBarHidden: true,
    statusBarTextColorScheme: 'light',
    statusBarTextColorSchemeSingleScreen: 'light',
  };

  async componentDidMount() {
    const walletAddress = await AsyncStorage.getItem('@ELTWALLET:address');

    if (walletAddress) {
      this.props.navigator.resetTo({
        screen: 'WalletHome',
      });
    }
  }

  render() {
    return (
      <GradientBackground>
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Image source={logo} style={styles.logo} resizeMode="contain" />
          </View>
          <View style={styles.buttonsContainer}>
            <PrimaryButton
              onPress={() =>
                this.props.navigator.push({
                  screen: 'CreateWallet',
                })
              }
              text="Create wallet"
            />
            <SecondaryButton onPress={() => {}} text="Recover wallet" />
          </View>
        </View>
      </GradientBackground>
    );
  }
}
