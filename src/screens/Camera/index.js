import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Platform, Vibration } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { Header } from '../../components';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  preview: {
    flex: 1,
    marginTop: 15,
  },
});

export default class Home extends Component {
  static propTypes = {
    navigator: PropTypes.shape({
      pop: PropTypes.func.isRequired,
    }).isRequired,
    onBarCodeRead: PropTypes.func.isRequired,
  };

  static navigatorStyle = {
    navBarHidden: true,
    screenBackgroundColor: '#000',
    statusBarColor: 'transparent',
    statusBarTextColorScheme: 'light',
  };

  state = {
    scannedText: '',
  };

  onBarCodeRead = e => {
    if (!this.state.scannedText) {
      this.setState(
        {
          scannedText: e.data,
        },
        () => {
          if (Platform.OS === 'ios') {
            Vibration.vibrate(500, false);
          } else {
            Vibration.vibrate([0, 500], false);
          }
          this.props.onBarCodeRead(this.state.scannedText);
          this.props.navigator.pop();
        },
      );
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Header
          title="Scan QR code"
          onBackPress={() => this.props.navigator.pop()}
        />
        <RNCamera onBarCodeRead={this.onBarCodeRead} style={styles.preview} />
      </View>
    );
  }
}
