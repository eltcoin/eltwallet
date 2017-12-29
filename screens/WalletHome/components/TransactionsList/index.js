import React, { Component } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';

const styles = StyleSheet.create({
  list: {
    borderColor: '#372F49',
    borderTopWidth: 1,
  },
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
    tokenOperations: PropTypes.arrayOf(
      PropTypes.shape({
        transactionHash: PropTypes.string.isRequired,
        from: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        timestamp: PropTypes.number.isRequired,
      }),
    ).isRequired,
    walletAddress: PropTypes.string.isRequired,
    selectedToken: PropTypes.shape({
      decimals: PropTypes.number.isRequired,
      symbol: PropTypes.string.isRequired,
    }).isRequired,
  };

  render() {
    const { tokenOperations, walletAddress, selectedToken } = this.props;

    if (tokenOperations.length) {
      return (
        <FlatList
          style={styles.list}
          data={tokenOperations}
          keyExtractor={item => item.transactionHash}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <View>
                <Text style={styles.itemTitle}>
                  {item.from === walletAddress ? 'Send ELT' : 'Received ELT'}
                </Text>
                <Text style={styles.itemStatus}>Completed</Text>
              </View>
              <View>
                <Text style={styles.itemAmount}>
                  {`${(item.value / 10 ** selectedToken.decimals).toFixed(2)} ${
                    selectedToken.symbol
                  }`}
                </Text>
                <Text style={styles.itemTimestamp}>
                  {moment(item.timestamp * 1000).fromNow()}
                </Text>
              </View>
            </View>
          )}
        />
      );
    }

    return <Text style={styles.emptyListText}>No operations to show</Text>;
  }
}
