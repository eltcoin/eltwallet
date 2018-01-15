import React, { Component } from 'react';
import { AppState, Alert, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { GradientBackground, Text } from '../../components';
import {
  BalanceRow,
  CallToAction,
  Footer,
  TransactionsList,
} from './components';
import { SET_CALL_TO_ACTION_DISMISSED } from '../../config/actionTypes';
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

class WalletHome extends Component {
  static propTypes = {
    callToActionDismissed: PropTypes.bool.isRequired,
    dismissCallToAction: PropTypes.func.isRequired,
    navigator: PropTypes.shape({
      push: PropTypes.func.isRequired,
      resetTo: PropTypes.func.isRequired,
    }).isRequired,
    selectedToken: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    walletAddress: PropTypes.string,
  };

  static defaultProps = {
    walletAddress: '',
  };

  static navigatorStyle = {
    navBarHidden: true,
    screenBackgroundColor: '#181724',
    statusBarColor: 'transparent',
    statusBarTextColorScheme: 'light',
  };

  state = {
    currentBalance: 0,
    appState: AppState.currentState,
    refreshingTransactions: false,
    transactions: [],
  };

  componentDidMount() {
    this.addEventListeners();
    this.onRefresh();
  }

  componentWillReceiveProps(newProps) {
    if (
      newProps.walletAddress &&
      this.props.selectedToken !== newProps.selectedToken
    ) {
      this.setState(
        {
          currentBalance: 0,
          transactions: [],
        },
        () => {
          this.onRefresh();
        },
      );
    }
  }

  componentWillUnmount() {
    this.removeEventListeners();
  }

  onCallToActionPress = () => {
    this.props.navigator.push({
      animationType: 'slide-horizontal',
      screen: 'Settings',
    });

    this.props.navigator.push({
      animationType: 'slide-horizontal',
      screen: 'PrivateKey',
    });
  };

  onCallToActionDismiss = () => {
    Alert.alert(
      'Backup your wallet',
      "Make sure you've backed up your wallet private key. It can't be recovered if you lose it.",
      [
        { text: 'Ask me later' },
        {
          text: 'OK',
          onPress: async () => {
            this.props.dismissCallToAction();
          },
        },
      ],
    );
  };

  onRefresh = () => {
    this.fetchBalance();
    this.fetchTransactions();
  };

  handleAppStateChange = nextAppState => {
    const currentState = this.state.appState;

    this.setState({ appState: nextAppState });

    if (currentState === 'background' && nextAppState === 'active') {
      this.props.navigator.resetTo({
        screen: 'PinCode',
      });
    }
  };

  addEventListeners = () => {
    AppState.addEventListener('change', this.handleAppStateChange);
  };

  removeEventListeners = () => {
    AppState.removeEventListener('change', this.handleAppStateChange);
  };

  fetchBalance = async () => {
    const currentBalance = await WalletUtils.getBalance(
      this.props.selectedToken,
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
      this.props.selectedToken,
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
            <Text style={styles.coinName} letterSpacing={2}>
              {this.props.selectedToken.name}
            </Text>
            <BalanceRow
              currentBalance={this.state.currentBalance}
              onAddNewToken={() =>
                this.props.navigator.push({
                  screen: 'AddToken',
                  animationType: 'slide-horizontal',
                })
              }
              onSettingsIconPress={() =>
                this.props.navigator.push({
                  screen: 'Settings',
                  animationType: 'slide-horizontal',
                })
              }
            />
            {!this.props.callToActionDismissed && (
              <CallToAction
                onDismiss={this.onCallToActionDismiss}
                onPress={this.onCallToActionPress}
              />
            )}
            <View style={styles.bannerContainer}>
              <Text style={styles.bannerText}>
                Showing recent {this.props.selectedToken.name} transactions
              </Text>
            </View>
            <View style={styles.listContainer}>
              {!!this.props.walletAddress && (
                <TransactionsList
                  selectedToken={this.props.selectedToken}
                  transactions={this.state.transactions}
                  walletAddress={this.props.walletAddress}
                  onRefresh={this.onRefresh}
                  refreshing={this.state.refreshingTransactions}
                />
              )}
            </View>
          </View>
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

const mapStateToProps = state => ({
  callToActionDismissed: state.callToActionDismissed,
  selectedToken: state.selectedToken,
  walletAddress: state.walletAddress,
});

const mapDispatchToProps = dispatch => ({
  dismissCallToAction: () => dispatch({ type: SET_CALL_TO_ACTION_DISMISSED }),
});

export default connect(mapStateToProps, mapDispatchToProps)(WalletHome);
