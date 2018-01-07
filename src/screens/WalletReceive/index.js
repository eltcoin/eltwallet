import React, { Component } from 'react';
import { Alert, Clipboard, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
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
    paddingBottom: 15,
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

class WalletReceive extends Component {
  static propTypes = {
    navigator: PropTypes.shape({
      pop: PropTypes.func.isRequired,
      push: PropTypes.func.isRequired,
    }).isRequired,
    walletAddress: PropTypes.string.isRequired,
  };

  static navigatorStyle = {
    navBarHidden: true,
    screenBackgroundColor: '#181724',
    statusBarTextColorScheme: 'light',
    statusBarColor: 'transparent',
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
            <QRCode value={this.props.walletAddress} size={150} />
          </View>
          <View>
            <Text style={styles.addressTitle}>Address</Text>
            <Text style={styles.walletAddress}>{this.props.walletAddress}</Text>
          </View>
          <View style={styles.buttonContainer}>
            <SecondaryButton
              onPress={() => {
                Clipboard.setString(this.props.walletAddress);
                Alert.alert(
                  'Wallet address',
                  'Your wallet address has been copied to your clipboard!',
                );
              }}
              text="Copy to clipboard"
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

export default connect(mapStateToProps)(WalletReceive);
