import React, { Component } from 'react';
import { AsyncStorage, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import QRCode from 'react-native-qrcode';
import {
  GradientBackground,
  Header,
  SecondaryButton,
  Text,
} from '../../components';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  qrcodeContainer: {
    paddingHorizontal: 15,
    alignItems: 'center',
    width: '100%',
  },
  addressTitle: {
    paddingHorizontal: 15,
    color: '#fff',
    textAlign: 'center',
    paddingBottom: 20,
    fontSize: 18,
  },
  walletAddress: {
    paddingHorizontal: 15,
    color: '#9d9d9d',
    textAlign: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 15,
    paddingTop: 40,
  },
});

export default class WalletReceive extends Component {
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

  state = {
    walletAddress: '',
  };

  componentDidMount() {
    this.fetchWalletAddress();
  }

  fetchWalletAddress = async () => {
    const walletAddress = await AsyncStorage.getItem('@ELTWALLET:address');

    this.setState({
      walletAddress,
    });
  };

  render() {
    return (
      <GradientBackground>
        <View style={styles.container}>
          <Header
            onBackPress={() => this.props.navigator.pop()}
            title="Receive"
          />
          <View style={styles.qrcodeContainer}>
            <QRCode value={this.state.walletAddress} size={150} />
          </View>
          <View>
            <Text style={styles.addressTitle}>Address</Text>
            <Text style={styles.walletAddress}>{this.state.walletAddress}</Text>
          </View>
          <View style={styles.buttonContainer}>
            <SecondaryButton
              onPress={() => {
                this.props.navigator.push({
                  screen: 'WalletOptions',
                  animationType: 'slide-horizontal',
                });
              }}
              text="Wallet actions"
            />
          </View>
        </View>
      </GradientBackground>
    );
  }
}
