import React, { Component } from 'react';
import { AsyncStorage, StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import QRCode from 'react-native-qrcode';
import { Header, SecondaryButton } from '../../components';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0C0B0C',
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  qrcodeContainer: {
    alignItems: 'center',
    width: '100%',
  },
  addressTitle: {
    color: '#fff',
    textAlign: 'center',
    paddingBottom: 20,
    fontSize: 18,
  },
  walletAddress: {
    color: '#D8D8D8',
    textAlign: 'center',
  },
  buttonsContainer: {
    paddingTop: 40,
  },
});

export default class WalletReceive extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      dispatch: PropTypes.func.isRequired,
      goBack: PropTypes.func.isRequired,
    }).isRequired,
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
      <View style={styles.container}>
        <Header
          onBackPress={() => this.props.navigation.goBack()}
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
          <SecondaryButton onPress={() => {}} text="Wallet actions" />
        </View>
      </View>
    );
  }
}
