import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  AsyncStorage,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import range from 'lodash/range';
import EthereumJsWallet from 'ethereumjs-wallet';
import { GradientBackground, Header } from '../../components';
import Keyboard from './components/Keyboard';
import emptyCircle from './images/emptyCircle.png';
import filledCircle from './images/filledCircle.png';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  explanatoryText: {
    color: '#fff',
    paddingHorizontal: 50,
    paddingVertical: 30,
    textAlign: 'center',
  },
  dotsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  dot: {
    height: 20,
    width: 20,
    marginHorizontal: 10,
  },
});

export default class CreateWallet extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      dispatch: PropTypes.func.isRequired,
      goBack: PropTypes.func.isRequired,
    }).isRequired,
  };

  state = {
    confirmationPinCode: '',
    pinCode: '',
    isConfirmation: false,
  };

  onKeyPress = n => {
    if (!this.state.isConfirmation) {
      this.updatePinCode(n);
    } else {
      this.updateConfirmationPinCode(n);
    }
  };

  updatePinCode = n => {
    this.setState(
      {
        pinCode: `${this.state.pinCode}${n}`,
      },
      () => {
        if (this.state.pinCode.length === 4) {
          this.setState({
            isConfirmation: true,
          });
        }
      },
    );
  };

  generateWallet = async () => {
    const wallet = EthereumJsWallet.generate();

    await AsyncStorage.multiSet([
      ['@ELTWALLET:address', wallet.getAddressString()],
      ['@ELTWALLET:privateKey', wallet.getPrivateKeyString()],
    ]);
  };

  updateConfirmationPinCode = n => {
    this.setState(
      {
        confirmationPinCode: `${this.state.confirmationPinCode}${n}`,
      },
      async () => {
        if (
          this.state.confirmationPinCode.length === 4 &&
          this.state.pinCode === this.state.confirmationPinCode
        ) {
          await this.generateWallet();

          this.props.navigation.dispatch(
            NavigationActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({
                  routeName: 'Wallet',
                }),
              ],
            }),
          );
        } else if (this.state.confirmationPinCode.length === 4) {
          this.setState(
            {
              pinCode: '',
              confirmationPinCode: '',
              isConfirmation: false,
            },
            () => {
              Alert.alert("Your PIN code doesn't match. Please try again.");
            },
          );
        }
      },
    );
  };

  render() {
    const pinCode = this.state.isConfirmation
      ? this.state.confirmationPinCode
      : this.state.pinCode;

    return (
      <GradientBackground>
        <View style={styles.container}>
          <Header
            onBackPress={() => this.props.navigation.goBack()}
            title={this.state.isConfirmation ? 'Repeat PIN' : 'Create PIN'}
          />
          <Text style={styles.explanatoryText}>
            {this.state.isConfirmation
              ? "Just to make sure it's correct"
              : "This PIN will be used to access your ELTWALLET. If you forget it, you won't be able to access your ELT."}
          </Text>
          <View style={styles.dotsContainer}>
            {range(0, pinCode.length).map(n => (
              <Image source={filledCircle} style={styles.dot} key={n} />
            ))}
            {range(0, 4 - pinCode.length).map(n => (
              <Image source={emptyCircle} style={styles.dot} key={n} />
            ))}
          </View>
          <Keyboard onKeyPress={this.onKeyPress} />
        </View>
      </GradientBackground>
    );
  }
}
