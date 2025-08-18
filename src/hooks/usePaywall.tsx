import {useEffect, useState} from 'react';
import {useAppSelector} from '../store/store';
import {internalService} from '../service/internalServices';
import {eventBus} from '../middleware/eventMiddleware';
import {Platform} from 'react-native';
import {getSubscriptions, requestPurchase} from 'react-native-iap';

interface ISubscriptionWithPrice extends ISubscription {
  originalPrice?: number;
  discountedPrice?: number;
  currency?: string;
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
        const skus = subscriptions.map(sub => sub.sku);
        console.log('Fetching prices for SKUs:', skus);

        const playStoreSubs = await getSubscriptions({
          skus: skus,
        });

        console.log('Play Store subscriptions received:', playStoreSubs);

        const enrichedSubscriptions = subscriptions.map(subscription => {
          const playStoreSub = playStoreSubs.find(
            ps => ps.productId === subscription.sku,
          );
          console.log(
            `Processing subscription ${subscription.sku}:`,
            playStoreSub,
          );

          // Try to extract price from various possible properties
          let priceString = '';
          if (playStoreSub) {
            // Check different possible price properties
            priceString =
              (playStoreSub as any).price ||
              (playStoreSub as any).localizedPrice ||
              (playStoreSub as any).formattedPrice ||
              '';
            console.log(`Price string for ${subscription.sku}:`, priceString);
          }

          if (priceString) {
            // Extract price and currency from price string (e.g., "₺10.99" -> price: 10.99, currency: "₺")
            const priceMatch = priceString.match(/[^\d,.]*([\d,]+[.,]\d{2})/);
            const currencyMatch = priceString.match(/^[^\d]*/);

            const discountedPrice = priceMatch
              ? parseFloat(priceMatch[1].replace(',', '.'))
              : 0;
            const currency = currencyMatch ? currencyMatch[0].trim() : '';

            console.log(
              `Extracted price: ${discountedPrice}, currency: ${currency}`,
            );

            // Calculate original price based on discount percentage
            let originalPrice = discountedPrice;
            if (subscription.discount > 0) {
              originalPrice =
                discountedPrice / (1 - subscription.discount / 100);
            }

            return {
              ...subscription,
              discountedPrice,
              originalPrice: Math.round(originalPrice * 100) / 100, // Round to 2 decimal places
              currency,
            };
          }

          return subscription;
        });

        console.log('Enriched subscriptions:', enrichedSubscriptions);
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
        // For Android, we need to get the subscription details first
        const subs = await getSubscriptions({
          skus: [subscription.sku],
        });

        if (subs.length > 0) {
          const purchase = await requestPurchase({
            sku: subscription.sku,
            andDangerouslyFinishTransactionAutomaticallyIOS: false,
          });

          // For now, we'll simulate the payment success
          // In a real implementation, you'd handle the purchase verification
          const mockPaymentData: IAndroidPaymentRequest = {
            packageName: 'com.cekolabs.vens',
            productId: subscription.sku,
            purchaseToken: 'mock-purchase-token',
          };

          await internalService.postPayment(mockPaymentData);
        }
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
