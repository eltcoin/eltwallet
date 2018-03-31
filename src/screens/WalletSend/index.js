import React, { Component } from 'react';
import { Alert, SafeAreaView, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { NavigationActions } from 'react-navigation';
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
    navigation: PropTypes.shape({
      dispatch: PropTypes.func.isRequired,
      goBack: PropTypes.func.isRequired,
      navigate: PropTypes.func.isRequired,
    }).isRequired,
    selectedToken: PropTypes.shape({
      symbol: PropTypes.string.isRequired,
    }).isRequired,
  };

  state = {
    address: '',
    amount: '',
    isLoading: false,
  };

  onBarCodeRead = address => {
    AnalyticsUtils.trackEvent('Read send address QR code');

    this.setState({
      address,
    });
  };

  onCameraPress = () => {
    this.props.navigation.navigate('Camera', {
      onBarCodeRead: this.onBarCodeRead,
    });
  };

  goBack = () => {
    const backAction = NavigationActions.back({
      key: null,
    });

    this.props.navigation.dispatch(backAction);
  };

  addressIsValid = () => /^0x([A-Fa-f0-9]{40})$/.test(this.state.address);

  amountIsValid = () => parseFloat(this.state.amount, 10) > 0;

  sendTransaction = async () => {
    try {
      this.setState({
        isLoading: true,
      });

      await WalletUtils.sendTransaction(
        this.props.selectedToken,
        this.state.address,
        this.state.amount,
      );

      this.setState(
        {
          isLoading: false,
        },
        () => {
          Alert.alert(
            `Sending ${this.props.selectedToken.symbol}`,
            `You've successfully sent ${this.state.amount} ${
              this.props.selectedToken.symbol
            } to ${this.state.address}`,
            [{ text: 'OK', onPress: () => this.goBack() }],
            { cancelable: false },
          );
        },
      );
    } catch (error) {
      this.setState(
        {
          isLoading: false,
        },
        () => {
          Alert.alert(
            `Sending ${this.props.selectedToken.symbol}`,
            `An error happened during the transaction, please try again later`,
          );
        },
      );
    }
  };

  render() {
    return (
      <GradientBackground>
        <SafeAreaView style={styles.container}>
          <Header onBackPress={() => this.goBack()} title="Send" />
          <Form
            address={this.state.address}
            amount={this.state.amount}
            onAddressChange={address => this.setState({ address })}
            onAmountChange={amount => this.setState({ amount })}
            onCameraPress={this.onCameraPress}
            onTokenChangeIconPress={() =>
              this.props.navigation.navigate('TokenPicker')
            }
            selectedToken={this.props.selectedToken}
          />
          <View style={styles.buttonContainer}>
            <SecondaryButton
              disabled={!this.addressIsValid() || !this.amountIsValid()}
              isLoading={this.state.isLoading}
              onPress={this.sendTransaction}
              text="Send"
            />
          </View>
        </SafeAreaView>
      </GradientBackground>
    );
  }
}

const mapStateToProps = state => ({
  selectedToken: state.selectedToken,
});

export default connect(mapStateToProps)(WalletSend);
