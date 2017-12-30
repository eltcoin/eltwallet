import { AsyncStorage } from 'react-native';
import EthereumJsWallet from 'ethereumjs-wallet';
import Web3 from 'web3';
import ProviderEngine from 'web3-provider-engine';
import WalletSubprovider from 'web3-provider-engine/subproviders/wallet';
import Web3Subprovider from 'web3-provider-engine/subproviders/web3';
import { erc20Abi } from './constants';
import AnalyticsUtils from './analytics';

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

    AnalyticsUtils.trackEvent('Generate wallet', {
      walletAddress: wallet.getAddressString(),
    });

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

    AnalyticsUtils.trackEvent('Import wallet', {
      walletAddress: wallet.getAddressString(),
    });

    return this.storeWallet(wallet);
  }

  /**
   * Reads an EthereumJSWallet instance from AsyncStorage
   */
  static async getWallet() {
    const privateKey = await AsyncStorage.getItem('@ELTWALLET:privateKey');

    return EthereumJsWallet.fromPrivateKey(Buffer.from(privateKey, 'hex'));
  }

  static getWeb3HTTPProvider() {
    return new Web3.providers.HttpProvider('https://api.myetherapi.com/eth');
  }

  /**
   * Returns a web3 instance with the user's wallet
   */
  static async getWeb3Instance() {
    const wallet = await this.getWallet();

    const engine = new ProviderEngine();

    engine.addProvider(new WalletSubprovider(wallet, {}));
    engine.addProvider(new Web3Subprovider(this.getWeb3HTTPProvider()));

    engine.start();

    const web3 = new Web3(engine);

    web3.eth.defaultAccount = wallet.getAddressString();

    return web3;
  }

  /**
   * Fetch a list of transactions for the user's wallet concerning the given token
   *
   * @param {Object} token
   */
  static getTransactions({ contractAddress, symbol }) {
    if (symbol === 'ETH') {
      return this.getEthTransactions();
    }

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
    if (symbol === 'ETH') {
      return this.getEthBalance();
    }

    return this.getERC20Balance(contractAddress, decimals);
  }

  /**
   * Get the user's wallet ETH balance
   */
  static async getEthBalance() {
    const walletAddress = await this.getWallet().then(wallet =>
      wallet.getAddressString(),
    );

    const web3 = new Web3(this.getWeb3HTTPProvider());

    return new Promise((resolve, reject) => {
      web3.eth.getBalance(walletAddress, (error, weiBalance) => {
        if (error) {
          reject(error);
        }

        const balance = weiBalance / Math.pow(10, 18);

        AnalyticsUtils.trackEvent('Get ETH balance', {
          balance,
        });

        resolve(balance);
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

    const web3 = new Web3(this.getWeb3HTTPProvider());

    return new Promise((resolve, reject) => {
      web3.eth
        .contract(erc20Abi)
        .at(contractAddress)
        .balanceOf(walletAddress, (error, decimalsBalance) => {
          if (error) {
            reject(error);
          }

          const balance = decimalsBalance / Math.pow(10, decimals);

          AnalyticsUtils.trackEvent('Get ERC20 balance', {
            balance,
            contractAddress,
          });

          resolve(balance);
        });
    });
  }

  /**
   * Send a transaction from the user's wallet
   *
   * @param {Object} token
   * @param {String} toAddress
   * @param {String} amount
   */
  static sendTransaction(
    { contractAddress, symbol, decimals },
    toAddress,
    amount,
  ) {
    if (symbol === 'ETH') {
      return this.sendETHTransaction(toAddress, amount);
    }

    return this.sendERC20Transaction(
      contractAddress,
      decimals,
      toAddress,
      amount,
    );
  }

  /**
   * Send an ETH transaction to the given address with the given amount
   *
   * @param {String} toAddress
   * @param {String} amount
   */
  static async sendETHTransaction(toAddress, amount) {
    const web3 = await this.getWeb3Instance();

    AnalyticsUtils.trackEvent('Send ETH transaction', {
      value: amount,
    });

    return new Promise((resolve, reject) => {
      web3.eth.sendTransaction(
        {
          to: toAddress,
          value: web3.toWei(amount),
        },
        (error, transaction) => {
          if (error) {
            reject(error);
          }

          resolve(transaction);
        },
      );
    });
  }

  /**
   * Send an ETH transaction to the given address with the given amount
   *
   * @param {String} toAddress
   * @param {String} amount
   */
  static async sendERC20Transaction(
    contractAddress,
    decimals,
    toAddress,
    amount,
  ) {
    const web3 = await this.getWeb3Instance();

    AnalyticsUtils.trackEvent('Send ERC20 transaction', {
      contractAddress,
      value: amount,
    });

    return new Promise((resolve, reject) => {
      web3.eth
        .contract(erc20Abi)
        .at(contractAddress)
        .transfer(
          toAddress,
          amount * Math.pow(10, decimals),
          (error, transaction) => {
            if (error) {
              reject(error);
            }

            resolve(transaction);
          },
        );
    });
  }
}
