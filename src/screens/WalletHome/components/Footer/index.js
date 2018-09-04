import React, { Component } from 'react';
import { Image, StyleSheet, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { Text } from '../../../../components';
import sendIcon from './images/send.png';
import qrcodeIcon from './images/qrcode.png';
import signIcon from './images/sign.png';

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
    width: '33%',
  },
  sendButton: {
    borderRightWidth: 1,
  },
  receiveButton: {
    borderLeftWidth: 1,
  },
  signButton: {
    backgroundColor: 'rgba(0,0,0,0.33)',
  },
});

export default class Footer extends Component {
  static propTypes = {
    onReceivePress: PropTypes.func.isRequired,
    onSendPress: PropTypes.func.isRequired,
    onSignPress: PropTypes.func.isRequired,
  };

  render() {
    const { onReceivePress, onSendPress, onSignPress } = this.props;

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
          onPress={onSignPress}
          style={[styles.button, styles.signButton]}
        >
          <Image style={styles.buttonIcon} source={signIcon} />
          <Text style={styles.buttonText}>Authenticate</Text>
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
