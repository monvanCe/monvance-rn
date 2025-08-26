import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import {useTheme} from '../context/ThemeContext';
import {useAppSelector} from '../store/store';
import {Text} from '../components/ui/Text';
import SettingsSection from '../components/ui/SettingsSection';
import SettingsItem from '../components/ui/SettingsItem';
import PremiumButton from '../components/ui/PremiumButton';
import {Dropdown} from '../components/ui/Dropdown';
import {t} from '../localization';
import {eventBus} from '../middleware/eventMiddleware';
import ScreenHeader, {HeaderAction} from '../components/ui/ScreenHeader';
import PromoButton from '../components/ui/PromoButton';
import WebView from '../components/ui/WebView';
import {useNavigation} from '@react-navigation/native';

const AVATAR_SIZE = 64;
const PLACEHOLDER =
  'https://ui-avatars.com/api/?name=User&background=aaa&color=fff&size=192';

const APP_VERSION = '1.0.0';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const {theme} = useTheme();
  const styles = style(theme);
  const user = useAppSelector(state => state.auth);
  const {trialTime, hasVisitedPaywall} = useAppSelector(
    state => state.subscription,
  );
  const appLanguage = useAppSelector(state => state.appConfig.appLanguage);
  const avatar = user.avatar || PLACEHOLDER;
  const username = user.username || 'User';

  const [webViewVisible, setWebViewVisible] = useState(false);
  const [webViewUri, setWebViewUri] = useState('');
  const [webViewTitle, setWebViewTitle] = useState('');

  const handleLanguageChange = (lang: string) => {
    eventBus.emit('languageChanged', lang);
  };

  const handleFeedback = () => {
    navigation.navigate('FeedbackScreen' as never);
  };

  const handleSupportEmail = () => {
    const userId = user._id || 'unknown';
    const emailSubject = encodeURIComponent('Support Request');
    const emailBody = encodeURIComponent(`User ID: ${userId}\n\nThis ID will help you identify my account. Please don't delete this ID.\n\nSupport Request:\n\n`);
    const mailtoUrl = `mailto:support@cekolabs.com?subject=${emailSubject}&body=${emailBody}`;
    
    Linking.openURL(mailtoUrl).catch((error) => {
      console.error('Error opening email app:', error);
      Alert.alert('Error', 'Could not open email app. Please contact support@cekolabs.com manually.');
    });
  };

  const handlePrivacyPolicy = () => {
    setWebViewUri('https://vens.cekolabs.com/policy');
    setWebViewTitle(t('privacy_policy'));
    setWebViewVisible(true);
  };

  const handleTermsOfUse = () => {
    setWebViewUri('https://vens.cekolabs.com/terms');
    setWebViewTitle(t('terms_of_use'));
    setWebViewVisible(true);
  };

  const handleCloseWebView = () => {
    setWebViewVisible(false);
  };

  const handleGoPremium = () => {
    navigation.navigate('Paywall' as never);
  };

  const headerActions: HeaderAction[] = [
    /*
    {
      iconName: 'account-edit',
      iconLibrary: 'MaterialCommunityIcons' as const,
      onPress: () => {
        // Add edit profile action here
        console.log('Edit profile pressed');
      },
    },
    {
      iconName: 'cog',
      iconLibrary: 'MaterialCommunityIcons' as const,
      onPress: () => {
        // Add settings action here
        console.log('Settings pressed');
      },
    },
      */
  ];

  if (webViewVisible) {
    return (
      <WebView
        uri={webViewUri}
        title={webViewTitle}
        onClose={handleCloseWebView}
      />
    );
  }

  const showPromo =
    Boolean(trialTime) &&
    hasVisitedPaywall &&
    !user?.isPremium &&
    new Date(trialTime || 0).getTime() > Date.now();

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={t('settings')}
        actions={headerActions}
        rightExtra={
          showPromo ? <PromoButton trialTime={trialTime as string} /> : null
        }
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.avatarContainer}>
          <Image source={{uri: avatar}} style={styles.avatar} />
          <Text style={styles.username}>{username}</Text>
        </View>
        <View style={styles.cardsWrapper}>
          {/* Premium Card */}
          <SettingsSection>
            <SettingsItem
              title={t('premium')}
              subtitle={t('unlock_all_features')}
              leftIcon="crown"
              leftIconColor="#FFD700"
              rightElement={
                <PremiumButton title={t('go_premium')} onPress={handleGoPremium} />
              }
            />
          </SettingsSection>
          {/*
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
              borderRadius: theme.ui.radius,
            },
          ]}>
            
          <View style={styles.cardRow}>
            <View style={[styles.cardRowLeft, {gap: theme.ui.spacing}]}>
              <Text style={[styles.cardTitle, {color: theme.colors.onSurface}]}>
                👑 {t('dark_mode')}
              </Text>
            </View>
            <ThemeToggle />
          </View>

          <Text
            style={[
              styles.cardSubtitle,
              {color: theme.colors.onSurfaceVariant, marginTop: 2},
            ]}>
            {t('switch_to_light')}
          </Text>
        </View>
                  */}

          <SettingsSection title={t('language')}>
            <SettingsItem
              title={t(appLanguage === 'tr' ? 'turkish' : 'english')}
              subtitle={t('choose_language')}
              rightElement={
                <Dropdown
                  selectedValue={appLanguage}
                  onSelect={handleLanguageChange}
                  items={[
                    {label: t('english'), value: 'en'},
                    {label: t('turkish'), value: 'tr'},
                  ]}
                  variant="outlined"
                />
              }
            />
          </SettingsSection>

          <SettingsSection title={t('support')}>
            <SettingsItem
              title={t('feedback')}
              rightIcon="help-circle-outline"
              onPress={handleFeedback}
              showDivider
            />
            <SettingsItem
              title="Email Support"
              subtitle="support@cekolabs.com"
              rightIcon="mail"
              onPress={handleSupportEmail}
              showDivider
            />
            <SettingsItem
              title={t('privacy_policy')}
              rightIcon="shield-account-outline"
              onPress={handlePrivacyPolicy}
              showDivider
            />
            <SettingsItem
              title={t('terms_of_use')}
              rightIcon="file-document-outline"
              onPress={handleTermsOfUse}
            />
          </SettingsSection>
          <SettingsSection title={t('about')}>
            <SettingsItem
              title={t('version')}
              rightElement={
                <Text style={{color: theme.colors.onSurfaceVariant}}>
                  {APP_VERSION}
                </Text>
              }
            />
          </SettingsSection>
        </View>
      </ScrollView>
    </View>
  );
};

const style = (theme: ReturnType<typeof useTheme>['theme']) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: theme.ui.spacing * 4,
    },
    avatarContainer: {
      alignItems: 'center',
      marginBottom: theme.ui.spacing * 2,
    },
    avatar: {
      width: AVATAR_SIZE,
      height: AVATAR_SIZE,
      borderRadius: AVATAR_SIZE / 2,
      borderWidth: 2,
      borderColor: theme.colors.surface,
      marginBottom: theme.ui.spacing,
    },
    username: {
      fontSize: theme.ui.fontSize * 1.25,
      fontWeight: '700',
      color: theme.colors.text,
    },
    cardsWrapper: {
      gap: theme.ui.spacing * 1.5,
      paddingHorizontal: theme.ui.spacing * 2,
    },

  });

export default ProfileScreen;
