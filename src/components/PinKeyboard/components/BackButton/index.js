import React, { Component } from 'react';
import { Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import PropTypes from 'prop-types';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import DialogAndroid from 'react-native-dialogs';
import Text from '../../../Text';
import arrowIcon from './images/arrow.png';
import touchIdIcon from './images/touchid.png';

const styles = StyleSheet.create({
  keyboardKey: {
    flex: 1,
    flexGrow: 1,
    paddingVertical: 20,
  },
  textPlaceholder: {
    color: 'transparent',
    fontSize: 40,
  },
  arrowKey: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowIcon: {
    height: 24,
    width: 24,
  },
  touchIdIcon: {
    height: 40,
    width: 40,
  },
});

export default class PinKeyboard extends Component {
  static propTypes = {
    onBackPress: PropTypes.func.isRequired,
    onAuthSuccess: PropTypes.func,
    showBackButton: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    onAuthSuccess: null,
  };

  state = {
    isTouchIdSupported: false,
  };

  componentDidMount() {
    if (this.props.onAuthSuccess) {
      this.checkTouchIdSupport();
    }
  }

  onTouchIdClick = async () => {
    let dialog;

    try {
      if (Platform.OS === 'android') {
        dialog = new DialogAndroid();

        dialog.set({
          title: 'Authentication Required',
          content: 'Touch fingerprint sensor to unlock your wallet',
          negativeColor: '#4D00FF',
          negativeText: 'Cancel',
          onNegative: () => {
            FingerprintScanner.release();
          },
        });

        dialog.show();

        await FingerprintScanner.authenticate({
          onAttempt: () => {},
        });

        this.props.onAuthSuccess();

        dialog.dismiss();
      } else {
        await FingerprintScanner.authenticate({
          description: 'Wallet access',
        });

        this.props.onAuthSuccess();
      }
    } catch (error) {
      if (dialog) {
        dialog.dismiss();
      }
    }
  };

  checkTouchIdSupport = async () => {
    try {
      const isSensorAvailable = await FingerprintScanner.isSensorAvailable();

      if (isSensorAvailable) {
        this.setState({
          isTouchIdSupported: true,
        });

        this.onTouchIdClick();
      }
    } catch (error) {
      // An error happened during biometric detection
    }
  };

  render() {
    if (this.props.showBackButton) {
      return (
        <TouchableOpacity
          style={[styles.keyboardKey, styles.arrowKey]}
          onPress={this.props.onBackPress}
        >
          <Image source={arrowIcon} style={styles.arrowIcon} />
        </TouchableOpacity>
      );
    }

    if (this.state.isTouchIdSupported) {
      return (
        <TouchableOpacity
          style={[styles.keyboardKey, styles.arrowKey]}
          onPress={this.onTouchIdClick}
        >
          <Image source={touchIdIcon} style={styles.touchIdIcon} />
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity style={styles.keyboardKey}>
        <Text style={styles.textPlaceholder}> 0 </Text>
      </TouchableOpacity>
    );
  }
}
