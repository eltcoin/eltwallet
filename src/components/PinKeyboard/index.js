import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import chunk from 'lodash/chunk';
import range from 'lodash/range';
import Text from '../Text';
import arrow from './images/arrow.png';

const styles = StyleSheet.create({
  keyboardRow: {
    flexDirection: 'row',
  },
  keyboardKey: {
    flex: 1,
    flexGrow: 1,
    paddingVertical: 20,
  },
  arrowKey: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyboardText: {
    color: '#fff',
    fontSize: 40,
    textAlign: 'center',
  },
  textPlaceholder: {
    color: 'transparent',
    fontSize: 40,
  },
  arrowIcon: {
    height: 24,
    width: 24,
  },
});

export default class PinKeyboard extends Component {
  static propTypes = {
    onBackPress: PropTypes.func.isRequired,
    onKeyPress: PropTypes.func.isRequired,
    showBackButton: PropTypes.bool.isRequired,
  };

  render() {
    return (
      <View>
        {chunk(range(1, 10), 3).map((numbersGroup, index) => (
          <View style={styles.keyboardRow} key={index}>
            {numbersGroup.map((number, index2) => (
              <TouchableOpacity
                style={styles.keyboardKey}
                key={index2}
                onPress={() => {
                  this.props.onKeyPress(number);
                }}
              >
                <Text style={styles.keyboardText}>{number}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
        <View style={styles.keyboardRow}>
          <TouchableOpacity style={styles.keyboardKey}>
            <Text style={styles.textPlaceholder}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.keyboardKey}
            onPress={() => {
              this.props.onKeyPress(0);
            }}
          >
            <Text style={styles.keyboardText}>0</Text>
          </TouchableOpacity>
          {this.props.showBackButton ? (
            <TouchableOpacity
              style={[styles.keyboardKey, styles.arrowKey]}
              onPress={() => {
                this.props.onBackPress();
              }}
            >
              <Image source={arrow} style={styles.arrowIcon} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.keyboardKey}>
              <Text style={styles.textPlaceholder}>0</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
}
