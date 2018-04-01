import { AsyncStorage } from 'react-native';
import Config from 'react-native-config';
import Analytics from 'analytics-react-native';
import { store } from '../config/store';

const analytics = new Analytics(Config.SEGMENT_API_KEY);

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}

export default class AnalyticsUtils {
  static async getAnalyticsUserId() {
    const userId = store.getState().walletAddress;

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

  static async trackEvent(event, properties) {
    const userId = await this.getAnalyticsUserId();

    analytics.track(
      Object.assign(
        {
          event,
          properties,
        },
        userId,
      ),
    );
  }

  static async trackScreen(name) {
    const userId = await this.getAnalyticsUserId();

    analytics.screen(
      Object.assign(
        {
          name,
        },
        userId,
      ),
    );
  }
}
