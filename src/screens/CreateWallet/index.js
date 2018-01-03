import React, { Component } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import WalletUtils from '../../utils/wallet';
import {
  GradientBackground,
  Header,
  PinIndicator,
  PinKeyboard,
  Text,
} from '../../components';
import { SET_PIN_CODE } from '../../config/actionTypes';

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

class CreateWallet extends Component {
  static propTypes = {
    editMode: PropTypes.bool,
    navigator: PropTypes.shape({
      pop: PropTypes.func.isRequired,
      push: PropTypes.func.isRequired,
      resetTo: PropTypes.func.isRequired,
    }).isRequired,
    recoverMode: PropTypes.bool,
    setPinCode: PropTypes.func.isRequired,
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

  onBackPress = () => {
    if (!this.state.isConfirmation) {
      this.setState({
        pinCode: this.state.pinCode.slice(0, -1),
      });
    } else {
      this.setState({
        confirmationPinCode: this.state.confirmationPinCode.slice(0, -1),
      });
    }
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
          this.props.setPinCode(this.state.pinCode);

          if (this.props.recoverMode) {
            this.props.navigator.push({
              screen: 'RecoverWallet',
              animationType: 'slide-horizontal',
            });
            return;
          } else if (!this.props.editMode) {
            WalletUtils.generateWallet();
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
          <PinKeyboard
            onBackPress={this.onBackPress}
            onKeyPress={this.onKeyPress}
            showBackButton={pinCode.length > 0}
          />
        </View>
      </GradientBackground>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setPinCode: pinCode => dispatch({ type: SET_PIN_CODE, pinCode }),
});

export default connect(null, mapDispatchToProps)(CreateWallet);
