import React, { Component } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';

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
        timestamp: PropTypes.number.isRequired,
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

    if (transactions.length) {
      return (
        <FlatList
          data={transactions}
          keyExtractor={item => item.transactionHash}
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
                <Text style={styles.itemAmount}>
                  {`${item.value} ${selectedToken.symbol}`}
                </Text>
                <Text style={styles.itemTimestamp}>
                  {moment(item.timestamp * 1000).fromNow()}
                </Text>
              </View>
            </View>
          )}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      );
    }

    return <Text style={styles.emptyListText}>No operations to show</Text>;
  }
}
