import { ENVIRONMENT } from 'constants/url';
export type AdEvent =
  | 'adopt'
  | 'reroll'
  | 'connect_wallet'
  | 'user_click_etransfer_noneSGR'
  | 'tg_adopt'
  | 'tg_reroll'
  | 'tg_connect_wallet'
  | 'tg_user_click_daily';

export type AdEventTest =
  | 'adopt_test'
  | 'reroll_test'
  | 'connect_wallet_test'
  | 'user_click_etransfer_noneSGR_test'
  | 'tg_adopt_test'
  | 'tg_reroll_test'
  | 'tg_connect_wallet_test'
  | 'tg_user_click_daily_test';

import { store } from 'redux/store';

export class AdTracker {
  isValid: boolean | undefined;
  gtm: any;
  adInfo: any;
  constructor() {
    this.gtm = window?.dataLayer;
    this.adInfo = store.getState().info.adInfo;

    if (this.adInfo['utm_campaign']) {
      this.isValid = true;
    }
  }

  sendAdTrack(event: AdEvent, payload: any) {
    try {
      const env = process.env.NEXT_PUBLIC_APP_ENV as unknown as ENVIRONMENT;

      if (env === 'production') {
        console.log('=====this.gtm', event);
        this.gtm.push({ event, ...this.adInfo, ...payload });
      } else {
        const eventName = `${event}_test`;
        console.log('=====this.gtm test', eventName, payload);
        console.log('=====this.gtm this.gtm', this.gtm);
        this.gtm.push({ eventName, ...this.adInfo, ...payload });
      }
    } catch (error) {
      console.error('track error:', error);
    }
  }

  static trackEvent(event: AdEvent, payload?: any) {
    const tracker = new AdTracker();
    tracker.sendAdTrack(event, payload);
  }
}
