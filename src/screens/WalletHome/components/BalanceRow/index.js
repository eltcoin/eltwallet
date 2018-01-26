import React, { Component } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Text } from '../../../../components';

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

class BalanceRow extends Component {
  static propTypes = {
    currentBalance: PropTypes.number.isRequired,
    selectedToken: PropTypes.shape({
      name: PropTypes.string.isRequired,
      symbol: PropTypes.string.isRequired,
    }).isRequired,
    onTokenChangeIconPress: PropTypes.func.isRequired,
    onSettingsIconPress: PropTypes.func.isRequired,
  };

  render() {
    const {
      currentBalance,
      selectedToken,
      onTokenChangeIconPress,
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
          <TouchableOpacity onPress={onTokenChangeIconPress}>
            <Image source={switchIcon} style={styles.switchIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onSettingsIconPress}>
            <Image source={settingsIcon} style={styles.settingsIcon} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  selectedToken: state.selectedToken,
});

export default connect(mapStateToProps)(BalanceRow);
