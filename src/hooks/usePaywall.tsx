import {useEffect, useState} from 'react';
import {useAppSelector} from '../store/store';
import {internalService} from '../service/internalServices';
import {eventBus} from '../middleware/eventMiddleware';
import {Platform} from 'react-native';
import {
  getSubscriptions,
  initConnection,
  requestSubscription,
} from 'react-native-iap';
import {
  deriveBasePlanId,
  fixKnownSkuMismatches,
  formatNumberWithLocale,
  normalizeSku,
  parseFormattedPrice,
  computeOriginalPrice,
} from '../utils/paywall';

interface ISubscriptionWithPrice extends ISubscription {
  originalPrice?: number;
  discountedPrice?: number;
  currency?: string;
  formattedDiscountedPrice?: string;
  formattedOriginalPrice?: string;
  offerToken?: string;
  resolvedProductId?: string;
}

export const usePaywall = () => {
  const {subscriptions, premiumAdvantages, loading, selectedSubscription} =
    useAppSelector(state => state.subscription);
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptionsWithPrices, setSubscriptionsWithPrices] = useState<
    ISubscriptionWithPrice[]
  >([]);
  const [isPriceLoading, setIsPriceLoading] = useState(false);

  useEffect(() => {
    fetchPaywallData();
  }, []);

  useEffect(() => {
    if (subscriptions.length > 0) {
      fetchSubscriptionPrices();
    }
  }, [subscriptions]);

  const fetchPaywallData = async () => {
    try {
      setIsLoading(true);
      await internalService.getPaywall();
    } catch (error) {
      console.error('Error fetching paywall data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSubscriptionPrices = async () => {
    try {
      setIsPriceLoading(true);
      if (Platform.OS === 'android') {
        // Ensure IAP connection before querying Play Store
        try {
          await initConnection();
        } catch (e) {
          console.warn('IAP initConnection failed before price fetch', e);
        }
        const skus = subscriptions.map(sub => sub.sku);
        const playStoreSubs = await getSubscriptions({
          skus: skus,
        });

        const normalized = normalizeSku;
        const fixKnownMismatches = fixKnownSkuMismatches;

        const enrichedSubscriptions: ISubscriptionWithPrice[] =
          subscriptions.map(subscription => {
            const expectedBasePlan = deriveBasePlanId(subscription);

            // try exact, then known mismatch, then normalized fuzzy match
            let playStoreSub = playStoreSubs.find(
              ps => ps.productId === subscription.sku,
            );
            if (!playStoreSub) {
              const alt = fixKnownMismatches(subscription.sku);
              playStoreSub = playStoreSubs.find(ps => ps.productId === alt);
            }
            if (!playStoreSub) {
              const target = normalized(subscription.sku);
              playStoreSub = playStoreSubs.find(
                ps => normalized(ps.productId) === target,
              );
            }

            if (!playStoreSub) {
              return subscription;
            }

            // Select offer: prefer matching basePlanId, else first
            const offer =
              (playStoreSub as any).subscriptionOfferDetails?.find(
                (o: any) => o.basePlanId === expectedBasePlan,
              ) || (playStoreSub as any).subscriptionOfferDetails?.[0];

            const pricingPhase = offer?.pricingPhases?.pricingPhaseList?.[0];
            const formattedPrice: string | undefined =
              pricingPhase?.formattedPrice;
            const priceMicros: string | undefined =
              pricingPhase?.priceAmountMicros;
            const priceCurrencyCode: string | undefined =
              pricingPhase?.priceCurrencyCode;
            const offerToken: string | undefined = offer?.offerToken;

            let discountedPrice = 0;
            let currencySymbol = '';
            if (formattedPrice) {
              const parsed = parseFormattedPrice(formattedPrice);
              currencySymbol = parsed.symbol;
              discountedPrice = parsed.amount;
            } else if (priceMicros) {
              // Fallback compute from micros
              const micros = Number(priceMicros);
              discountedPrice = Math.round((micros / 1_000_000) * 100) / 100;
              currencySymbol = priceCurrencyCode || '';
            }

            if (!discountedPrice) {
              return {
                ...subscription,
                resolvedProductId: playStoreSub.productId,
                offerToken,
              };
            }

            let originalPrice = computeOriginalPrice(
              discountedPrice,
              subscription.discount,
            );
            originalPrice = Math.round(originalPrice * 100) / 100;

            // Build formatted strings respecting locale from Play formattedPrice
            const usesComma = formattedPrice
              ? formattedPrice.includes(',')
              : false;
            const formatNumber = (n: number) =>
              formatNumberWithLocale(n, usesComma);

            const formattedDiscountedPrice = formattedPrice
              ? formattedPrice
              : `${currencySymbol}${formatNumber(discountedPrice)}`;
            const formattedOriginalPrice = `${currencySymbol}${formatNumber(
              originalPrice,
            )}`;

            return {
              ...subscription,
              discountedPrice,
              originalPrice,
              currency: currencySymbol,
              formattedDiscountedPrice,
              formattedOriginalPrice,
              offerToken,
              resolvedProductId: playStoreSub.productId,
            };
          });

        setSubscriptionsWithPrices(enrichedSubscriptions);
      } else {
        // For iOS, we'll use the same logic but with App Store prices
        setSubscriptionsWithPrices(subscriptions);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      console.error('Error fetching subscription prices:', errorMessage);
      setSubscriptionsWithPrices(subscriptions);
    } finally {
      setIsPriceLoading(false);
    }
  };

  const handlePlanSelection = (subscription: ISubscription) => {
    eventBus.emit('subscriptionSelected', subscription);
  };

  const handlePurchase = async (subscription: ISubscription) => {
    try {
      setIsLoading(true);
      eventBus.emit('paymentStarted', {subscription});

      if (Platform.OS === 'android') {
        const enriched = subscriptionsWithPrices.find(
          s => s._id === subscription._id,
        );
        const skuForPurchase = enriched?.resolvedProductId || subscription.sku;
        const offerToken = enriched?.offerToken;

        await initConnection();

        const res: any = await requestSubscription({
          sku: skuForPurchase,
          subscriptionOffers: offerToken
            ? [{sku: skuForPurchase, offerToken}]
            : undefined,
        });

        const purchases: any[] = Array.isArray(res) ? res : [res];
        const matched =
          purchases.find(
            p =>
              p?.productId === skuForPurchase ||
              p?.productIds?.includes?.(skuForPurchase),
          ) || purchases[0];

        if (!matched) {
          throw new Error('Satın alma bilgisi bulunamadı');
        }

        const safeParse = (txt?: string) => {
          try {
            return txt ? JSON.parse(txt) : undefined;
          } catch {
            return undefined;
          }
        };

        const receipt = safeParse(matched.transactionReceipt);
        const dataAndroid = safeParse(matched.dataAndroid);

        const packageNameFromReceipt = receipt?.packageName;
        const packageNameFromData = dataAndroid?.packageName;
        const packageName =
          matched.packageNameAndroid ||
          matched.packageName ||
          packageNameFromReceipt ||
          packageNameFromData ||
          'com.cekolabs.vens';

        const productId = matched.productId || skuForPurchase;
        const purchaseToken =
          matched.purchaseToken ||
          receipt?.purchaseToken ||
          dataAndroid?.purchaseToken;

        const paymentRequest: IAndroidPaymentRequest = {
          packageName,
          productId,
          purchaseToken,
        };

        if (!paymentRequest.purchaseToken) {
          throw new Error('Satın alma başarısız: purchaseToken bulunamadı');
        }

        await internalService.postPayment(paymentRequest);
      } else {
        // For iOS, we'd handle receipt data
        const mockPaymentData: IIOSPaymentRequest = {
          receiptData: 'mock-receipt-data',
        };

        await internalService.postPayment(mockPaymentData);
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      eventBus.emit('paymentFailed', {error: error.message});
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestorePurchases = async () => {
    try {
      setIsLoading(true);
      // Implement restore purchases logic here
      console.log('Restoring purchases...');
    } catch (error) {
      console.error('Error restoring purchases:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    subscriptions: subscriptionsWithPrices,
    premiumAdvantages,
    loading: loading || isLoading,
    isPriceLoading,
    selectedSubscription,
    handlePlanSelection,
    handlePurchase,
    handleRestorePurchases,
    fetchPaywallData,
  };
};
