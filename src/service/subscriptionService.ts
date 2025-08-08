import {Platform} from 'react-native';
import {
  initConnection,
  getProducts,
  requestPurchase,
  finishTransaction,
  getAvailablePurchases,
  Product,
  ProductPurchase,
  purchaseUpdatedListener,
  purchaseErrorListener,
} from 'react-native-iap';

// Mock IAP service - in real app you would use react-native-iap or similar
class SubscriptionService {
  private subscriptions: ISubscription[] = [];
  private products: Product[] = [];
  private purchaseUpdateSubscription: any = null;
  private purchaseErrorSubscription: any = null;

  constructor() {
    this.initializeSubscriptions();
  }

  private initializeSubscriptions() {
    // Android subscriptions
    const androidSubscriptions: ISubscription[] = [
      {
        _id: '6889dbf8493a264c12f0ad2d',
        sku: 'vens_promo',
        platform: 'ANDROID',
        discount: 90,
        isActive: true,
        isPromo: true,
        interval: 1,
        intervalDays: 7,
        limits: {artwork: 0},
        isTrial: false,
        trialDays: 0,
      },
      {
        _id: '6889f67d493a264c12f0ad38',
        sku: 'vens_weekly',
        platform: 'ANDROID',
        discount: 0,
        isActive: true,
        isPromo: false,
        interval: 1,
        intervalDays: 7,
        limits: {artwork: 0},
        isTrial: false,
        trialDays: 0,
      },
      {
        _id: '6889f7ce493a264c12f0ad39',
        sku: 'vens_montly',
        platform: 'ANDROID',
        discount: 35,
        isActive: true,
        isPromo: false,
        interval: 1,
        intervalDays: 30,
        limits: {artwork: 0},
        isTrial: false,
        trialDays: 0,
      },
      {
        _id: '6889f90d493a264c12f0ad3a',
        sku: 'vens_3_monthly',
        platform: 'ANDROID',
        discount: 50,
        isActive: true,
        isPromo: false,
        interval: 3,
        intervalDays: 30,
        limits: {artwork: 0},
        isTrial: false,
        trialDays: 0,
      },
    ];

    // iOS subscriptions
    const iosSubscriptions: ISubscription[] = androidSubscriptions.map(sub => ({
      ...sub,
      platform: 'IOS',
      sku: sub.sku.replace('vens_', 'ios_'),
    }));

    this.subscriptions = [...androidSubscriptions, ...iosSubscriptions];
  }

  async initializeIAP() {
    try {
      await initConnection();
      console.log('IAP connection initialized');

      // Set up purchase listeners
      this.setupPurchaseListeners();
    } catch (error) {
      console.error('Failed to initialize IAP:', error);
    }
  }

  private setupPurchaseListeners() {
    // Listen for successful purchases
    this.purchaseUpdateSubscription = purchaseUpdatedListener(
      async (purchase: ProductPurchase) => {
        console.log('Purchase updated:', purchase);

        try {
          // Finish the transaction
          await finishTransaction({
            purchase,
            isConsumable: false,
          });

          console.log('Transaction finished successfully');
        } catch (error) {
          console.error('Error finishing transaction:', error);
        }
      },
    );

    // Listen for purchase errors
    this.purchaseErrorSubscription = purchaseErrorListener((error: any) => {
      console.error('Purchase error:', error);
    });
  }

  cleanup() {
    if (this.purchaseUpdateSubscription) {
      this.purchaseUpdateSubscription.remove();
    }
    if (this.purchaseErrorSubscription) {
      this.purchaseErrorSubscription.remove();
    }
  }

  async getSubscriptions(): Promise<ISubscription[]> {
    try {
      // Initialize IAP connection
      await this.initializeIAP();

      // Get current platform
      const currentPlatform = Platform.OS.toUpperCase() as 'ANDROID' | 'IOS';

      // Get SKUs for current platform
      const platformSubscriptions = this.subscriptions.filter(
        sub => sub.platform === currentPlatform,
      );

      const skus = platformSubscriptions.map(sub => sub.sku);

      // Fetch products from store
      this.products = await getProducts({skus});
      console.log('Fetched products:', this.products);

      return platformSubscriptions;
    } catch (error) {
      console.error('Error getting subscriptions:', error);
      // Fallback to mock data if IAP fails
      const currentPlatform = Platform.OS.toUpperCase() as 'ANDROID' | 'IOS';
      return this.subscriptions.filter(sub => sub.platform === currentPlatform);
    }
  }

  async purchaseSubscription(subscription: ISubscription): Promise<boolean> {
    try {
      console.log('Purchasing subscription:', subscription.sku);

      // Find the product for this subscription
      const product = this.products.find(p => p.productId === subscription.sku);
      if (!product) {
        console.error('Product not found for SKU:', subscription.sku);
        return false;
      }

      // Request purchase
      const purchase = await requestPurchase({
        sku: subscription.sku,
        skus: [subscription.sku],
      });

      console.log('Purchase successful:', purchase);

      // The purchase will be handled by the listener
      return true;
    } catch (error) {
      console.error('Purchase error:', error);
      return false;
    }
  }

  async restorePurchases(): Promise<boolean> {
    try {
      console.log('Restoring purchases...');

      const purchases = await getAvailablePurchases();
      console.log('Available purchases:', purchases);

      if (purchases.length > 0) {
        // Finish all available transactions
        for (const purchase of purchases) {
          await finishTransaction({
            purchase,
            isConsumable: false,
          });
        }

        console.log('Purchases restored successfully');
        return true;
      } else {
        console.log('No purchases found to restore');
        return false;
      }
    } catch (error) {
      console.error('Restore error:', error);
      return false;
    }
  }

  async validateReceipt(receipt: string): Promise<boolean> {
    try {
      // In real app, this would validate with your backend
      console.log('Validating receipt:', receipt);

      // Mock validation
      await new Promise(resolve => setTimeout(resolve, 1000));

      return true;
    } catch (error) {
      console.error('Receipt validation error:', error);
      return false;
    }
  }

  getSubscriptionPrice(subscription: ISubscription): {
    original: number;
    discounted: number;
    discount: number;
  } {
    // Try to get price from IAP products first
    const product = this.products.find(p => p.productId === subscription.sku);

    if (product && product.localizedPrice) {
      // Parse the price from IAP
      const price = parseFloat(product.localizedPrice.replace(/[^0-9.]/g, ''));
      const discountedPrice = price * (1 - subscription.discount / 100);

      return {
        original: price,
        discounted: discountedPrice,
        discount: subscription.discount,
      };
    }

    // Fallback to mock prices if IAP price not available
    const basePrices = {
      weekly: 9.99,
      monthly: 29.99,
      '3_monthly': 59.99,
    };

    const key = subscription.sku.includes('promo')
      ? 'weekly'
      : subscription.sku.includes('weekly')
      ? 'weekly'
      : subscription.sku.includes('montly')
      ? 'monthly'
      : '3_monthly';

    const basePrice = basePrices[key as keyof typeof basePrices];
    const discountedPrice = basePrice * (1 - subscription.discount / 100);

    return {
      original: basePrice,
      discounted: discountedPrice,
      discount: subscription.discount,
    };
  }

  getProductInfo(subscription: ISubscription): Product | null {
    return this.products.find(p => p.productId === subscription.sku) || null;
  }
}

export const subscriptionService = new SubscriptionService();
export default subscriptionService;
