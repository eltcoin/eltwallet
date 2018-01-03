import React, { Component } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  GradientBackground,
  PrimaryButton,
  SecondaryButton,
} from '../../components';
import { LOGOUT } from '../../config/actionTypes';
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

class Home extends Component {
  static propTypes = {
    clearStore: PropTypes.func.isRequired,
    logout: PropTypes.bool,
    navigator: PropTypes.shape({
      push: PropTypes.func.isRequired,
      resetTo: PropTypes.func.isRequired,
    }).isRequired,
    walletAddress: PropTypes.string,
  };

  static defaultProps = {
    logout: false,
    walletAddress: '',
  };

  static navigatorStyle = {
    navBarHidden: true,
    screenBackgroundColor: '#181724',
    statusBarColor: 'transparent',
    statusBarTextColorScheme: 'light',
  };

  componentDidMount() {
    if (this.props.logout) {
      this.props.clearStore();
    } else if (this.props.walletAddress) {
      this.props.navigator.resetTo({
        screen: 'PinCode',
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
                  animationType: 'slide-horizontal',
                })
              }
              text="Create wallet"
            />
            <SecondaryButton
              onPress={() =>
                this.props.navigator.push({
                  screen: 'CreateWallet',
                  animationType: 'slide-horizontal',
                  passProps: {
                    recoverMode: true,
                  },
                })
              }
              text="Recover wallet"
            />
          </View>
        </View>
      </GradientBackground>
    );
  }
}

const mapStateToProps = state => ({
  walletAddress: state.walletAddress,
});

const mapDispatchToProps = dispatch => ({
  clearStore: () => dispatch({ type: LOGOUT }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
