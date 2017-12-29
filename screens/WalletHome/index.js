import React, { Component } from 'react';
import {
  AsyncStorage,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import abi from 'ethereumjs-abi';
import { GradientBackground } from '../../components';
import TransactionsList from './components/TransactionsList';
import settingsIcon from './images/settings.png';
import sendIcon from './images/send.png';
import qrcodeIcon from './images/qrcode.png';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 40,
  },
  coinName: {
    color: '#fff',
    fontSize: 18,
    letterSpacing: 3,
    textAlign: 'center',
  },
  balanceRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 30,
    paddingHorizontal: 15,
    width: '100%',
  },
  balanceContainer: {
    flexDirection: 'row',
  },
  balance: {
    color: '#fff',
    fontSize: 30,
    letterSpacing: 3,
  },
  coinSymbol: {
    alignSelf: 'flex-end',
    color: '#fff',
    fontSize: 15,
    fontWeight: '200',
    letterSpacing: 3,
    paddingBottom: 3,
  },
  settingsIcon: {
    height: 24,
    width: 24,
  },
  listContainer: {
    width: '100%',
  },
});

export default class WalletHome extends Component {
  static propTypes = {
    navigator: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  };

  static navigatorStyle = {
    navBarHidden: true,
    statusBarTextColorScheme: 'light',
  };

  state = {
    currentBalance: 0,
    selectedToken: {
      address: '0x44197a4c44d6a059297caf6be4f7e172bd56caaf',
      decimals: 8,
      name: 'ELTCOIN',
      symbol: 'ELT',
    },
    tokenOperations: [],
  };

  componentDidMount() {
    this.fetchWalletAddress().then(() => {
      this.fetchBalance();
      this.fetchTransactions();
    });
  }

  onReceivePress = () => {
    this.props.navigator.push({
      screen: 'WalletReceive',
    });
  };

  onSendPress = () => {
    this.props.navigator.push({
      screen: 'WalletSend',
    });
  };

  fetchWalletAddress = async () => {
    const walletAddress = await AsyncStorage.getItem('@ELTWALLET:address');

    this.setState({
      walletAddress,
    });
  };

  fetchBalance = () => {
    try {
      fetch('https://api.myetherapi.com/eth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: '1',
          jsonrpc: '2.0',
          method: 'eth_call',
          params: [
            {
              to: this.state.selectedToken.address,
              data: `0x${abi
                .simpleEncode(
                  'balanceOf(address):(uint256)',
                  this.state.walletAddress,
                )
                .toString('hex')}`,
            },
            'pending',
          ],
        }),
      })
        .then(response => response.json())
        .then(data => {
          this.setState({
            currentBalance:
              parseInt(data.result, 16) /
              Math.pow(10, this.state.selectedToken.decimals),
          });
        });
    } catch (error) {
      this.setState({
        isErrorState: true,
      });
    }
  };

  fetchTransactions = () => {
    try {
      fetch(
        `https://api.ethplorer.io/getAddressHistory/${
          this.state.walletAddress
        }?apiKey=freekey&token=${
          this.state.selectedToken.address
        }&type=transfer`,
      )
        .then(response => response.json())
        .then(data => {
          this.setState({
            tokenOperations: data.operations || [],
          });
        });
    } catch (error) {
      this.setState({
        isErrorState: true,
      });
    }
  };

  render() {
    return (
      <GradientBackground>
        <View style={styles.container}>
          <View style={{}}>
            <Text style={styles.coinName}>{this.state.selectedToken.name}</Text>
            <View style={styles.balanceRow}>
              <View style={styles.balanceContainer}>
                <Text style={styles.balance}>
                  {this.state.currentBalance.toFixed(2)}
                </Text>
                <Text style={styles.coinSymbol}>ELT</Text>
              </View>
              <Image source={settingsIcon} style={styles.settingsIcon} />
            </View>
            <View style={styles.listContainer}>
              {this.state.walletAddress && (
                <TransactionsList
                  tokenOperations={this.state.tokenOperations}
                  walletAddress={this.state.walletAddress}
                  selectedToken={this.state.selectedToken}
                />
              )}
            </View>
          </View>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              width: '100%',
              alignItems: 'center',
              borderTopColor: '#3C3749',
              borderTopWidth: 0.5,
            }}
          >
            <TouchableOpacity
              onPress={this.onSendPress}
              style={{
                alignItems: 'center',
                borderRightColor: '#3C3749',
                borderRightWidth: 0.5,
                flexGrow: 1,
                justifyContent: 'center',
                paddingVertical: 15,
              }}
            >
              <View style={{ alignItems: 'center' }}>
                <Image style={{ height: 18, width: 18 }} source={sendIcon} />
                <Text style={{ color: '#9D9D9D', paddingTop: 5 }}>Send</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.onReceivePress}
              style={{
                flexGrow: 1,
                alignItems: 'center',
                borderLeftColor: '#3C3749',
                borderLeftWidth: 0.5,
                paddingVertical: 15,
              }}
            >
              <View style={{ alignItems: 'center' }}>
                <Image style={{ height: 18, width: 18 }} source={qrcodeIcon} />
                <Text style={{ color: '#9D9D9D', paddingTop: 5 }}>Receive</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </GradientBackground>
    );
  }
}
