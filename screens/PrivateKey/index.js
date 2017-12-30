import React, { Component } from 'react';
import { AsyncStorage, Clipboard, StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { GradientBackground, Header, SecondaryButton } from '../../components';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  privateKeyTitle: {
    paddingHorizontal: 15,
    color: '#fff',
    textAlign: 'center',
    paddingBottom: 20,
    fontSize: 18,
  },
  privateKey: {
    paddingHorizontal: 15,
    color: '#9d9d9d',
    textAlign: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 15,
    paddingTop: 40,
  },
});

export default class PrivateKey extends Component {
  static propTypes = {
    navigator: PropTypes.shape({
      pop: PropTypes.func.isRequired,
    }).isRequired,
  };

  static navigatorStyle = {
    navBarHidden: true,
    statusBarTextColorScheme: 'light',
  };

  state = {
    privateKey: '',
  };

  componentDidMount() {
    this.fetchPrivateKey();
  }

  fetchPrivateKey = async () => {
    const privateKey = await AsyncStorage.getItem('@ELTWALLET:privateKey');

    this.setState({
      privateKey,
    });
  };

  render() {
    return (
      <GradientBackground>
        <View style={styles.container}>
          <Header
            onBackPress={() => this.props.navigator.pop()}
            title="Private key"
          />
          <View>
            <Text style={styles.privateKeyTitle}>Private key</Text>
            <Text style={styles.privateKey}>{this.state.privateKey}</Text>
          </View>
          <View style={styles.buttonContainer}>
            <SecondaryButton
              onPress={() => {
                Clipboard.setString(this.state.privateKey);
              }}
              text="Copy to clipboard"
            />
          </View>
        </View>
      </GradientBackground>
    );
  }
}
