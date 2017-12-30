import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet, View } from 'react-native';
import range from 'lodash/range';
import emptyCircle from './images/emptyCircle.png';
import filledCircle from './images/filledCircle.png';

const styles = StyleSheet.create({
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

export default class PinIndicator extends Component {
  static propTypes = {
    length: PropTypes.number.isRequired,
  };

  render() {
    return (
      <View style={styles.dotsContainer}>
        {range(0, this.props.length).map(n => (
          <Image source={filledCircle} style={styles.dot} key={n} />
        ))}
        {range(0, 4 - this.props.length).map(n => (
          <Image source={emptyCircle} style={styles.dot} key={n} />
        ))}
      </View>
    );
  }
}
