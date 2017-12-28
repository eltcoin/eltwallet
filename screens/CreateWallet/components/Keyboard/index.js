import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import chunk from 'lodash/chunk';
import range from 'lodash/range';

const styles = StyleSheet.create({
  keyboardRow: {
    flexDirection: 'row',
  },
  keyboardKey: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  keyboardText: {
    color: '#fff',
    fontSize: 40,
    textAlign: 'center',
  },
});

export default class Keyboard extends Component {
  static propTypes = {
    onKeyPress: PropTypes.func.isRequired,
  };

  render() {
    return (
      <View>
        {chunk(range(1, 10).concat(0), 3).map((numbersGroup, index) => (
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
      </View>
    );
  }
}
