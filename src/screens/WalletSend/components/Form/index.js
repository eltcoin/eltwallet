import React, { Component } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import PropTypes from 'prop-types';
import { Text } from '../../../../components';
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

class Form extends Component {
  static propTypes = {
    address: PropTypes.string.isRequired,
    amount: PropTypes.string.isRequired,
    onAddressChange: PropTypes.func.isRequired,
    onAmountChange: PropTypes.func.isRequired,
    onCameraPress: PropTypes.func.isRequired,
    onTokenChangeIconPress: PropTypes.func.isRequired,
    selectedToken: PropTypes.shape({
      name: PropTypes.string.isRequired,
      symbol: PropTypes.string.isRequired,
    }).isRequired,
  };

  render() {
    const {
      address,
      amount,
      onAddressChange,
      onAmountChange,
      onCameraPress,
      onTokenChangeIconPress,
      selectedToken,
    } = this.props;

    const ScrollContainer =
      Platform.OS === 'ios' ? KeyboardAwareScrollView : ScrollView;

    return (
      <ScrollContainer
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'center',
        }}
      >
        <View style={styles.formElement}>
          <Text style={styles.formLabel}>To</Text>
          <View style={styles.formInputRow}>
            <TextInput
              autoCorrect={false}
              onChangeText={onAddressChange}
              placeholder="0x..."
              placeholderTextColor="#9d9d9d"
              onSubmitEditing={() => {
                this.amountInput.focus();
              }}
              ref={input => {
                this.addressInput = input;
              }}
              returnKeyType="next"
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
              ref={input => {
                this.amountInput = input;
              }}
              returnKeyType="done"
              selectionColor="#4D00FF"
              style={styles.formInput}
              underlineColorAndroid="transparent"
              value={amount}
            />
            <TouchableOpacity
              onPress={onTokenChangeIconPress}
              style={styles.tokenPicker}
            >
              <Text style={styles.tokenSymbol}>{selectedToken.symbol}</Text>
              <Image source={arrowIcon} style={styles.arrowIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollContainer>
    );
  }
}

const mapStateToProps = state => ({
  selectedToken: state.selectedToken,
});

export default connect(mapStateToProps)(Form);
