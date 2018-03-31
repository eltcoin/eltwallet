import { Component } from 'react';
import { AsyncStorage } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  ADD_TOKEN,
  SET_DEFAULT_TOKEN,
  SET_PIN_CODE,
  SET_PRIVATE_KEY,
  SET_WALLET_ADDRESS,
} from '../../config/actionTypes';

class AppLoading extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
    }).isRequired,
    walletAddress: PropTypes.string,
  };

  static defaultProps = {
    walletAddress: null,
  };

  async componentDidMount() {
    if (!this.props.walletAddress) {
      await this.migrateFromAsyncStorage();
    }

    if (this.props.walletAddress) {
      return this.props.navigation.navigate('PinCode');
    }

    return this.props.navigation.navigate('Welcome');
  }

  migrateFromAsyncStorage = async () => {
    const keys = [
      '@ELTWALLET:address',
      '@ELTWALLET:availableTokens',
      '@ELTWALLET:defaultToken',
      '@ELTWALLET:pinCode',
      '@ELTWALLET:privateKey',
    ];

    const [
      walletAddress,
      availableTokens,
      selectedToken,
      pinCode,
      privateKey,
    ] = await AsyncStorage.multiGet(keys);

    if (walletAddress[1]) {
      this.props.dispatch({
        type: SET_WALLET_ADDRESS,
        walletAddress: walletAddress[1],
      });
    }

    if (availableTokens[1]) {
      JSON.parse(availableTokens[1])
        .slice(2)
        .forEach(token => {
          this.props.dispatch({
            type: ADD_TOKEN,
            token,
          });
        });
    }

    if (selectedToken[1]) {
      this.props.dispatch({
        type: SET_DEFAULT_TOKEN,
        token: JSON.parse(selectedToken[1]),
      });
    }

    if (pinCode[1]) {
      this.props.dispatch({
        type: SET_PIN_CODE,
        pinCode: pinCode[1],
      });
    }

    if (privateKey[1]) {
      this.props.dispatch({
        type: SET_PRIVATE_KEY,
        privateKey: privateKey[1],
      });
    }

    return AsyncStorage.multiRemove(keys);
  };

  render() {
    return null;
  }
}

const mapStateToProps = state => ({
  pinCode: state.pinCode,
  walletAddress: state.walletAddress,
});

export default connect(mapStateToProps)(AppLoading);
