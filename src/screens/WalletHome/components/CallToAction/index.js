import React, { Component } from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { Text } from '../../../../components';
import crossIcon from './images/cross.png';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    borderRadius: 8,
    margin: 10,
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  crossIconContainer: {
    padding: 5,
    position: 'absolute',
    right: 5,
    top: 5,
    zIndex: 1,
  },
  crossIcon: {
    height: 12,
    width: 12,
  },
  title: {
    color: '#fff',
  },
  subtitle: {
    color: '#9D9D9D',
    fontSize: 12,
    marginTop: 5,
  },
});

export default class CallToAction extends Component {
  static propTypes = {
    onDismiss: PropTypes.func.isRequired,
    onPress: PropTypes.func.isRequired,
  };

  render() {
    return (
      <TouchableOpacity
        style={styles.container}
        activeOpacity={0.8}
        onPress={this.props.onPress}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.crossIconContainer}
          onPress={this.props.onDismiss}
        >
          <Image source={crossIcon} style={styles.crossIcon} />
        </TouchableOpacity>
        <Text style={styles.title}>Security alert</Text>
        <Text style={styles.subtitle}>Backup your wallet</Text>
      </TouchableOpacity>
    );
  }
}
