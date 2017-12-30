import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert, StyleSheet, View, AsyncStorage } from 'react-native';
import {
  GradientBackground,
  Header,
  PinIndicator,
  PinKeyboard,
} from '../../components';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 15,
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

export default class PinCode extends Component {
  static propTypes = {
    navigator: PropTypes.shape({
      resetTo: PropTypes.func.isRequired,
    }).isRequired,
  };

  static navigatorStyle = {
    navBarHidden: true,
    statusBarTextColorScheme: 'light',
  };

  state = {
    pinCode: '',
  };

  onKeyPress = n => {
    this.updatePinCode(n);
  };

  updatePinCode = n => {
    this.setState(
      {
        pinCode: `${this.state.pinCode}${n}`,
      },
      async () => {
        if (this.state.pinCode.length === 4) {
          const pinCode = await AsyncStorage.getItem('@ELTWALLET:pinCode');

          if (this.state.pinCode === pinCode) {
            this.props.navigator.resetTo({
              screen: 'WalletHome',
            });
          } else {
            this.setState(
              {
                pinCode: '',
              },
              () => {
                Alert.alert('Your PIN code is incorrect. Please try again.');
              },
            );
          }
        }
      },
    );
  };

  render() {
    return (
      <GradientBackground>
        <View style={styles.container}>
          <Header title="Enter Pin" />
          <PinIndicator length={this.state.pinCode.length} />
          <PinKeyboard onKeyPress={this.onKeyPress} />
        </View>
      </GradientBackground>
    );
  }
}
