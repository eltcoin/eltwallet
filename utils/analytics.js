import Analytics from 'analytics-react-native';
import StorageUtils from './storage';

const analytics = new Analytics('RFVONRbwMfe12Asdr0hgywhxsqgxyaaO');

export default class AnalyticsUtils {
  static async trackEvent(event, properties) {
    const userId = await StorageUtils.getAnalyticsUserId();

    console.log(
      Object.assign(
        {
          event,
          properties,
        },
        userId,
      ),
    );

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
    const userId = await StorageUtils.getAnalyticsUserId();

    console.log(
      Object.assign(
        {
          name,
        },
        userId,
      ),
    );

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
