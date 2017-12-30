import { AsyncStorage } from 'react-native';
import { defaultTokens } from './constants';

export default class StorageUtils {
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
