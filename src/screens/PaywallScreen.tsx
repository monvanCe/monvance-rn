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
import {getSubscriptions} from 'react-native-iap';

const PaywallScreen = () => {
  const [activePlan, setActivePlan] = useState('essential');
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchSubs = async () => {
      try {
        const subs = await getSubscriptions({
          skus: ['vens_weekly'],
        });
        console.log('subs', subs);
      } catch (error) {
        console.log('error', error);
      }
    };
    fetchSubs();
  }, []);

  // Mock data
  const mockSubscriptions = [
    {
      _id: 'weekly',
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
      _id: 'monthly',
      sku: 'vens_monthly',
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
      _id: '3monthly',
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

  const mockPremiumAdvantages = [
    'Fast Notifications',
    'Precise Signals',
    'Ad-Free Experience',
    'Priority Chat and Support Access',
  ];

  const handlePlanPress = (planId: string) => {
    setActivePlan(planId);
  };

  const handleUpgrade = () => {
    console.log('Upgrading to plan:', activePlan);
    // Mock upgrade logic
  };

  const handleRestorePurchases = () => {
    console.log('Restoring purchases...');
    // Mock restore logic
  };

  const renderPlanCard = (subscription: any) => {
    const isActive = subscription._id === activePlan;

    // Generate plan name based on interval
    const getPlanName = (subscription: any) => {
      if (subscription.interval === 1 && subscription.intervalDays === 7)
        return 'WEEKLY';
      if (subscription.interval === 1 && subscription.intervalDays === 30)
        return 'MONTHLY';
      if (subscription.interval === 3 && subscription.intervalDays === 30)
        return '3 MONTHLY';
      return 'PLAN';
    };

    // Generate price display
    const getPriceDisplay = (subscription: any) => {
      if (subscription.discount > 0) {
        return `${subscription.discount}% İndirim`;
      }
      return 'Normal Fiyat';
    };

    return (
      <TouchableOpacity
        key={subscription._id}
        style={styles.pricingCard}
        onPress={() => handlePlanPress(subscription._id)}>
        <LinearGradient
          colors={
            isActive
              ? ['#E74C3C', '#F39C12', '#E67E22', '#D35400', '#C0392B']
              : ['#999', '#666', '#333', '#111', '#333', '#666', '#999']
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

            {subscription.discount > 0 && (
              <View style={styles.savingsNotification}>
                <Text style={styles.savingsNotificationText}>
                  {subscription.discount}% İndirim
                </Text>
              </View>
            )}

            <View style={styles.planHeader}>
              <View style={styles.planBadge}>
                <Text style={styles.planBadgeText}>
                  {getPlanName(subscription)}
                </Text>
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>
                  {getPriceDisplay(subscription)}
                </Text>
                <Text style={styles.yearlyPrice}>
                  {subscription.interval}{' '}
                  {subscription.intervalDays === 30 ? 'ay' : 'hafta'}
                </Text>
              </View>
            </View>

            <Text style={styles.planDescription}>
              {subscription.interval === 1 && subscription.intervalDays === 7
                ? 'Haftalık plan ile esnek abonelik'
                : subscription.interval === 1 &&
                  subscription.intervalDays === 30
                ? 'Aylık plan ile uygun fiyat'
                : '3 aylık plan ile en iyi değer'}
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
        <TouchableOpacity style={styles.backButton}>
          <Icon name="chevron-left" size={40} color="#fff" />
          <Text style={styles.backText}>Geri</Text>
        </TouchableOpacity>
        <View style={styles.profileContainer}>
          <Text style={styles.profileText}>monvanCe</Text>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileInitial}>M</Text>
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
            <Text style={styles.heroTitle}>Yükseltilmiş planlar</Text>
          </View>
        </View>

        {/* Premium Advantages Section */}
        {mockPremiumAdvantages.length > 0 && (
          <View style={styles.advantagesSection}>
            <Text style={styles.advantagesSectionTitle}>
              Premium Avantajlar
            </Text>
            <View style={styles.advantagesList}>
              {mockPremiumAdvantages.map((advantage, index) => (
                <View key={index} style={styles.advantageItem}>
                  <Text style={styles.advantageText}>• {advantage}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Pricing Cards */}
        <View style={styles.pricingContainer}>
          {mockSubscriptions.map(renderPlanCard)}
        </View>

        {/* Restore Purchases Button */}
        <View style={styles.restoreContainer}>
          <TouchableOpacity
            style={styles.restoreButton}
            onPress={handleRestorePurchases}>
            <Text style={styles.restoreButtonText}>
              Satın alınanları geri yükle
            </Text>
          </TouchableOpacity>
        </View>

        {/* Spacer for fixed button */}
        <View style={styles.bottomSpacer} />
      </Animated.ScrollView>

      {/* Fixed Upgrade Button */}
      <View style={styles.fixedUpgradeContainer}>
        <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgrade}>
          <LinearGradient
            colors={['#E74C3C', '#F39C12', '#E67E22', '#D35400', '#C0392B']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.upgradeGradient}>
            <Text style={styles.upgradeButtonText}>Şimdi yükselt</Text>
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
    height: 300,
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
    borderRadius: 20,
  },
  cardContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 18,
    padding: 20,
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
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
  upgradeGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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
  advantagesSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    marginHorizontal: 20,
    marginTop: 20,
  },
  advantagesSectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 15,
  },
  advantagesList: {
    // No specific styles for the list container
  },
  advantageItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  advantageText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'left',
  },
});

export default PaywallScreen;
