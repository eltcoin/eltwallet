import React, { Component } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { GradientBackground, Header, SecondaryButton } from '../../components';
import Form from './components/Form';
import AnalyticsUtils from '../../utils/analytics';
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

class WalletSend extends Component {
  static propTypes = {
    navigator: PropTypes.shape({
      pop: PropTypes.func.isRequired,
      push: PropTypes.func.isRequired,
    }).isRequired,
    selectedToken: PropTypes.shape({
      symbol: PropTypes.string.isRequired,
    }).isRequired,
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
  };

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

  addressIsValid = () => /^0x([A-Fa-f0-9]{40})$/.test(this.state.address);

  amountIsValid = () => parseFloat(this.state.amount, 10) > 0;

  sendTransaction = async () => {
    try {
      await WalletUtils.sendTransaction(
        this.props.selectedToken,
        this.state.address,
        this.state.amount,
      );

      Alert.alert(
        `Sending ${this.props.selectedToken.symbol}`,
        `You've successfully sent ${this.state.amount} ${
          this.props.selectedToken.symbol
        } to ${this.state.address}`,
      );

      this.props.navigator.pop();
    } catch (error) {
      // TODO: Parse error message and display better error message
      Alert.alert(
        `Sending ${this.props.selectedToken.symbol}`,
        `An error happened during the transaction, please try again later`,
      );
    }
  };

  render() {
    return (
      <GradientBackground>
        <View style={styles.container}>
          <Header onBackPress={() => this.props.navigator.pop()} title="Send" />
          <Form
            address={this.state.address}
            amount={this.state.amount}
            onAddNewToken={() =>
              this.props.navigator.push({
                screen: 'AddToken',
                animationType: 'slide-horizontal',
              })
            }
            onAddressChange={address => this.setState({ address })}
            onAmountChange={amount => this.setState({ amount })}
            onCameraPress={this.onCameraPress}
            selectedToken={this.props.selectedToken}
          />
          <View style={styles.buttonContainer}>
            <SecondaryButton
              onPress={this.sendTransaction}
              disabled={!this.addressIsValid() || !this.amountIsValid()}
              text="Send"
            />
          </View>
        </View>
      </GradientBackground>
    );
  }
}

const mapStateToProps = state => ({
  selectedToken: state.selectedToken,
});

export default connect(mapStateToProps)(WalletSend);
