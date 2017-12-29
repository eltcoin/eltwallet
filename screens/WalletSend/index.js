import React, { Component } from 'react';
import {
  AsyncStorage,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { Header, SecondaryButton } from '../../components';
import cameraIcon from './images/camera.png';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0C0B0C',
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  formElement: {
    borderBottomColor: '#3a3a3a',
    borderBottomWidth: 1,
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  formLabel: {
    color: '#9d9d9d',
  },
  formInputRow: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 10,
  },
  formInput: {
    color: '#fff',
    flexGrow: 1,
    fontSize: 25,
    height: 40,
  },
  cameraIcon: {
    height: 22,
    marginRight: 5,
    width: 29,
  },
  buttonContainer: {
    paddingHorizontal: 15,
    paddingTop: 40,
  },
});

export default class WalletSend extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      dispatch: PropTypes.func.isRequired,
      goBack: PropTypes.func.isRequired,
    }).isRequired,
  };

  state = {
    address: '',
    amount: '',
    gasLimit: '',
    walletAddress: '',
  };

  componentDidMount() {
    this.fetchWalletAddress();
  }

  fetchWalletAddress = async () => {
    const walletAddress = await AsyncStorage.getItem('@ELTWALLET:address');

    this.setState({
      walletAddress,
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <Header
          onBackPress={() => this.props.navigation.goBack()}
          title="Send"
        />
        <View>
          <View style={styles.formElement}>
            <Text style={styles.formLabel}>To</Text>
            <View style={styles.formInputRow}>
              <TextInput
                onChangeText={address => this.setState({ address })}
                placeholder="Address"
                placeholderTextColor="#9d9d9d"
                selectionColor="#4D00FF"
                style={styles.formInput}
                value={this.state.address}
              />
              <Image source={cameraIcon} style={styles.cameraIcon} />
            </View>
          </View>
          <View style={styles.formElement}>
            <Text style={styles.formLabel}>Amount</Text>
            <View style={styles.formInputRow}>
              <TextInput
                onChangeText={amount => this.setState({ amount })}
                placeholder="1000"
                placeholderTextColor="#9d9d9d"
                selectionColor="#4D00FF"
                style={styles.formInput}
                value={this.state.amount}
              />
            </View>
          </View>
          <View style={styles.formElement}>
            <Text style={styles.formLabel}>Gas limit</Text>
            <View style={styles.formInputRow}>
              <TextInput
                onChangeText={gasLimit => this.setState({ gasLimit })}
                placeholder="20000"
                placeholderTextColor="#9d9d9d"
                selectionColor="#4D00FF"
                style={styles.formInput}
                value={this.state.gasLimit}
              />
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <SecondaryButton onPress={() => {}} text="Send" />
        </View>
      </View>
    );
  }
}
