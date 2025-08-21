import {useEffect, useState} from 'react';
import {useAppSelector} from '../store/store';
import {internalService} from '../service/internalServices';
import {eventBus} from '../middleware/eventMiddleware';
import {Platform} from 'react-native';
import {
  getPurchaseHistory,
  getSubscriptions,
  initConnection,
  requestSubscription,
} from 'react-native-iap';
import {computeOriginalPrice} from '../utils/paywall';

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
        await initConnection();

        const skus = subscriptions.map(sub => sub.sku);
        const playStoreSubs = await getSubscriptions({skus});

        const enriched: ISubscriptionWithPrice[] = subscriptions.map(
          subscription => {
            const playStoreSub = playStoreSubs.find(
              ps => ps.productId === subscription.sku,
            );
            if (!playStoreSub) return subscription;

            const offer = (playStoreSub as any).subscriptionOfferDetails?.[0];
            const phase = offer?.pricingPhases?.pricingPhaseList?.[0];
            if (!phase) return subscription;

            const priceMicros = Number(phase.priceAmountMicros || 0);
            const discountedPrice =
              Math.round((priceMicros / 1_000_000) * 100) / 100;
            const originalPrice =
              Math.round(
                computeOriginalPrice(discountedPrice, subscription.discount) *
                  100,
              ) / 100;

            const currencyCode: string | undefined = phase.priceCurrencyCode;
            const formattedDiscountedPrice: string | undefined =
              phase.formattedPrice;
            const offerToken: string | undefined = offer?.offerToken;

            const formattedOriginalPrice = `${
              currencyCode || ''
            } ${originalPrice.toFixed(2)}`.trim();

            return {
              ...subscription,
              discountedPrice,
              originalPrice,
              currency: currencyCode,
              formattedDiscountedPrice,
              formattedOriginalPrice,
              offerToken,
              resolvedProductId: playStoreSub.productId,
            };
          },
        );

        setSubscriptionsWithPrices(enriched);
      } else {
        setSubscriptionsWithPrices(subscriptions);
      }
    } catch (error: unknown) {
      console.error('Error fetching subscription prices:', error);
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
      if (Platform.OS === 'android') {
        await initConnection();

        if (!subscription.offerToken) {
          throw new Error('Offer token not found');
        }

        const res: any = await requestSubscription({
          sku: subscription.sku,
          subscriptionOffers: [
            {sku: subscription.sku, offerToken: subscription.offerToken},
          ],
        });

        const receipt = res[0];

        const packageName = receipt.packageNameAndroid;
        const purchaseToken = receipt.purchaseToken;
        const productId = receipt.productId;

        const paymentRequest: IAndroidPaymentRequest = {
          packageName,
          productId,
          purchaseToken,
        };

        await internalService.postPayment(paymentRequest);
      } else {
        //TODO: iOS için işlem yapılacak
      }
    } catch (error: any) {
      eventBus.emit('error', error.message as string);
    }
  };

  const handleRestorePurchases = async () => {
    try {
      const purchases = await getPurchaseHistory();
      const token = purchases[0].purchaseToken;
      if (!token) throw new Error('Token not found');
      await internalService.restorePurchases({token});
    } catch (error: any) {
      eventBus.emit('error', error.message as string);
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
