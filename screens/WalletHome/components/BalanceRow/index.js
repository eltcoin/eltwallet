import React, { Component } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import { TokenPicker } from '../../../../components';
import switchIcon from './images/switch.png';
import settingsIcon from './images/settings.png';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 30,
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
  },
  coinSymbol: {
    alignSelf: 'flex-end',
    color: '#fff',
    fontSize: 15,
    fontWeight: '200',
    letterSpacing: 3,
    paddingBottom: 3,
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
    onTokenChange: PropTypes.func.isRequired,
    onSettingsIconPress: PropTypes.func.isRequired,
  };

  render() {
    const {
      currentBalance,
      selectedToken,
      onTokenChange,
      onSettingsIconPress,
    } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.balanceContainer}>
          <Text style={styles.balance}>{currentBalance.toFixed(2)}</Text>
          <Text style={styles.coinSymbol}>{selectedToken.symbol}</Text>
        </View>
        <View style={styles.iconsContainer}>
          <TouchableOpacity>
            <Image source={switchIcon} style={styles.switchIcon} />
            <TokenPicker
              selectedToken={selectedToken}
              onTokenChange={onTokenChange}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onSettingsIconPress}>
            <Image source={settingsIcon} style={styles.settingsIcon} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
