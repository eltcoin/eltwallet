import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import UserDefaults from 'react-native-userdefaults-ios';
import {
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
    pinCode: PropTypes.string,
    walletAddress: PropTypes.string,
  };

  static defaultProps = {
    pinCode: null,
    walletAddress: null,
  };

  async componentDidMount() {
    const { pinCode, walletAddress } = this.props;

    if (!walletAddress) {
      await this.migrateFromUserDefaults();
    }

    if (pinCode && walletAddress) {
      return this.props.navigation.navigate('PinCode');
    }

    if (walletAddress) {
      return this.props.navigation.navigate('Welcome', {
        migrationMode: true,
      });
    }

    return this.props.navigation.navigate('Welcome');
  }

  migrateFromUserDefaults = async () => {
    const wallet = await UserDefaults.stringForKey('wallet').then(JSON.parse);

    if (wallet) {
      this.props.dispatch({
        type: SET_WALLET_ADDRESS,
        walletAddress: wallet.address,
      });

      this.props.dispatch({
        type: SET_PRIVATE_KEY,
        privateKey: wallet.privKey,
      });

      const pinCode = await UserDefaults.stringForKey('PIN');

      if (pinCode) {
        this.props.dispatch({
          type: SET_PIN_CODE,
          pinCode,
        });
      }
    }

    return UserDefaults.removeItemForKey('PIN').then(
      UserDefaults.removeItemForKey('wallet'),
    );
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
