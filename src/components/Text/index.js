import React, { Component } from 'react';
import { Platform, StyleSheet, Text as RNText } from 'react-native';
import PropTypes from 'prop-types';

function applyLetterSpacing(string, letterSpacing) {
  if (
    Platform.OS === 'ios' ||
    (Platform.OS === 'android' && Platform.Version <= 16) ||
    letterSpacing === 0
  ) {
    return string;
  }

  return string.split('').join('\u200A'.repeat(letterSpacing));
}

const styles = StyleSheet.create({
  defaultStyle: {
    fontFamily: 'Varela Round',
  },
});

export default class Text extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    letterSpacing: PropTypes.number,
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.number]).isRequired,
  };

  static defaultProps = {
    letterSpacing: 0,
  };

  render() {
    return (
      <RNText style={[styles.defaultStyle, this.props.style]}>
        {applyLetterSpacing(this.props.children, this.props.letterSpacing)}
      </RNText>
    );
  }
}
