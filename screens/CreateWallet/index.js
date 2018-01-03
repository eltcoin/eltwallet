import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert, StyleSheet, View, AsyncStorage } from 'react-native';
import WalletUtils from '../../utils/wallet';
import {
  GradientBackground,
  Header,
  PinIndicator,
  PinKeyboard,
  Text,
} from '../../components';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 15,
  },
  explanatoryTextContainer: {
    height: 80,
    justifyContent: 'center',
    paddingHorizontal: 50,
  },
  explanatoryText: {
    color: '#fff',
    fontSize: 13,
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
    editMode: PropTypes.bool,
    navigator: PropTypes.shape({
      pop: PropTypes.func.isRequired,
      push: PropTypes.func.isRequired,
      resetTo: PropTypes.func.isRequired,
    }).isRequired,
    recoverMode: PropTypes.bool,
  };

  static defaultProps = {
    editMode: false,
    recoverMode: false,
  };

  static navigatorStyle = {
    navBarHidden: true,
    screenBackgroundColor: '#181724',
    statusBarColor: 'transparent',
    statusBarTextColorScheme: 'light',
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
          await AsyncStorage.setItem('@ELTWALLET:pinCode', this.state.pinCode);

          if (this.props.recoverMode) {
            this.props.navigator.push({
              screen: 'RecoverWallet',
              animationType: 'slide-horizontal',
            });
            return;
          } else if (!this.props.editMode) {
            await WalletUtils.generateWallet();
          }

          this.props.navigator.resetTo({
            screen: 'WalletHome',
          });
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

    const originalTitle = this.props.editMode ? 'Change PIN' : 'Create PIN';

    return (
      <GradientBackground>
        <View style={styles.container}>
          <Header
            onBackPress={() => this.props.navigator.pop()}
            title={this.state.isConfirmation ? 'Repeat PIN' : originalTitle}
          />
          <View style={styles.explanatoryTextContainer}>
            <Text style={styles.explanatoryText}>
              {this.state.isConfirmation
                ? "Just to make sure it's correct"
                : "This PIN will be used to access your ELTWALLET. If you forget it, you won't be able to access your ELT."}
            </Text>
          </View>

          <PinIndicator length={pinCode.length} />
          <PinKeyboard onKeyPress={this.onKeyPress} />
        </View>
      </GradientBackground>
    );
  }
}
