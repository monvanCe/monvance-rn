import {useCallback} from 'react';
import {useAppDispatch, useAppSelector} from '../store/store';
import {
  setSubscriptions,
  setLoading,
  setSelectedSubscription,
  clearSubscriptions,
} from '../store/slices/subscriptionSlice';
import subscriptionService from '../service/subscriptionService';

export const useSubscription = () => {
  const dispatch = useAppDispatch();
  const {subscriptions, loading, selectedSubscription} = useAppSelector(
    state => state.subscription,
  );

  const loadSubscriptions = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const subs = await subscriptionService.getSubscriptions();
      dispatch(setSubscriptions(subs));

      // Auto-select the best value option (3 monthly with 50% discount)
      const bestValue = subs.find(sub => sub.sku.includes('3_monthly'));
      if (bestValue) {
        dispatch(setSelectedSubscription(bestValue));
      }
    } catch (error) {
      console.error('Error loading subscriptions:', error);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const selectSubscription = useCallback(
    (subscription: ISubscription) => {
      dispatch(setSelectedSubscription(subscription));
    },
    [dispatch],
  );

  const purchaseSubscription = useCallback(
    async (subscription: ISubscription) => {
      try {
        const success = await subscriptionService.purchaseSubscription(
          subscription,
        );
        return success;
      } catch (error) {
        console.error('Purchase error:', error);
        return false;
      }
    },
    [],
  );

  const restorePurchases = useCallback(async () => {
    try {
      const success = await subscriptionService.restorePurchases();
      return success;
    } catch (error) {
      console.error('Restore error:', error);
      return false;
    }
  }, []);

  const clearSubscriptionData = useCallback(() => {
    dispatch(clearSubscriptions());
  }, [dispatch]);

  return {
    subscriptions,
    loading,
    selectedSubscription,
    loadSubscriptions,
    selectSubscription,
    purchaseSubscription,
    restorePurchases,
    clearSubscriptionData,
  };
};
