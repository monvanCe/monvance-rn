export enum WatchlistPeriod {
  MINUTE_1 = 1,
  MINUTE_2 = 2,
  MINUTE_3 = 3,
  MINUTE_5 = 5,
  MINUTE_15 = 15,
  MINUTE_30 = 30,
  HOUR_1 = 60,
  HOUR_4 = 240,
}

export enum WatchlistPercent {
  PERCENT_1 = 1,
  PERCENT_2 = 2,
  PERCENT_3 = 3,
  PERCENT_5 = 5,
  PERCENT_10 = 10,
  PERCENT_25 = 25,
  PERCENT_50 = 50,
  PERCENT_100 = 100,
}

export enum SubscriptionPlatform {
  ANDROID = 'ANDROID',
  IOS = 'IOS',
}

export enum SubscriptionInterval {
  WEEKLY = 7,
  MONTHLY = 30,
  THREE_MONTHLY = 90,
}

export enum OnboardingPageKey {
  PAGE1_TITLE = 'onboarding_page1_title',
  PAGE1_DESCRIPTION = 'onboarding_page1_description',
  PAGE2_TITLE = 'onboarding_page2_title',
  PAGE2_DESCRIPTION = 'onboarding_page2_description',
  PAGE3_TITLE = 'onboarding_page3_title',
  PAGE3_DESCRIPTION = 'onboarding_page3_description',
  PAGE4_TITLE = 'onboarding_page4_title',
  PAGE4_DESCRIPTION = 'onboarding_page4_description',
  SKIP = 'skip',
  NEXT = 'next',
  GET_STARTED = 'get_started',
}

export const USERS_CHANNEL_PREFIX = 'users#';
export const SIGNAL_CHANNEL = 'signal';
