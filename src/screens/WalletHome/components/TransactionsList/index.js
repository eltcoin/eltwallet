import React, { Component } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Text } from '../../../../components';

const styles = StyleSheet.create({
  itemContainer: {
    borderBottomWidth: 1,
    borderColor: '#372F49',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 30,
  },
  itemTitle: {
    color: '#fff',
    fontSize: 20,
  },
  itemStatus: {
    color: '#aaa',
    fontSize: 15,
    paddingTop: 5,
  },
  itemAmountContainer: {
    flexDirection: 'row',
  },
  itemAmountSymbol: {
    color: '#4D00FF',
    fontSize: 20,
    paddingRight: 5,
  },
  itemAmount: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'right',
  },
  itemTimestamp: {
    color: '#aaa',
    fontSize: 15,
    paddingTop: 5,
    textAlign: 'right',
  },
  emptyListText: {
    color: '#aaa',
    textAlign: 'center',
    fontSize: 20,
    paddingTop: 20,
  },
});

export default class TransactionsList extends Component {
  static propTypes = {
    onRefresh: PropTypes.func.isRequired,
    refreshing: PropTypes.bool.isRequired,
    selectedToken: PropTypes.shape({
      symbol: PropTypes.string.isRequired,
    }).isRequired,
    transactions: PropTypes.arrayOf(
      PropTypes.shape({
        transactionHash: PropTypes.string.isRequired,
        from: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        timestamp: PropTypes.string.isRequired,
      }),
    ).isRequired,
    walletAddress: PropTypes.string.isRequired,
  };

  render() {
    const {
      onRefresh,
      refreshing,
      selectedToken,
      transactions,
      walletAddress,
    } = this.props;

    return (
      <FlatList
        data={transactions}
        keyExtractor={item => item.transactionHash}
        ListEmptyComponent={
          <View>
            <Text style={styles.emptyListText}>No transactions to show</Text>
          </View>
        }
        onRefresh={onRefresh}
        refreshing={refreshing}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View>
              <Text style={styles.itemTitle}>
                {item.from === walletAddress
                  ? `Send ${selectedToken.symbol}`
                  : `Received ${selectedToken.symbol}`}
              </Text>
              <Text style={styles.itemStatus}>Completed</Text>
            </View>
            <View>
              <View style={styles.itemAmountContainer}>
                <Text style={styles.itemAmountSymbol}>
                  {item.from === walletAddress ? '-' : '+'}
                </Text>
                <Text style={styles.itemAmount}>
                  {`${item.value} ${selectedToken.symbol}`}
                </Text>
              </View>
              <Text style={styles.itemTimestamp}>
                {moment(item.timestamp * 1000).fromNow()}
              </Text>
            </View>
          </View>
        )}
      />
    );
  }
}
