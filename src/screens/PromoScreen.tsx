import React, {useEffect, useMemo, useRef, useState} from 'react';
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
import {getPlanBadgeText} from '../utils/paywall';
import {getCompactPremiumBenefits} from '../const/defaultBenefits';
import {eventBus} from '../middleware/eventMiddleware';
import {useTheme} from '../context/ThemeContext';

const PromoScreen = () => {
  const [activePlan, setActivePlan] = useState<string | null>(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  useLocalization();
  const navigation = useNavigation<any>();
  const user = useAppSelector(state => state.auth);
  const {trialTime} = useAppSelector(state => state.subscription);
  const {theme} = useTheme();

  const {
    subscriptions,
    premiumAdvantages,
    loading,
    isPriceLoading,
    selectedSubscription,
    handlePlanSelection,
    handlePurchase,
    handleRestorePurchases,
  } = usePaywall({usePromo: true});

  const maxDiscountValue = subscriptions.reduce((max, sub) => {
    return Math.max(max, sub.discount);
  }, 0);

  // Countdown for trial time
  const [remainingText, setRemainingText] = useState('');
  useEffect(() => {
    const target = trialTime ? new Date(trialTime).getTime() : Date.now();
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, target - now);
      const hrs = Math.floor(diff / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setRemainingText(`${hrs}h ${mins}m ${secs}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, [trialTime]);

  // Extra hero sparkles
  const sparkles = useMemo(
    () =>
      [...Array(8)].map(() => ({
        x: Math.random() * 220 + 40,
        delay: Math.floor(Math.random() * 800),
        translateY: new Animated.Value(0),
        opacity: new Animated.Value(0),
        scale: new Animated.Value(0.6),
      })),
    [],
  );

  useEffect(() => {
    const loops = sparkles.map(({translateY, opacity, scale, delay}) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(translateY, {
              toValue: -24,
              duration: 1600,
              useNativeDriver: true,
            }),
            Animated.sequence([
              Animated.timing(opacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
              }),
              Animated.timing(opacity, {
                toValue: 0,
                duration: 1300,
                useNativeDriver: true,
              }),
            ]),
            Animated.sequence([
              Animated.timing(scale, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
              }),
              Animated.timing(scale, {
                toValue: 0.6,
                duration: 1300,
                useNativeDriver: true,
              }),
            ]),
          ]),
          Animated.timing(translateY, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ),
    );
    loops.forEach(l => l.start());
    return () => loops.forEach(l => l.stop());
  }, [sparkles]);

  // Pulsing highlight for selected plan
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [pulse]);
  const pulseOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 0.6],
  });

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
    if (subscriptions.length > 0) {
      setActivePlan(subscriptions[0]._id);
    }
  }, [subscriptions]);

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
      // Close will be handled by event listener
    }
  };

  const renderPlanCard = (subscription: ISubscription) => {
    const isActive = subscription._id === activePlan;
    const planBadge = getPlanBadgeText(subscription, t);

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
        {/* Pulsing highlight for selected */}
        {isActive && (
          <Animated.View
            pointerEvents="none"
            style={[styles.pulseOverlay, {opacity: pulseOpacity}]}
          />
        )}
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
              outputRange: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.6)'],
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
          {/* Sparkles layer */}
          <View style={styles.sparklesLayer} pointerEvents="none">
            {sparkles.map((s, i) => (
              <Animated.View
                key={i}
                style={[
                  styles.sparkle,
                  {left: s.x},
                  {transform: [{translateY: s.translateY}, {scale: s.scale}]},
                  {opacity: s.opacity},
                ]}
              />
            ))}
          </View>
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

            {/* Limited Offer Banner */}
            <View style={styles.offerBanner}>
              <View style={styles.offerBadge}>
                <Icon name="local-fire-department" size={16} color="#FF6B35" />
                <Text style={styles.limitedOfferText}>LIMITED TIME OFFER</Text>
              </View>
              <Text style={styles.discountText}>
                Save up to{' '}
                <Text style={styles.discountHighlight}>
                  {maxDiscountValue}% OFF
                </Text>
              </Text>
            </View>

            {/* Big Timer */}
            <View style={styles.bigTimerContainer}>
              <View style={styles.countdownBadge}>
                <View style={styles.countdownContent}>
                  <Text style={styles.offerExpiresText}>OFFER EXPIRES IN</Text>
                  <Text style={styles.bigCountdownText}>{remainingText}</Text>
                  <View style={styles.countdownGlow} />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Premium Advantages Section */}
        <BenefitsList
          benefits={
            premiumAdvantages.length > 0
              ? premiumAdvantages
              : getCompactPremiumBenefits()
          }
          title={t('premium_benefits')}
          style={styles.benefitsContainer}
        />

        {/* Pricing Cards */}
        <View style={styles.pricingContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>{t('packages_loading')}</Text>
            </View>
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
  sparklesLayer: {
    position: 'absolute',
    bottom: '40%',
    left: 0,
    right: 0,
    height: 80,
  },
  sparkle: {
    position: 'absolute',
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#16C784',
  },
  heroSection: {},
  heroContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 75,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'center',
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
    marginBottom: 8,
  },
  countdownBadge: {
    alignSelf: 'flex-start',
    borderRadius: 16,
    overflow: 'hidden',
  },
  countdownGradient: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  countdownText: {
    color: '#000',
    fontWeight: '800',
    fontSize: 12,
  },
  offerBanner: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  offerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.3)',
    shadowColor: '#FF6B35',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  limitedOfferText: {
    color: '#FF6B35',
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 1.2,
    marginLeft: 6,
    textTransform: 'uppercase',
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.3,
    lineHeight: 28,
  },
  discountHighlight: {
    color: '#FF6B35',
    fontWeight: '800',
  },
  bigTimerContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  countdownContent: {
    position: 'relative',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  offerExpiresText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  bigCountdownText: {
    color: '#16C784',
    fontWeight: '800',
    fontSize: 24,
    textAlign: 'center',
    letterSpacing: 2,
    fontFamily: 'monospace',
  },
  countdownGlow: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 30,
    zIndex: -1,
  },
  pricingContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  pricingCard: {
    marginBottom: 8,
  },
  cardGradient: {
    padding: 2,
    borderRadius: 20,
  },
  cardContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 18,
    padding: 10,
    position: 'relative',
  },
  pulseOverlay: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    backgroundColor: 'rgba(22, 199, 132, 0.25)',
    borderRadius: 22,
    zIndex: 1,
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
  planDescription: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
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
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  upgradeButtonTextDisabled: {
    color: '#333',
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

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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
  benefitsContainer: {
    marginHorizontal: 20,
    marginTop: 20,
  },
});

export default PromoScreen;
