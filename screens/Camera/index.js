import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import Camera from 'react-native-camera';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  preview: {
    flex: 1,
  },
});

export default class Home extends Component {
  static propTypes = {
    onBarCodeRead: PropTypes.func.isRequired,
  };

  static navigatorStyle = {
    navBarHidden: true,
    statusBarColor: 'transparent',
    statusBarTextColorScheme: 'light',
  };

  onBarCodeRead = e => {
    this.props.onBarCodeRead(e.data);
  };

  render() {
    return (
      <View style={styles.container}>
        <Camera onBarCodeRead={this.onBarCodeRead} style={styles.preview} />
      </View>
    );
  }
}
