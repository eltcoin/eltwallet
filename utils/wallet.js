import { AsyncStorage } from 'react-native';
import EthereumJsWallet from 'ethereumjs-wallet';
import Web3 from 'web3';
import { erc20Abi } from './constants';

export default class WalletUtils {
  /**
   * Given an EthereumJSWallet instance, store both address and private key
   * in AsyncStorage
   *
   * @param {Object} wallet
   */
  static storeWallet(wallet) {
    return AsyncStorage.multiSet([
      ['@ELTWALLET:address', wallet.getAddressString()],
      ['@ELTWALLET:privateKey', wallet.getPrivateKey().toString('hex')],
    ]);
  }

  /**
   * Generate an Ethereum wallet
   */
  static generateWallet() {
    const wallet = EthereumJsWallet.generate();

    return this.storeWallet(wallet);
  }

  /**
   * Store a wallet in AsyncStorage given a private key
   *
   * @param {String} privateKey
   */
  static restoreWallet(privateKey) {
    const wallet = EthereumJsWallet.fromPrivateKey(
      Buffer.from(privateKey, 'hex'),
    );

    return this.storeWallet(wallet);
  }

  /**
   * Reads an EthereumJSWallet instance from AsyncStorage
   */
  static async getWallet() {
    const privateKey = await AsyncStorage.getItem('@ELTWALLET:privateKey');

    return EthereumJsWallet.fromPrivateKey(Buffer.from(privateKey, 'hex'));
  }

  /**
   * Fetch a list of transactions for the user's wallet concerning the given token
   *
   * @param {Object} token
   */
  static getTransactions({ contractAddress, symbol }) {
    if (symbol === 'ETH') return this.getEthTransactions();

    return this.getERC20Transactions(contractAddress);
  }

  /**
   * Fetch a list of ETH transactions for the user's wallet
   */
  static async getEthTransactions() {
    const walletAddress = await this.getWallet().then(wallet =>
      wallet.getAddressString(),
    );

    return fetch(
      `https://api.ethplorer.io/getAddressTransactions/${walletAddress}?apiKey=freekey`,
    )
      .then(response => response.json())
      .then(transactions =>
        transactions.map(t => ({
          from: t.from,
          timestamp: t.timestamp,
          transactionHash: t.hash,
          value: t.value.toFixed(2),
        })),
      );
  }

  /**
   * Fetch a list of a given token transactions for the user's wallet
   *
   * @param {String} contractAddress
   */
  static async getERC20Transactions(contractAddress) {
    const walletAddress = await this.getWallet().then(wallet =>
      wallet.getAddressString(),
    );

    return fetch(
      `https://api.ethplorer.io/getAddressHistory/${walletAddress}?token=${contractAddress}&apiKey=freekey`,
    )
      .then(response => response.json())
      .then(data =>
        (data.operations || []).map(t => ({
          from: t.from,
          timestamp: t.timestamp,
          transactionHash: t.transactionHash,
          value: (
            parseInt(t.value, 10) / Math.pow(10, t.tokenInfo.decimals)
          ).toFixed(2),
        })),
      );
  }

  /**
   * Get the user's wallet balance of a given token
   *
   * @param {Object} token
   */
  static getBalance({ contractAddress, symbol, decimals }) {
    if (symbol === 'ETH') return this.getEthBalance();

    return this.getERC20Balance(contractAddress, decimals);
  }

  /**
   * Get the user's wallet ETH balance
   */
  static async getEthBalance() {
    const walletAddress = await this.getWallet().then(wallet =>
      wallet.getAddressString(),
    );

    const web3 = new Web3(
      new Web3.providers.HttpProvider('https://api.myetherapi.com/eth'),
    );

    return new Promise((resolve, reject) => {
      web3.eth.getBalance(walletAddress, (error, balance) => {
        if (error) {
          reject(error);
        }

        resolve(balance / Math.pow(10, 18));
      });
    });
  }

  /**
   * Get the user's wallet balance of a specific ERC20 token
   *
   * @param {String} contractAddress
   * @param {Number} decimals
   */
  static async getERC20Balance(contractAddress, decimals) {
    const walletAddress = await this.getWallet().then(wallet =>
      wallet.getAddressString(),
    );

    const web3 = new Web3(
      new Web3.providers.HttpProvider('https://api.myetherapi.com/eth'),
    );

    return new Promise((resolve, reject) => {
      web3.eth
        .contract(erc20Abi)
        .at(contractAddress)
        .balanceOf(walletAddress, (errror, balance) => {
          if (errror) {
            reject(errror);
          }

          resolve(balance / Math.pow(10, decimals));
        });
    });
  }
}
