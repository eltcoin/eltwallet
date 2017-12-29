import React, { Component } from 'react';
import {
  Image,
  Picker,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import { GradientBackground } from '../../components';
import TransactionsList from './components/TransactionsList';
import switchIcon from './images/switch.png';
import settingsIcon from './images/settings.png';
import sendIcon from './images/send.png';
import qrcodeIcon from './images/qrcode.png';
import { availableTokens } from '../../utils/constants';
import WalletUtils from '../../utils/wallet';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 40,
  },
  topContainer: {
    flex: 1,
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
  iconsContainer: {
    flexDirection: 'row',
  },
  switchIcon: {
    height: 24,
    marginRight: 20,
    marginTop: 1,
    width: 24,
  },
  settingsIcon: {
    height: 24,
    width: 24,
  },
  listContainer: {
    borderColor: '#372F49',
    borderTopWidth: 1,
    flex: 1,
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
    pickerEnabled: false,
  };

  state = {
    availableTokens,
    currentBalance: 0,
    refreshingTransactions: false,
    selectedToken: availableTokens[0],
    transactions: [],
  };

  componentDidMount() {
    this.fetchWalletAddress();
    this.fetchBalance();
    this.fetchTransactions();
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

  onTokenChange = tokenName => {
    const selectedToken = this.state.availableTokens.find(
      token => token.name === tokenName,
    );

    this.setState(
      {
        selectedToken,
        currentBalance: 0,
        transactions: [],
      },
      () => {
        this.fetchBalance();
        this.fetchTransactions();
      },
    );
  };

  fetchWalletAddress = async () => {
    const wallet = await WalletUtils.getWallet();

    this.setState({
      walletAddress: wallet.getAddressString(),
    });
  };

  fetchBalance = async () => {
    const currentBalance = await WalletUtils.getBalance(
      this.state.selectedToken,
    );

    this.setState({
      currentBalance,
    });
  };

  fetchTransactions = async () => {
    this.setState({
      refreshingTransactions: true,
    });

    const transactions = await WalletUtils.getTransactions(
      this.state.selectedToken,
    );

    this.setState({
      refreshingTransactions: false,
      transactions,
    });
  };

  render() {
    return (
      <GradientBackground>
        <View style={styles.container}>
          <View style={styles.topContainer}>
            <Text style={styles.coinName}>{this.state.selectedToken.name}</Text>
            <View style={styles.balanceRow}>
              <View style={styles.balanceContainer}>
                <Text style={styles.balance}>
                  {this.state.currentBalance.toFixed(2)}
                </Text>
                <Text style={styles.coinSymbol}>
                  {this.state.selectedToken.symbol}
                </Text>
              </View>
              <View style={styles.iconsContainer}>
                <TouchableOpacity>
                  <Image source={switchIcon} style={styles.switchIcon} />
                  <Picker
                    onValueChange={this.onTokenChange}
                    selectedValue={this.state.selectedToken.name}
                    style={{
                      position: 'absolute',
                      top: 0,
                      width: 1000,
                      height: 1000,
                    }}
                  >
                    {this.state.availableTokens.map(token => (
                      <Picker.Item
                        label={token.name}
                        value={token.name}
                        key={token.symbol}
                      />
                    ))}
                  </Picker>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Image source={settingsIcon} style={styles.settingsIcon} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.listContainer}>
              {this.state.walletAddress && (
                <TransactionsList
                  selectedToken={this.state.selectedToken}
                  transactions={this.state.transactions}
                  walletAddress={this.state.walletAddress}
                  onRefresh={this.fetchTransactions}
                  refreshing={this.state.refreshingTransactions}
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
              borderTopWidth: 1,
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
