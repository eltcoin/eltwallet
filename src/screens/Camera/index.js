import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Platform, SafeAreaView, StyleSheet, Vibration } from 'react-native';
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
    navigation: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
      state: PropTypes.shape({
        params: PropTypes.shape({
          onBarCodeRead: PropTypes.func.isRequired,
        }).isRequired,
      }).isRequired,
    }).isRequired,
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
          this.props.navigation.state.params.onBarCodeRead(
            this.state.scannedText,
          );
          this.props.navigation.goBack();
        },
      );
    }
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          title="Scan QR code"
          onBackPress={() => this.props.navigation.goBack()}
        />
        <RNCamera onBarCodeRead={this.onBarCodeRead} style={styles.preview} />
      </SafeAreaView>
    );
  }
}
