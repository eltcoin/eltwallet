import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  View,
} from 'react-native';
import { GradientBackground, Header, SecondaryButton } from '../../components';
import WalletUtils from '../../utils/wallet';
import cameraIcon from './images/camera.png';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
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
    height: 50,
    width: '90%',
  },
  cameraIcon: {
    height: 23,
    marginRight: 5,
    width: 30,
  },
  buttonContainer: {
    paddingHorizontal: 15,
    paddingTop: 40,
  },
});

export default class CreateWallet extends Component {
  static propTypes = {
    navigator: PropTypes.shape({
      dismissModal: PropTypes.func.isRequired,
      pop: PropTypes.func.isRequired,
      resetTo: PropTypes.func.isRequired,
      showModal: PropTypes.func.isRequired,
    }).isRequired,
  };

  static navigatorStyle = {
    navBarHidden: true,
    statusBarTextColorScheme: 'light',
  };

  state = {
    privateKey: '',
  };

  onBarCodeRead = privateKey => {
    this.props.navigator.dismissModal();

    this.setState({
      privateKey,
    });
  };

  onCameraPress = () => {
    this.props.navigator.showModal({
      screen: 'Camera',
      passProps: {
        onBarCodeRead: this.onBarCodeRead,
      },
    });
  };

  importWallet = async () => {
    await WalletUtils.restoreWallet(this.state.privateKey);

    this.props.navigator.resetTo({
      screen: 'WalletHome',
    });
  };

  render() {
    return (
      <GradientBackground>
        <View style={styles.container}>
          <Header
            onBackPress={() => this.props.navigator.pop()}
            title="Recover wallet"
          />
          <View>
            <View style={styles.formElement}>
              <Text style={styles.formLabel}>Private key</Text>
              <View style={styles.formInputRow}>
                <TextInput
                  autoCorrect={false}
                  onChangeText={privateKey => this.setState({ privateKey })}
                  placeholder="Address"
                  placeholderTextColor="#9d9d9d"
                  selectionColor="#4D00FF"
                  style={styles.formInput}
                  underlineColorAndroid="transparent"
                  value={this.state.privateKey}
                />
                <TouchableOpacity onPress={this.onCameraPress}>
                  <Image source={cameraIcon} style={styles.cameraIcon} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <SecondaryButton
              onPress={this.importWallet}
              disabled={this.state.privateKey === ''}
              text="Import wallet"
            />
          </View>
        </View>
      </GradientBackground>
    );
  }
}
