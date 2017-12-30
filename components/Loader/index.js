import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default class Loader extends Component {
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4D00FF" />
      </View>
    );
  }
}
