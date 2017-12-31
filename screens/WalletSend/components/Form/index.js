import React, { Component } from 'react';
import {
  ActionSheetIOS,
  Image,
  Platform,
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import StorageUtils from '../../../../utils/storage';
import { Text, TokenPicker } from '../../../../components';
import cameraIcon from './images/camera.png';
import arrowIcon from './images/arrow.png';

const styles = StyleSheet.create({
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
    width: 30,
  },
  tokenPicker: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  tokenSymbol: {
    color: '#fff',
    fontSize: 18,
  },
  arrowIcon: {
    height: 10,
    width: 11,
    marginLeft: 10,
  },
});

export default class WalletSend extends Component {
  static propTypes = {
    address: PropTypes.string.isRequired,
    amount: PropTypes.string.isRequired,
    onAddNewToken: PropTypes.func.isRequired,
    onAddressChange: PropTypes.func.isRequired,
    onAmountChange: PropTypes.func.isRequired,
    onCameraPress: PropTypes.func.isRequired,
    onTokenChange: PropTypes.func.isRequired,
    selectedToken: PropTypes.shape({
      name: PropTypes.string.isRequired,
      symbol: PropTypes.string.isRequired,
    }).isRequired,
  };

  state = {
    availableTokens: [],
  };

  componentDidMount() {
    if (Platform.OS === 'ios') {
      this.fetchAvailableTokens();
    }
  }

  onTokenChange = index => {
    if (index === this.state.availableTokens.length) {
      this.props.onAddNewToken();
      return;
    }

    const selectedToken = this.state.availableTokens[index];

    this.props.onTokenChange(selectedToken);

    StorageUtils.setDefaultToken(selectedToken);
  };

  async fetchAvailableTokens() {
    const availableTokens = await StorageUtils.getAvailableTokens();

    this.setState({
      availableTokens,
    });
  }

  showActionSheet = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: this.state.availableTokens
          .map(token => token.name)
          .concat(['Add new token']),
      },
      this.onTokenChange,
    );
  };

  render() {
    const {
      address,
      amount,
      onAddNewToken,
      onAddressChange,
      onAmountChange,
      onCameraPress,
      onTokenChange,
      selectedToken,
    } = this.props;

    return (
      <View>
        <View style={styles.formElement}>
          <Text style={styles.formLabel}>To</Text>
          <View style={styles.formInputRow}>
            <TextInput
              autoCorrect={false}
              onChangeText={onAddressChange}
              placeholder="Address"
              placeholderTextColor="#9d9d9d"
              selectionColor="#4D00FF"
              style={styles.formInput}
              underlineColorAndroid="transparent"
              value={address}
            />
            <TouchableOpacity onPress={onCameraPress}>
              <Image source={cameraIcon} style={styles.cameraIcon} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.formElement}>
          <Text style={styles.formLabel}>Amount</Text>
          <View style={styles.formInputRow}>
            <TextInput
              autoCorrect={false}
              keyboardType="numeric"
              onChangeText={onAmountChange}
              placeholder="1000"
              placeholderTextColor="#9d9d9d"
              selectionColor="#4D00FF"
              style={styles.formInput}
              underlineColorAndroid="transparent"
              value={amount}
            />
            <TouchableOpacity
              onPress={Platform.OS === 'ios' ? this.showActionSheet : null}
              style={styles.tokenPicker}
            >
              <Text style={styles.tokenSymbol}>{selectedToken.symbol}</Text>
              <Image source={arrowIcon} style={styles.arrowIcon} />
              {Platform.OS === 'ios' ? null : (
                <TokenPicker
                  onAddNewToken={onAddNewToken}
                  onTokenChange={onTokenChange}
                  selectedToken={selectedToken}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
