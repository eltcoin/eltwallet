import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Text from '../Text';
import arrow from './images/arrow.png';

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    paddingTop: 30,
    paddingHorizontal: 15,
  },
  centeredContainer: {
    paddingTop: 30,
    paddingHorizontal: 15,
    alignItems: 'center',
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
    onBackPress: PropTypes.func,
    title: PropTypes.string.isRequired,
  };

  static defaultProps = {
    onBackPress: null,
  };

  render() {
    return (
      <View
        style={
          this.props.onBackPress
            ? styles.headerContainer
            : styles.centeredContainer
        }
      >
        {this.props.onBackPress ? (
          <TouchableOpacity
            style={styles.headerExtremity}
            onPress={this.props.onBackPress}
          >
            <Image source={arrow} style={styles.headerArrow} />
          </TouchableOpacity>
        ) : null}
        <Text style={styles.headerText}>{this.props.title}</Text>
        <View style={styles.headerExtremity} />
      </View>
    );
  }
}
