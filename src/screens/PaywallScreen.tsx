import React, {useState, useRef} from 'react';
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

const PaywallScreen = () => {
  const [activePlan, setActivePlan] = useState('essential');
  const [expandedPlans, setExpandedPlans] = useState<{[key: string]: boolean}>(
    {},
  );
  const scrollY = useRef(new Animated.Value(0)).current;

  const plans = [
    {
      id: 'essential',
      name: 'ESSENTIAL',
      price: '₺916,67',
      yearlyPrice: '₺10.999,99/yıl',
      description:
        'Daha fazla grafik, aralık ve gösterge ile dikkat dağıtmayan işlem ve yatırım',
      savings: 'Yılda ₺2.319,89 tasarruf edin*',
    },
    {
      id: 'pro',
      name: 'PRO',
      price: '₺1.333,33',
      yearlyPrice: '₺15.999,99/yıl',
      description:
        'Gelişmiş analitik araçlar ve özel sinyaller ile profesyonel trading deneyimi',
      savings: 'Yılda ₺4.499,89 tasarruf edin*',
    },
    {
      id: 'premium',
      name: 'PREMIUM',
      price: '₺2.083,33',
      yearlyPrice: '₺24.999,99/yıl',
      description:
        'En gelişmiş özellikler, özel danışmanlık ve VIP destek ile eksklüzif deneyim',
      savings: 'Yılda ₺7.999,89 tasarruf edin*',
    },
  ];

  const handlePlanPress = (planId: string) => {
    setActivePlan(planId);
  };

  const togglePlanExpansion = (planId: string) => {
    setExpandedPlans(prev => ({
      ...prev,
      [planId]: !prev[planId],
    }));
  };

  const handleUpgrade = () => {
    console.log('Upgrading to plan:', activePlan);
    // Add your upgrade logic here
  };

  const renderPlanCard = (plan: any) => {
    const isActive = plan.id === activePlan;
    const isExpanded = expandedPlans[plan.id];

    return (
      <TouchableOpacity
        key={plan.id}
        style={styles.pricingCard}
        onPress={() => handlePlanPress(plan.id)}>
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

            <View style={styles.savingsNotification}>
              <Text style={styles.savingsNotificationText}>{plan.savings}</Text>
            </View>

            <View style={styles.planHeader}>
              <View style={styles.planBadge}>
                <Text style={styles.planBadgeText}>{plan.name}</Text>
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>
                  {plan.price}
                  <Text style={styles.periodInline}>/ay</Text>
                </Text>
                <Text style={styles.yearlyPrice}>{plan.yearlyPrice}</Text>
              </View>
            </View>

            <Text style={styles.planDescription}>{plan.description}</Text>

            <TouchableOpacity
              style={styles.advantagesButton}
              onPress={() => togglePlanExpansion(plan.id)}>
              <Text style={styles.advantagesText}>Avantajları görün</Text>
              <Icon
                name={isExpanded ? 'expand-less' : 'expand-more'}
                size={20}
                color="#fff"
              />
            </TouchableOpacity>

            {isExpanded && (
              <View style={styles.advantagesList}>
                <Text style={styles.advantagesTitle}>Avantajlar:</Text>
                <Text style={styles.advantagesItem}>
                  • Gelişmiş grafik araçları
                </Text>
                <Text style={styles.advantagesItem}>• Özel sinyaller</Text>
                <Text style={styles.advantagesItem}>• 7/24 destek</Text>
                <Text style={styles.advantagesItem}>• Reklamsız deneyim</Text>
              </View>
            )}
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

        {/* Pricing Cards */}
        <View style={styles.pricingContainer}>{plans.map(renderPlanCard)}</View>

        {/* Restore Purchases Button */}
        <View style={styles.restoreContainer}>
          <TouchableOpacity style={styles.restoreButton}>
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
  periodInline: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '300',
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
  advantagesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  advantagesText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  advantagesList: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  advantagesTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  advantagesItem: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
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
});

export default PaywallScreen;
