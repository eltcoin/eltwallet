import React, { Component } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import PropTypes from 'prop-types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  GradientBackground,
  Header,
  SecondaryButton,
  Loader,
} from '../../components';
import Form from './components/Form';
import AnalyticsUtils from '../../utils/analytics';
import StorageUtils from '../../utils/storage';
import WalletUtils from '../../utils/wallet';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 15,
  },
  buttonContainer: {
    paddingHorizontal: 15,
    paddingTop: 40,
  },
});

export default class WalletSend extends Component {
  static propTypes = {
    navigator: PropTypes.shape({
      pop: PropTypes.func.isRequired,
      push: PropTypes.func.isRequired,
    }).isRequired,
    onTokenChange: PropTypes.func.isRequired,
  };

  static navigatorStyle = {
    navBarHidden: true,
    screenBackgroundColor: '#181724',
    statusBarTextColorScheme: 'light',
    statusBarColor: 'transparent',
  };

  state = {
    address: '',
    amount: '',
    isLoading: true,
    selectedToken: null,
  };

  componentDidMount() {
    this.fetchDefaultToken();
  }

  componentWillUnmount() {
    this.props.onTokenChange(this.state.selectedToken);
  }

  onBarCodeRead = address => {
    this.props.navigator.pop();

    AnalyticsUtils.trackEvent('Read send address QR code');

    this.setState({
      address,
    });
  };

  onCameraPress = () => {
    this.props.navigator.push({
      animationType: 'slide-horizontal',
      passProps: {
        onBarCodeRead: this.onBarCodeRead,
      },
      screen: 'Camera',
    });
  };

  onTokenAdd = () => {
    this.forceUpdate();
  };

  onTokenChange = selectedToken => {
    this.setState({
      selectedToken,
    });
  };

  fetchDefaultToken = async () => {
    const selectedToken = await StorageUtils.getDefaultToken();

    this.setState({
      isLoading: false,
      selectedToken,
    });
  };

  addressIsValid = () => /^0x([A-Fa-f0-9]{40})$/.test(this.state.address);

  amountIsValid = () => parseFloat(this.state.amount, 10) > 0;

  sendTransaction = async () => {
    try {
      await WalletUtils.sendTransaction(
        this.state.selectedToken,
        this.state.address,
        this.state.amount,
      );

      Alert.alert(
        `You've successfully sent ${this.state.amount} ${
          this.state.selectedToken.symbol
        } to ${this.state.address}`,
      );

      this.props.navigator.pop();
    } catch (error) {
      // TODO: Parse error message and display better error message
      Alert.alert(
        `An error happened during the transaction, please try again later`,
      );
    }
  };

  render() {
    return (
      <GradientBackground>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.container}
          scrollEnabled={false}
        >
          <Header onBackPress={() => this.props.navigator.pop()} title="Send" />
          {this.state.isLoading ? (
            <Loader />
          ) : (
            <Form
              address={this.state.address}
              amount={this.state.amount}
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
              onAddressChange={address => this.setState({ address })}
              onAmountChange={amount => this.setState({ amount })}
              onCameraPress={this.onCameraPress}
              onTokenChange={this.onTokenChange}
              selectedToken={this.state.selectedToken}
            />
          )}
          <View style={styles.buttonContainer}>
            <SecondaryButton
              onPress={this.sendTransaction}
              disabled={!this.addressIsValid() || !this.amountIsValid()}
              text="Send"
            />
          </View>
        </KeyboardAwareScrollView>
      </GradientBackground>
    );
  }
}
