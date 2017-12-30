import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { GradientBackground, Header, SecondaryButton } from '../../components';
import Form from './components/Form';
import StorageUtils from '../../utils/storage';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  buttonContainer: {
    paddingHorizontal: 15,
    paddingTop: 40,
  },
});

export default class AddToken extends Component {
  static propTypes = {
    navigator: PropTypes.shape({
      dismissModal: PropTypes.func.isRequired,
      pop: PropTypes.func.isRequired,
      push: PropTypes.func.isRequired,
      showModal: PropTypes.func.isRequired,
    }).isRequired,
    onTokenChange: PropTypes.func.isRequired,
  };

  static navigatorStyle = {
    navBarHidden: true,
    statusBarTextColorScheme: 'light',
  };

  state = {
    contractAddress: '',
    decimals: '',
    name: '',
    symbol: '',
  };

  onBarCodeRead = contractAddress => {
    this.props.navigator.dismissModal();

    this.setState(
      {
        contractAddress,
      },
      () => {
        fetch(
          `https://api.ethplorer.io/getTokenInfo/${contractAddress}?apiKey=freekey`,
        )
          .then(response => response.json())
          .then(data => {
            this.setState({
              name: data.name || '',
              symbol: data.symbol || '',
              decimals: data.decimals ? data.decimals.toString() : '',
            });
          });
      },
    );
  };

  onCameraPress = () => {
    this.props.navigator.showModal({
      screen: 'Camera',
      passProps: {
        onBarCodeRead: this.onBarCodeRead,
      },
    });
  };

  addressIsValid = () =>
    /^0x([A-Fa-f0-9]{40})$/.test(this.state.contractAddress);

  addToken = async () => {
    const token = {
      contractAddress: this.state.contractAddress,
      decimals: parseInt(this.state.decimals, 10),
      name: this.state.name,
      symbol: this.state.symbol,
    };

    await StorageUtils.addToken(token);

    this.props.onTokenChange(token);

    StorageUtils.setDefaultToken(token);

    this.props.navigator.pop();
  };

  render() {
    return (
      <GradientBackground>
        <View style={styles.container}>
          <Header
            onBackPress={() => this.props.navigator.pop()}
            title="Add token"
          />
          <Form
            amount={this.state.amount}
            contractAddress={this.state.contractAddress}
            decimals={this.state.decimals}
            name={this.state.name}
            onContractAddressChange={contractAddress =>
              this.setState({ contractAddress })
            }
            onDecimalsChange={decimals => this.setState({ decimals })}
            onNameChange={name => this.setState({ name })}
            onSymbolChange={symbol => this.setState({ symbol })}
            onCameraPress={this.onCameraPress}
            symbol={this.state.symbol}
          />

          <View style={styles.buttonContainer}>
            <SecondaryButton
              onPress={this.addToken}
              disabled={
                !this.addressIsValid() ||
                this.state.decimals === '' ||
                this.state.symbol.trim() === ''
              }
              text="Add"
            />
          </View>
        </View>
      </GradientBackground>
    );
  }
}
