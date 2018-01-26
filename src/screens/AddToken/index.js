import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { GradientBackground, Header, SecondaryButton } from '../../components';
import Form from './components/Form';
import { ADD_TOKEN, SET_DEFAULT_TOKEN } from '../../config/actionTypes';
import AnalyticsUtils from '../../utils/analytics';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 15,
  },
  buttonContainer: {
    paddingHorizontal: 15,
    paddingTop: 40,
  },
});

class AddToken extends Component {
  static propTypes = {
    addToken: PropTypes.func.isRequired,
    navigator: PropTypes.shape({
      pop: PropTypes.func.isRequired,
      push: PropTypes.func.isRequired,
    }).isRequired,
    setDefaultToken: PropTypes.func.isRequired,
  };

  static navigatorStyle = {
    navBarHidden: true,
    screenBackgroundColor: '#181724',
    statusBarColor: 'transparent',
    statusBarTextColorScheme: 'light',
  };

  state = {
    contractAddress: '',
    decimals: '',
    name: '',
    symbol: '',
  };

  onBarCodeRead = contractAddress => {
    AnalyticsUtils.trackEvent('Read ERC20 contract QR code', {
      contractAddress,
    });

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
    this.props.navigator.push({
      animationType: 'slide-horizontal',
      passProps: {
        onBarCodeRead: this.onBarCodeRead,
      },
      screen: 'Camera',
    });
  };

  addressIsValid = () =>
    /^0x([A-Fa-f0-9]{40})$/.test(this.state.contractAddress);

  addToken = () => {
    const token = {
      contractAddress: this.state.contractAddress,
      decimals: parseInt(this.state.decimals, 10),
      name: this.state.name,
      symbol: this.state.symbol,
    };

    this.props.addToken(token);
    this.props.setDefaultToken(token);
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

const mapDispatchToProps = dispatch => ({
  addToken: token => dispatch({ type: ADD_TOKEN, token }),
  setDefaultToken: token => dispatch({ type: SET_DEFAULT_TOKEN, token }),
});

export default connect(null, mapDispatchToProps)(AddToken);
