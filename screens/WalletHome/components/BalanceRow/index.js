import React, { Component } from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  ActionSheetIOS,
} from 'react-native';
import PropTypes from 'prop-types';
import { Text, TokenPicker } from '../../../../components';
import StorageUtils from '../../../../utils/storage';
import switchIcon from './images/switch.png';
import settingsIcon from './images/settings.png';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 15,
    width: '100%',
  },
  balanceContainer: {
    flexDirection: 'row',
  },
  balance: {
    color: '#fff',
    fontSize: 30,
    letterSpacing: 3,
    paddingRight: 5,
  },
  coinSymbol: {
    alignSelf: 'flex-end',
    color: '#fff',
    fontSize: 15,
    letterSpacing: 3,
    paddingBottom: 4,
  },
  iconsContainer: {
    flexDirection: 'row',
  },
  switchIcon: {
    height: 24,
    marginRight: 20,
    marginTop: 1,
    width: 24,
  },
  tokenPicker: {
    position: 'absolute',
    top: 0,
    width: 1000,
    height: 1000,
  },
  settingsIcon: {
    height: 24,
    width: 24,
  },
});

export default class BalanceRow extends Component {
  static propTypes = {
    currentBalance: PropTypes.number.isRequired,
    selectedToken: PropTypes.shape({
      name: PropTypes.string.isRequired,
      symbol: PropTypes.string.isRequired,
    }).isRequired,
    onAddNewToken: PropTypes.func.isRequired,
    onTokenChange: PropTypes.func.isRequired,
    onSettingsIconPress: PropTypes.func.isRequired,
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
      currentBalance,
      selectedToken,
      onAddNewToken,
      onTokenChange,
      onSettingsIconPress,
    } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.balanceContainer}>
          <Text style={styles.balance} letterSpacing={1}>
            {currentBalance.toFixed(2)}
          </Text>
          <Text style={styles.coinSymbol} letterSpacing={2}>
            {selectedToken.symbol}
          </Text>
        </View>
        <View style={styles.iconsContainer}>
          <TouchableOpacity
            onPress={Platform.OS === 'ios' ? this.showActionSheet : null}
          >
            <Image source={switchIcon} style={styles.switchIcon} />
            {Platform.OS === 'ios' ? null : (
              <TokenPicker
                onAddNewToken={onAddNewToken}
                onTokenChange={onTokenChange}
                selectedToken={selectedToken}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={onSettingsIconPress}>
            <Image source={settingsIcon} style={styles.settingsIcon} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
