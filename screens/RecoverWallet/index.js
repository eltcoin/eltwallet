import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  View,
  Alert,
} from 'react-native';
import {
  GradientBackground,
  Header,
  SecondaryButton,
  Text,
} from '../../components';
import AnalyticsUtils from '../../utils/analytics';
import WalletUtils from '../../utils/wallet';
import cameraIcon from './images/camera.png';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 15,
  },
  formElement: {
    borderBottomColor: '#3a3a3a',
    borderBottomWidth: 1,
    paddingHorizontal: 15,
    paddingTop: 30,
    paddingBottom: 15,
  },
  formLabel: {
    color: '#9d9d9d',
    paddingLeft: 4,
  },
  formInputRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  formInput: {
    color: '#fff',
    flex: 1,
    flexGrow: 1,
    fontFamily: 'Varela Round',
    fontSize: 25,
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
    screenBackgroundColor: '#181724',
    statusBarColor: 'transparent',
    statusBarTextColorScheme: 'light',
  };

  state = {
    privateKey: '',
  };

  onBarCodeRead = privateKey => {
    this.props.navigator.dismissModal();

    AnalyticsUtils.trackEvent('Read private key QR code');

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
    try {
      WalletUtils.restoreWallet(this.state.privateKey);
    } catch (error) {
      Alert.alert('Your private key is invalid. Please try again.');
      return;
    }

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
                  placeholder="0x..."
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
