import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Swipeout from 'react-native-swipeout';
import Text from '../Text';
import arrow from './images/arrow.png';

const styles = StyleSheet.create({
  listContainer: {
    borderTopWidth: 1,
    borderColor: '#372F49',
    flex: 1,
    marginTop: 40,
  },
  rowContainer: {
    borderBottomWidth: 1,
    borderColor: '#372F49',
    paddingVertical: 30,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowText: {
    color: '#fff',
    fontSize: 18,
  },
  rowIcon: {
    height: 15,
    width: 15,
  },
});

export default class Menu extends Component {
  static propTypes = {
    options: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        onPress: PropTypes.func.isRequired,
        swipeToDelete: PropTypes.bool,
        onDeletePress: PropTypes.func,
      }),
    ).isRequired,
  };

  renderOption = (option, index) => {
    if (option.swipeToDelete) {
      const swipeoutButtons = [
        {
          onPress: option.onDeletePress,
          text: 'Delete',
          type: 'delete',
        },
      ];

      return (
        <Swipeout
          backgroundColor="transparent"
          right={swipeoutButtons}
          key={index}
        >
          <TouchableWithoutFeedback onPress={option.onPress}>
            <View style={styles.rowContainer}>
              <Text style={styles.rowText}>{option.title}</Text>
              <Image source={arrow} style={styles.rowIcon} />
            </View>
          </TouchableWithoutFeedback>
        </Swipeout>
      );
    }

    return (
      <TouchableOpacity onPress={option.onPress} key={index}>
        <View style={styles.rowContainer}>
          <Text style={styles.rowText}>{option.title}</Text>
          <Image source={arrow} style={styles.rowIcon} />
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <ScrollView style={styles.listContainer}>
        {this.props.options.map(this.renderOption)}
      </ScrollView>
    );
  }
}
