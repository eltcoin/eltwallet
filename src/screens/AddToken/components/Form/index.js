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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import PropTypes from 'prop-types';
import { Text } from '../../../../components';
import cameraIcon from './images/camera.png';

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
});

export default class Form extends Component {
  static propTypes = {
    contractAddress: PropTypes.string.isRequired,
    decimals: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    onCameraPress: PropTypes.func.isRequired,
    onContractAddressChange: PropTypes.func.isRequired,
    onDecimalsChange: PropTypes.func.isRequired,
    onNameChange: PropTypes.func.isRequired,
    onSymbolChange: PropTypes.func.isRequired,
    symbol: PropTypes.string.isRequired,
  };

  render() {
    const {
      contractAddress,
      decimals,
      name,
      onCameraPress,
      onContractAddressChange,
      onDecimalsChange,
      onNameChange,
      onSymbolChange,
      symbol,
    } = this.props;

    const ScrollContainer =
      Platform.OS === 'ios' ? KeyboardAwareScrollView : ScrollView;

    return (
      <ScrollContainer
        contentContainerStyle={{
          flex: Platform.OS === 'ios' ? 1 : null,
          justifyContent: 'center',
        }}
      >
        <View style={styles.formElement}>
          <Text style={styles.formLabel}>Contract address</Text>
          <View style={styles.formInputRow}>
            <TextInput
              autoCorrect={false}
              onChangeText={onContractAddressChange}
              onSubmitEditing={() => {
                this.nameInput.focus();
              }}
              placeholder="0x..."
              placeholderTextColor="#9d9d9d"
              ref={input => {
                this.addressInput = input;
              }}
              returnKeyType="next"
              selectionColor="#4D00FF"
              style={styles.formInput}
              underlineColorAndroid="transparent"
              value={contractAddress}
            />
            <TouchableOpacity onPress={onCameraPress}>
              <Image source={cameraIcon} style={styles.cameraIcon} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.formElement}>
          <Text style={styles.formLabel}>Name</Text>
          <View style={styles.formInputRow}>
            <TextInput
              autoCorrect={false}
              onChangeText={onNameChange}
              onSubmitEditing={() => {
                this.symbolInput.focus();
              }}
              placeholder="My token"
              placeholderTextColor="#9d9d9d"
              ref={input => {
                this.nameInput = input;
              }}
              returnKeyType="next"
              selectionColor="#4D00FF"
              style={styles.formInput}
              underlineColorAndroid="transparent"
              value={name}
            />
          </View>
        </View>
        <View style={styles.formElement}>
          <Text style={styles.formLabel}>Symbol</Text>
          <View style={styles.formInputRow}>
            <TextInput
              autoCorrect={false}
              onChangeText={onSymbolChange}
              onSubmitEditing={() => {
                this.decimalsInput.focus();
              }}
              placeholder="ELT"
              placeholderTextColor="#9d9d9d"
              ref={input => {
                this.symbolInput = input;
              }}
              returnKeyType="next"
              selectionColor="#4D00FF"
              style={styles.formInput}
              underlineColorAndroid="transparent"
              value={symbol}
            />
          </View>
        </View>
        <View style={styles.formElement}>
          <Text style={styles.formLabel}>Decimals</Text>
          <View style={styles.formInputRow}>
            <TextInput
              autoCorrect={false}
              keyboardType="numeric"
              onChangeText={onDecimalsChange}
              placeholder="18"
              placeholderTextColor="#9d9d9d"
              ref={input => {
                this.decimalsInput = input;
              }}
              returnKeyType="done"
              selectionColor="#4D00FF"
              style={styles.formInput}
              underlineColorAndroid="transparent"
              value={decimals}
            />
          </View>
        </View>
      </ScrollContainer>
    );
  }
}
