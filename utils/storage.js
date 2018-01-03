import { AsyncStorage } from 'react-native';
import AnalyticsUtils from './analytics';
import { defaultTokens } from './constants';

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}

export default class StorageUtils {
  static async getAnalyticsUserId() {
    const userId = await AsyncStorage.getItem('@ELTWALLET:address');

    if (userId) {
      return {
        userId,
      };
    }

    let anonymousId = await AsyncStorage.getItem('@ELTWALLET:anonymousId');

    if (anonymousId) {
      return {
        anonymousId,
      };
    }

    anonymousId = guid();

    await AsyncStorage.setItem('@ELTWALLET:anonymousId', anonymousId);

    return {
      anonymousId,
    };
  }

  static async getShowCallToAction() {
    const showCallToAction = await AsyncStorage.getItem(
      '@ELTWALLET:showCallToAction',
    );

    return showCallToAction === null;
  }

  static setShowCallToAction() {
    AsyncStorage.setItem('@ELTWALLET:showCallToAction', 'true');
  }

  static async getAvailableTokens() {
    const tokens = await AsyncStorage.getItem('@ELTWALLET:availableTokens');

    if (!tokens) {
      AsyncStorage.setItem(
        '@ELTWALLET:availableTokens',
        JSON.stringify(defaultTokens),
      );

      return defaultTokens;
    }

    return JSON.parse(tokens);
  }

  static async addToken(token) {
    const tokens = await AsyncStorage.getItem(
      '@ELTWALLET:availableTokens',
    ).then(JSON.parse);

    tokens.push(token);

    AnalyticsUtils.trackEvent('Add custom token', {
      contractAddress: token.contractAddress,
      decimals: token.decimals,
      name: token.name,
      symbol: token.symbol,
    });

    return AsyncStorage.setItem(
      '@ELTWALLET:availableTokens',
      JSON.stringify(tokens),
    );
  }

  static async getDefaultToken() {
    const defaultToken = await AsyncStorage.getItem('@ELTWALLET:defaultToken');

    if (!defaultToken) {
      AsyncStorage.setItem(
        '@ELTWALLET:defaultToken',
        JSON.stringify(defaultTokens[0]),
      );

      return defaultTokens[0];
    }

    return JSON.parse(defaultToken);
  }

  static setDefaultToken(defaultToken) {
    return AsyncStorage.setItem(
      '@ELTWALLET:defaultToken',
      JSON.stringify(defaultToken),
    );
  }
}
