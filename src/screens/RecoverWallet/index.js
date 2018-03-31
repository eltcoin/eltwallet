import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
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
    paddingTop: Platform.OS === 'ios' ? 20 : 30,
    paddingBottom: 15,
  },
  formLabel: {
    color: '#9d9d9d',
    paddingLeft: Platform.OS === 'ios' ? 0 : 4,
    paddingBottom: Platform.OS === 'ios' ? 10 : 0,
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
    navigation: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
      navigate: PropTypes.func.isRequired,
    }).isRequired,
  };

  state = {
    privateKey: '',
  };

  onBarCodeRead = privateKey => {
    AnalyticsUtils.trackEvent('Read private key QR code');

    this.setState({
      privateKey,
    });
  };

  onCameraPress = () => {
    this.props.navigation.navigate('Camera', {
      onBarCodeRead: this.onBarCodeRead,
    });
  };

  importWallet = async () => {
    try {
      WalletUtils.restoreWallet(this.state.privateKey);
    } catch (error) {
      Alert.alert(
        'Private key',
        'Your private key is invalid. Please try again.',
      );
      return;
    }

    this.props.navigation.navigate('Wallet');
  };

  render() {
    return (
      <GradientBackground>
        <SafeAreaView style={styles.container}>
          <Header
            onBackPress={() => this.props.navigation.goBack()}
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
                  returnKeyType="done"
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
        </SafeAreaView>
      </GradientBackground>
    );
  }
}
