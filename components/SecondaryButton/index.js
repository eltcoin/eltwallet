import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 20,
  },
  text: {
    backgroundColor: 'transparent',
    color: '#4D00FF',
    fontSize: 18,
  },
});

export default class SecondaryButton extends Component {
  static propTypes = {
    onPress: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
  };

  render() {
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={this.props.onPress}>
        <View style={styles.container}>
          <Text style={styles.text}>{this.props.text}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}
