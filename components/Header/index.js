import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import arrow from './images/arrow.png';

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    paddingTop: 30,
    paddingHorizontal: 15,
  },
  headerExtremity: {
    flex: 1,
  },
  headerText: {
    color: '#fff',
    fontSize: 27,
  },
  headerArrow: {
    height: 22,
    marginVertical: 4,
    width: 22,
  },
});

export default class Header extends Component {
  static propTypes = {
    onBackPress: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
  };

  render() {
    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.headerExtremity}
          onPress={this.props.onBackPress}
        >
          <Image source={arrow} style={styles.headerArrow} />
        </TouchableOpacity>
        <Text style={styles.headerText}>{this.props.title}</Text>
        <View style={styles.headerExtremity} />
      </View>
    );
  }
}
