import React, { Component } from 'react';
import {
  AsyncStorage,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import abi from 'ethereumjs-abi';
import moment from 'moment';
import settings from './images/settings.png';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#0C0B0C',
    flex: 1,
    paddingTop: 40,
  },
  coinName: {
    color: '#fff',
    fontSize: 18,
    letterSpacing: 3,
  },
  balanceRow: {
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
  settingsIcon: {
    height: 24,
    width: 24,
  },
  listContainer: {
    width: '100%',
  },
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
});

export default class WalletHome extends Component {
  state = {
    currentBalance: 0,
    selectedToken: {
      address: '0x44197a4c44d6a059297caf6be4f7e172bd56caaf',
      decimals: 8,
      name: 'ELTCOIN',
      symbol: 'ELT',
    },
    tokenOperations: [],
  };

  async componentDidMount() {
    await this.fetchWalletAddress();
    this.fetchBalance();
    this.fetchTransactions();
  }

  fetchWalletAddress = async () => {
    // const walletAddress = await AsyncStorage.getItem('@ELTWALLET:address');

    // this.setState({
    //   walletAddress,
    // });

    this.setState({
      walletAddress: '0xe82a5495707c327b726e8b1427f1bee5edbe93cc',
    });
  };

  fetchBalance = () => {
    try {
      fetch('https://api.myetherapi.com/eth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: '1',
          jsonrpc: '2.0',
          method: 'eth_call',
          params: [
            {
              to: this.state.selectedToken.address,
              data: `0x${abi
                .simpleEncode(
                  'balanceOf(address):(uint256)',
                  this.state.walletAddress,
                )
                .toString('hex')}`,
            },
            'pending',
          ],
        }),
      })
        .then(response => response.json())
        .then(data => {
          this.setState({
            currentBalance: (
              parseInt(data.result, 16) /
              10 ** this.state.selectedToken.decimals
            ).toFixed(2),
          });
        });
    } catch (error) {
      this.setState({
        isErrorState: true,
      });
    }
  };

  fetchTransactions = () => {
    try {
      fetch(
        `https://api.ethplorer.io/getAddressHistory/${
          this.state.walletAddress
        }?apiKey=freekey&token=${
          this.state.selectedToken.address
        }&type=transfer`,
      )
        .then(response => response.json())
        .then(data => {
          this.setState({
            tokenOperations: data.operations,
          });
        });
    } catch (error) {
      this.setState({
        isErrorState: true,
      });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.coinName}>{this.state.selectedToken.name}</Text>
        <View style={styles.balanceRow}>
          <View style={styles.balanceContainer}>
            <Text style={styles.balance}>{this.state.currentBalance}</Text>
            <Text style={styles.coinSymbol}>ELT</Text>
          </View>
          <Image source={settings} style={styles.settingsIcon} />
        </View>
        <View style={styles.listContainer}>
          <FlatList
            style={styles.list}
            data={this.state.tokenOperations}
            keyExtractor={item => item.transactionHash}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                <View>
                  <Text style={styles.itemTitle}>
                    {item.from === this.state.walletAddress
                      ? 'Send ELT'
                      : 'Received ELT'}
                  </Text>
                  <Text style={styles.itemStatus}>Completed</Text>
                </View>
                <View>
                  <Text style={styles.itemAmount}>
                    {`${(
                      item.value /
                      10 ** this.state.selectedToken.decimals
                    ).toFixed(2)} ${this.state.selectedToken.symbol}`}
                  </Text>
                  <Text style={styles.itemTimestamp}>
                    {moment(item.timestamp * 1000).fromNow()}
                  </Text>
                </View>
              </View>
            )}
          />
        </View>
      </View>
    );
  }
}
