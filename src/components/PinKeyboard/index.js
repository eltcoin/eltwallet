import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import chunk from 'lodash/chunk';
import range from 'lodash/range';
import Text from '../Text';
import BackButton from './components/BackButton';

const styles = StyleSheet.create({
  keyboardRow: {
    flexDirection: 'row',
  },
  keyboardKey: {
    flex: 1,
    flexGrow: 1,
    paddingVertical: 20,
  },
  textPlaceholder: {
    color: 'transparent',
    fontSize: 40,
  },
  keyboardText: {
    color: '#fff',
    fontSize: 40,
    textAlign: 'center',
  },
});

export default class PinKeyboard extends Component {
  static propTypes = {
    onAuthSuccess: PropTypes.func,
    onBackPress: PropTypes.func.isRequired,
    onKeyPress: PropTypes.func.isRequired,
    showBackButton: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    onAuthSuccess: null,
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
          <BackButton
            onAuthSuccess={this.props.onAuthSuccess}
            onBackPress={this.props.onBackPress}
            showBackButton={this.props.showBackButton}
          />
        </View>
      </View>
    );
  }
}
