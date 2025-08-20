export type BasePlanId = 'weekly' | 'monthly' | '3monthly' | undefined;

export const normalizeSku = (value: string) =>
  value.replace(/[_\s-]/g, '').toLowerCase();

export const fixKnownSkuMismatches = (sku: string) =>
  sku.replace('monthly', 'montly');

export const deriveBasePlanId = (sub: ISubscription): BasePlanId => {
  if (sub.interval === 1 && sub.intervalDays === 7) return 'weekly';
  if (sub.interval === 1 && sub.intervalDays === 30) return 'monthly';
  if (sub.interval === 3 && sub.intervalDays === 30) return '3monthly';
  return undefined;
};

export const parseFormattedPrice = (formattedPrice?: string) => {
  if (!formattedPrice) return {amount: 0, symbol: '', usesComma: false};
  const priceMatch = formattedPrice.match(/([^\d]*)([\d.,]+)/);
  if (!priceMatch) return {amount: 0, symbol: '', usesComma: false};
  const symbol = priceMatch[1] ? priceMatch[1].trim() : '';
  const numeric = priceMatch[2].replace(/\./g, '').replace(',', '.');
  const amount = parseFloat(numeric);
  const usesComma = formattedPrice.includes(',');
  return {amount, symbol, usesComma};
};

export const formatNumberWithLocale = (n: number, usesComma: boolean) => {
  const s = n.toFixed(2);
  return usesComma ? s.replace('.', ',') : s;
};

export const computeOriginalPrice = (
  discountedPrice: number,
  discountPercent: number,
) => {
  if (!discountPercent) return discountedPrice;
  return discountedPrice / (1 - discountPercent / 100);
};

export const getPlanBadgeText = (
  sub: ISubscription,
  translate: (key: string, opts?: any) => string,
) => {
  if (sub.interval === 1 && sub.intervalDays === 7) return translate('weekly');
  if (sub.interval === 1 && sub.intervalDays === 30)
    return translate('monthly');
  if (sub.interval === 3 && sub.intervalDays === 30)
    return translate('three_monthly');
  return translate('premium');
};
