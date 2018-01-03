import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import Camera from 'react-native-camera';
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

  onBarCodeRead = e => {
    this.props.onBarCodeRead(e.data);
  };

  render() {
    return (
      <View style={styles.container}>
        <Header
          title="Scan QR code"
          onBackPress={() => this.props.navigator.pop()}
        />
        <Camera onBarCodeRead={this.onBarCodeRead} style={styles.preview} />
      </View>
    );
  }
}
