import React, { Component } from 'react';
import { AppState, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { GradientBackground, Loader, Text } from '../../components';
import { BalanceRow, Footer, TransactionsList } from './components';
import StorageUtils from '../../utils/storage';
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
  bannerContainer: {
    backgroundColor: '#372F49',
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  bannerText: {
    color: '#9D9D9D',
  },
  listContainer: {
    flex: 1,
  },
});

export default class WalletHome extends Component {
  static propTypes = {
    navigator: PropTypes.shape({
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

  state = {
    currentBalance: 0,
    isLoading: true,
    refreshingTransactions: false,
    selectedToken: null,
    transactions: [],
  };

  componentDidMount() {
    this.addEventListeners();
    this.fetchWalletAddress();
    this.fetchDefaultToken().then(() => {
      this.fetchBalance();
      this.fetchTransactions();
    });
  }

  componentWillUnmount() {
    this.removeEventListeners();
  }

  onTokenAdd = () => {
    this.forceUpdate();
  };

  onTokenChange = selectedToken => {
    if (selectedToken.symbol !== this.state.selectedToken.symbol) {
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
    }
  };

  handleAppStateChange = () => {
    this.props.navigator.resetTo({
      screen: 'PinCode',
    });
  };

  addEventListeners = () => {
    AppState.addEventListener('change', this.handleAppStateChange);
  };

  removeEventListeners = () => {
    AppState.removeEventListener('change', this.handleAppStateChange);
  };

  fetchDefaultToken = async () => {
    const selectedToken = await StorageUtils.getDefaultToken();

    this.setState({
      isLoading: false,
      selectedToken,
    });
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
          {this.state.isLoading ? (
            <Loader />
          ) : (
            <View style={styles.topContainer}>
              <Text style={styles.coinName} letterSpacing={2}>
                {this.state.selectedToken.name}
              </Text>
              <BalanceRow
                currentBalance={this.state.currentBalance}
                selectedToken={this.state.selectedToken}
                onTokenChange={this.onTokenChange}
                onAddNewToken={() =>
                  this.props.navigator.push({
                    screen: 'AddToken',
                    animationType: 'slide-horizontal',
                    passProps: {
                      onTokenAdd: this.onTokenAdd,
                      onTokenChange: this.onTokenChange,
                    },
                  })
                }
                onSettingsIconPress={() =>
                  this.props.navigator.push({
                    screen: 'Settings',
                    animationType: 'slide-horizontal',
                  })
                }
              />
              <View style={styles.bannerContainer}>
                <Text style={styles.bannerText}>
                  Showing recent {this.state.selectedToken.name} transactions
                </Text>
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
          )}

          <Footer
            onReceivePress={() =>
              this.props.navigator.push({
                screen: 'WalletReceive',
                animationType: 'slide-horizontal',
              })
            }
            onSendPress={() =>
              this.props.navigator.push({
                screen: 'WalletSend',
                animationType: 'slide-horizontal',
                passProps: {
                  onTokenChange: this.onTokenChange,
                },
              })
            }
          />
        </View>
      </GradientBackground>
    );
  }
}
