import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  SafeAreaView,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {usePaywall} from '../hooks/usePaywall';
import {t} from '../localization';
import useLocalization from '../hooks/useLocalization';
import {useAppSelector} from '../store/store';
import {useNavigation} from '@react-navigation/native';
import PriceTag from '../components/PriceTag';
import BenefitsList from '../components/ui/BenefitsList';
import BenefitsSkeleton from '../components/ui/BenefitsSkeleton';
import PackageSkeleton from '../components/ui/PackageSkeleton';
import {getPlanBadgeText} from '../utils/paywall';
import {eventBus} from '../middleware/eventMiddleware';

const PaywallScreen = () => {
  const [activePlan, setActivePlan] = useState<string | null>(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  useLocalization();
  const navigation = useNavigation<any>();
  const user = useAppSelector(state => state.auth);

  const {
    subscriptions,
    premiumAdvantages,
    loading,
    isPriceLoading,
    selectedSubscription,
    handlePlanSelection,
    handlePurchase,
    handleRestorePurchases,
  } = usePaywall();

  useEffect(() => {
    eventBus.emit('paywallOpened', null);
    if (selectedSubscription) {
      setActivePlan(selectedSubscription._id);
    }
  }, [selectedSubscription]);

  // Auto-select first subscription when entering the screen
  useEffect(() => {
    if (subscriptions.length > 0 && !activePlan) {
      const firstSubscription = subscriptions[0];
      setActivePlan(firstSubscription._id);
      handlePlanSelection(firstSubscription);
    }
  }, [subscriptions, activePlan, handlePlanSelection]);

  useEffect(() => {
    const onPaid = () => {
      navigation.goBack();
    };
    eventBus.on('paymentSuccess', onPaid);
    eventBus.on('restorePurchasesSuccess', onPaid);
    return () => {
      eventBus.off('paymentSuccess', onPaid);
      eventBus.off('restorePurchasesSuccess', onPaid);
    };
  }, [navigation]);

  const handlePlanPress = (planId: string) => {
    setActivePlan(planId);
    const subscription = subscriptions.find(sub => sub._id === planId);
    if (subscription) {
      handlePlanSelection(subscription);
    }
  };

  const handleUpgrade = async () => {
    if (selectedSubscription) {
      await handlePurchase(selectedSubscription);
      // On success, paymentSuccess will update user; screen will be closed by listener in navigation hook
    }
  };

  const renderPlanCard = (subscription: ISubscription) => {
    const isActive = subscription._id === activePlan;

    const planBadge = getPlanBadgeText(subscription, t);

    // Generate price display with original and discounted prices
    const getPriceDisplay = (subscription: any) => {
      const hasFormatted = Boolean(subscription.formattedDiscountedPrice);
      const hasNumeric =
        typeof subscription.discountedPrice === 'number' &&
        !Number.isNaN(subscription.discountedPrice);
      const hasPriceData = hasFormatted || hasNumeric;
      const hasDiscount = subscription.discount > 0;

      if (hasPriceData && hasDiscount && subscription.originalPrice) {
        return (
          <PriceTag
            originalPrice={
              subscription.formattedOriginalPrice ||
              `${
                subscription.currency || ''
              }${subscription.originalPrice.toFixed(2)}`
            }
            price={
              subscription.formattedDiscountedPrice ||
              `${
                subscription.currency || ''
              }${subscription.discountedPrice.toFixed(2)}`
            }
            periodText={`${subscription.interval} ${
              subscription.intervalDays === 30 ? t('per_month') : t('per_week')
            }`}
          />
        );
      } else if (hasPriceData) {
        return (
          <PriceTag
            price={
              subscription.formattedDiscountedPrice ||
              `${
                subscription.currency || ''
              }${subscription.discountedPrice.toFixed(2)}`
            }
            periodText={`${subscription.interval} ${
              subscription.intervalDays === 30 ? t('per_month') : t('per_week')
            }`}
          />
        );
      } else if (hasDiscount) {
        // Only show discount badge elsewhere; here still show duration when price not resolved
        return (
          <PriceTag
            price={t('price_not_found')}
            periodText={`${subscription.interval} ${
              subscription.intervalDays === 30 ? t('per_month') : t('per_week')
            }`}
          />
        );
      }

      return (
        <PriceTag
          price={t('price_not_found')}
          periodText={`${subscription.interval} ${
            subscription.intervalDays === 30 ? t('per_month') : t('per_week')
          }`}
        />
      );
    };

    return (
      <TouchableOpacity
        key={subscription._id}
        style={styles.pricingCard}
        onPress={() => handlePlanPress(subscription._id)}>
        <LinearGradient
          colors={
            isActive
              ? ['#16C784', '#14B8A6', '#0EA5E9', '#8B5CF6', '#EC4899']
              : ['#333', '#222', '#111', '#000', '#111', '#222', '#333']
          }
          start={{x: 0, y: 0}}
          end={{x: 1, y: isActive ? 0 : 1}}
          style={styles.cardGradient}>
          <View style={styles.cardContent}>
            <View
              style={[
                styles.checkIcon,
                isActive ? styles.activeCheckIcon : styles.inactiveCheckIcon,
              ]}>
              {isActive ? (
                <Icon name="check" size={24} color="#000" />
              ) : (
                <Text style={styles.checkMark}></Text>
              )}
            </View>

            <View style={styles.savingsNotification}>
              <Text style={styles.savingsNotificationText}>
                {subscription.discount > 0
                  ? t('save_percent', {percent: subscription.discount})
                  : t('no_discount')}
              </Text>
            </View>

            <View style={styles.planHeader}>
              <View style={styles.planBadge}>
                <Text style={styles.planBadgeText}>{planBadge}</Text>
              </View>
              {isPriceLoading ? (
                <View style={styles.priceLoadingIndicator}>
                  <Text style={styles.priceLoadingText}>
                    {t('price_loading')}
                  </Text>
                </View>
              ) : (
                getPriceDisplay(subscription)
              )}
            </View>

            <Text style={styles.planDescription}>
              {subscription.interval === 1 && subscription.intervalDays === 7
                ? t('weekly_desc')
                : subscription.interval === 1 &&
                  subscription.intervalDays === 30
                ? t('monthly_desc')
                : subscription.interval === 12 &&
                  subscription.intervalDays === 30
                ? t('yearly_desc')
                : t('three_monthly_desc')}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Animated Header */}
      <Animated.View
        style={[
          styles.header,
          {
            backgroundColor: scrollY.interpolate({
              inputRange: [0, 50],
              outputRange: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.5)'],
              extrapolate: 'clamp',
            }),
          },
        ]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={40} color="#fff" />
          <Text style={styles.backText}>{t('back')}</Text>
        </TouchableOpacity>
        <View style={styles.profileContainer}>
          <Text style={styles.profileText}>
            {user?.username || t('unknown_user')}
          </Text>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileInitial}>
              {(user?.username || 'U').charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>
      </Animated.View>

      <Animated.ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: false},
        )}
        scrollEventThrottle={16}>
        {/* Background Image */}
        <View style={styles.backgroundContainer}>
          <Image
            source={require('../assets/paywall-background.jpeg')}
            style={styles.backgroundImage}
          />
          <Animated.View
            style={[
              styles.backgroundOverlay,
              {
                backgroundColor: scrollY.interpolate({
                  inputRange: [0, 50],
                  outputRange: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.5)'],
                  extrapolate: 'clamp',
                }),
              },
            ]}
          />
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroContent}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../assets/logo.png')}
                style={styles.logo}
              />
              <Text style={styles.appName}>Vens Signal</Text>
            </View>
            <Text style={styles.heroTitle}>{t('upgraded_plans')}</Text>
          </View>
        </View>

        {/* Premium Advantages Section */}
        {loading ? (
          <BenefitsSkeleton />
        ) : (
          <BenefitsList
            benefits={premiumAdvantages}
            title={t('premium_benefits')}
            style={styles.benefitsContainer}
          />
        )}

        {/* Pricing Cards */}
        <View style={styles.pricingContainer}>
          {loading ? (
            <>
              <PackageSkeleton />
              <PackageSkeleton />
              <PackageSkeleton />
            </>
          ) : subscriptions.length > 0 ? (
            subscriptions.map(renderPlanCard)
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>{t('no_packages')}</Text>
            </View>
          )}
        </View>

        {/* Restore Purchases Button */}
        <View style={styles.restoreContainer}>
          <TouchableOpacity
            style={styles.restoreButton}
            onPress={handleRestorePurchases}>
            <Text style={styles.restoreButtonText}>
              {t('restore_purchases')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Spacer for fixed button */}
        <View style={styles.bottomSpacer} />
      </Animated.ScrollView>

      {/* Fixed Upgrade Button */}
      <View style={styles.fixedUpgradeContainer}>
        <TouchableOpacity
          style={[
            styles.upgradeButton,
            !selectedSubscription && styles.upgradeButtonDisabled,
          ]}
          onPress={handleUpgrade}
          disabled={!selectedSubscription}>
          <LinearGradient
            colors={
              selectedSubscription
                ? ['#16C784', '#14B8A6', '#0EA5E9', '#8B5CF6', '#EC4899']
                : ['#666', '#555', '#444']
            }
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.upgradeGradient}>
            <Text
              style={[
                styles.upgradeButtonText,
                !selectedSubscription && styles.upgradeButtonTextDisabled,
              ]}>
              {loading
                ? t('processing')
                : selectedSubscription
                ? t('upgrade_now')
                : t('select_package')}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 16,
    paddingLeft: 4,
    paddingVertical: 12,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  backButton: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  backText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  profileText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
  },
  profileAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  backgroundOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  heroSection: {
    height: 200,
    position: 'relative',
  },
  heroContent: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 12,
    borderRadius: 10,
  },
  appName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  heroTitle: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 0,
  },
  pricingContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  pricingCard: {
    marginBottom: 12,
  },
  cardGradient: {
    padding: 2,
    borderRadius: 16,
  },
  cardContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 18,
    padding: 12,
    position: 'relative',
  },
  checkIcon: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeCheckIcon: {
    backgroundColor: '#fff',
  },
  inactiveCheckIcon: {
    borderWidth: 2,
    borderColor: '#444',
    backgroundColor: 'transparent',
  },
  checkMark: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  savingsNotification: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#333',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  savingsNotificationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  planHeader: {
    marginTop: 50,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  planBadge: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 16,
  },
  planBadgeText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  priceContainer: {
    alignItems: 'flex-end',
    flexDirection: 'column',
  },
  price: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  originalPrice: {
    color: '#999',
    fontSize: 14,
    textDecorationLine: 'line-through',
    marginBottom: 2,
  },
  discountedPrice: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  yearlyPrice: {
    color: '#999',
    fontSize: 16,
    fontWeight: '400',
  },
  planDescription: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  bottomSpacer: {
    height: 100,
  },
  fixedUpgradeContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#222',
  },
  upgradeButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  upgradeButtonDisabled: {
    opacity: 0.5,
  },
  upgradeGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  upgradeButtonTextDisabled: {
    color: '#999',
  },
  restoreContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  restoreButton: {
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  restoreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  benefitsContainer: {
    marginHorizontal: 20,
    marginTop: 12,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  noDataText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  priceLoadingIndicator: {
    backgroundColor: '#333',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-end',
  },
  priceLoadingText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default PaywallScreen;
