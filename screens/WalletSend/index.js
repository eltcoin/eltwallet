import React, { Component } from 'react';
import {
  Alert,
  AsyncStorage,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import ProviderEngine from 'web3-provider-engine';
import WalletSubprovider from 'web3-provider-engine/subproviders/wallet';
import Web3Subprovider from 'web3-provider-engine/subproviders/web3';
import Web3 from 'web3';
import EthereumJsWallet from 'ethereumjs-wallet';
import { GradientBackground, Header, SecondaryButton } from '../../components';
import { availableTokens } from '../../utils/constants';
import cameraIcon from './images/camera.png';

const erc20Abi = [
  {
    name: 'balanceOf',
    type: 'function',
    constant: true,
    payable: false,

    inputs: [
      {
        name: '_owner',
        type: 'address',
      },
    ],

    outputs: [
      {
        name: 'balance',
        type: 'uint256',
      },
    ],
  },
  {
    name: 'transfer',
    type: 'function',
    constant: false,
    payable: false,
    inputs: [
      {
        name: '_to',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      },
    ],

    outputs: [
      {
        name: 'success',
        type: 'bool',
      },
    ],
  },
];

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

export default class WalletSend extends Component {
  static propTypes = {
    navigator: PropTypes.shape({
      dismissModal: PropTypes.func.isRequired,
      pop: PropTypes.func.isRequired,
      push: PropTypes.func.isRequired,
      showModal: PropTypes.func.isRequired,
    }).isRequired,
  };

  static navigatorStyle = {
    navBarHidden: true,
    statusBarTextColorScheme: 'light',
  };

  state = {
    address: '',
    amount: '',
    selectedToken: availableTokens[0],
  };

  onBarCodeRead = address => {
    this.props.navigator.dismissModal();

    this.setState({
      address,
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

  startTransaction = async () => {
    const privateKey = await AsyncStorage.getItem('@ELTWALLET:privateKey');

    const wallet = EthereumJsWallet.fromPrivateKey(
      Buffer.from(privateKey, 'hex'),
    );

    const engine = new ProviderEngine();

    engine.addProvider(new WalletSubprovider(wallet, {}));
    engine.addProvider(
      new Web3Subprovider(
        new Web3.providers.HttpProvider('https://api.myetherapi.com/eth'),
      ),
    );

    engine.start();

    const web3 = new Web3(engine);

    if (!web3.isAddress(this.state.address)) {
      Alert.alert('The address is invalid, please try again.');
      return;
    }

    const transactionData = await new Promise((resolve, reject) => {
      try {
        if (this.state.selectedToken.symbol === 'ETH') {
          web3.eth.sendTransaction(
            {
              to: this.state.address,
              value:
                this.state.amount *
                Math.pow(10, this.state.selectedToken.decimals),
            },
            (err, transaction) => {
              if (err) reject(err);

              resolve(transaction);
            },
          );
        } else {
          web3.eth
            .contract(erc20Abi)
            .at(this.state.selectedToken.contractAddress)
            .transfer(
              this.state.address,
              this.state.amount *
                Math.pow(10, this.state.selectedToken.decimals),
              {
                from: wallet.getAddressString(),
              },
              (err, transaction) => {
                if (err) reject(err);

                resolve(transaction);
              },
            );
        }
      } catch (error) {
        console.error(error);
        Alert.alert(error);
      }
    });
  };

  render() {
    return (
      <GradientBackground>
        <View style={styles.container}>
          <Header onBackPress={() => this.props.navigator.pop()} title="Send" />
          <View>
            <View style={styles.formElement}>
              <Text style={styles.formLabel}>To</Text>
              <View style={styles.formInputRow}>
                <TextInput
                  autoCorrect={false}
                  onChangeText={address => this.setState({ address })}
                  placeholder="Address"
                  placeholderTextColor="#9d9d9d"
                  selectionColor="#4D00FF"
                  style={styles.formInput}
                  underlineColorAndroid="transparent"
                  value={this.state.address}
                />
                <TouchableOpacity onPress={this.onCameraPress}>
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
                  onChangeText={amount => this.setState({ amount })}
                  placeholder="1000"
                  placeholderTextColor="#9d9d9d"
                  selectionColor="#4D00FF"
                  style={styles.formInput}
                  underlineColorAndroid="transparent"
                  value={this.state.amount}
                />
              </View>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <SecondaryButton
              onPress={this.startTransaction}
              disabled={this.state.address === '' || this.state.amount === ''}
              text="Send"
            />
          </View>
        </View>
      </GradientBackground>
    );
  }
}
