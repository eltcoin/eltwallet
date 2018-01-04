import React, { Component } from 'react';
import { Image, StyleSheet, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { Text } from '../../../../components';
import sendIcon from './images/send.png';
import qrcodeIcon from './images/qrcode.png';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderTopColor: '#3C3749',
    borderTopWidth: 2,
    flexDirection: 'row',
    width: '100%',
  },
  buttonIcon: {
    height: 18,
    width: 18,
  },
  buttonText: {
    color: '#9D9D9D',
    paddingTop: 5,
  },
  button: {
    alignItems: 'center',
    borderColor: '#3C3749',
    paddingVertical: 15,
    width: '50%',
  },
  sendButton: {
    borderRightWidth: 1,
  },
  receiveButton: {
    borderLeftWidth: 1,
  },
});

export default class Footer extends Component {
  static propTypes = {
    onReceivePress: PropTypes.func.isRequired,
    onSendPress: PropTypes.func.isRequired,
  };

  render() {
    const { onReceivePress, onSendPress } = this.props;

    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={onSendPress}
          style={[styles.button, styles.sendButton]}
        >
          <Image style={styles.buttonIcon} source={sendIcon} />
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onReceivePress}
          style={[styles.button, styles.receiveButton]}
        >
          <Image style={styles.buttonIcon} source={qrcodeIcon} />
          <Text style={styles.buttonText}>Receive</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
