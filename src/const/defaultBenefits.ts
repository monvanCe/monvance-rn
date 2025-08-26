import {t} from '../localization';

// Default premium benefits that can be used as fallback or override
export const getDefaultPremiumBenefits = (): string[] => [
  t('benefit_instant_signals'),
  t('benefit_advanced_analytics'),
  t('benefit_priority_support'),
  t('benefit_ad_free'),
  t('benefit_unlimited_alerts'),
  t('benefit_exclusive_insights'),
  t('benefit_early_access'),
  t('benefit_portfolio_tracking'),
];

// Alternative shorter list for compact views - most reliable core features
export const getCompactPremiumBenefits = (): string[] => [
  t('benefit_instant_signals'),
  t('benefit_ad_free'),
  t('benefit_unlimited_alerts'),
  t('benefit_priority_support'),
];

// Minimal list for very small screens - only essential features
export const getMinimalPremiumBenefits = (): string[] => [
  t('benefit_instant_signals'),
  t('benefit_ad_free'),
  t('benefit_unlimited_alerts'),
];

// Benefits with descriptions for detailed views
export const getBenefitsWithDescriptions = () => [
  {
    title: t('benefit_instant_signals'),
    description: t('benefit_instant_signals_desc'),
  },
  {
    title: t('benefit_advanced_analytics'),
    description: t('benefit_advanced_analytics_desc'),
  },
  {
    title: t('benefit_priority_support'),
    description: t('benefit_priority_support_desc'),
  },
  {
    title: t('benefit_ad_free'),
    description: t('benefit_ad_free_desc'),
  },
  {
    title: t('benefit_unlimited_alerts'),
    description: t('benefit_unlimited_alerts_desc'),
  },
  {
    title: t('benefit_exclusive_insights'),
    description: t('benefit_exclusive_insights_desc'),
  },
  {
    title: t('benefit_early_access'),
    description: t('benefit_early_access_desc'),
  },
  {
    title: t('benefit_portfolio_tracking'),
    description: t('benefit_portfolio_tracking_desc'),
  },
]; 