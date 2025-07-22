import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import {useTheme} from '../context/ThemeContext';
import {useAppSelector} from '../store/store';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Text} from '../components/ui/Text';
import ThemeToggle from '../components/ui/ThemeSwitch';
import {Dropdown} from '../components/ui/Dropdown';
import {t} from '../localization';
import {eventBus} from '../middleware/eventMiddleware';
import NotificationIcon from '../components/NotificationIcon';

const AVATAR_SIZE = 64;
const PLACEHOLDER =
  'https://ui-avatars.com/api/?name=User&background=aaa&color=fff&size=192';

const APP_VERSION = '1.0.0';

const ProfileScreen = () => {
  const {theme} = useTheme();
  const styles = style(theme);
  const user = useAppSelector(state => state.auth);
  const appLanguage = useAppSelector(state => state.appConfig.appLanguage);
  const avatar = user.avatar || PLACEHOLDER;
  const username = user.username || 'User';

  const handleLanguageChange = (lang: string) => {
    eventBus.emit('languageChanged', lang);
  };

  const handleFeedback = () => {
    Linking.openURL('mailto:support@klyra.app?subject=Feedback');
  };

  const handleClearCache = () => {
    Alert.alert(t('clear_cache'), t('clear_cache_desc'));
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>{t('settings')}</Text>
        <NotificationIcon />
      </View>
      <View style={styles.avatarContainer}>
        <Image source={{uri: avatar}} style={styles.avatar} />
        <Text style={styles.username}>{username}</Text>
      </View>
      <View style={styles.cardsWrapper}>
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
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
              borderRadius: theme.ui.radius,
            },
          ]}>
          <Text
            style={[
              styles.cardSubtitle,
              {color: theme.colors.onSurfaceVariant, marginBottom: 2},
            ]}>
            {t('language')}
          </Text>
          <View style={styles.cardRow}>
            <View style={[styles.cardRowLeft, {gap: theme.ui.spacing}]}>
              <Text style={[styles.cardTitle, {color: theme.colors.onSurface}]}>
                {t(appLanguage === 'tr' ? 'turkish' : 'english')}
              </Text>
            </View>
            <Dropdown
              selectedValue={appLanguage}
              onSelect={handleLanguageChange}
              items={[
                {label: t('english'), value: 'en'},
                {label: t('turkish'), value: 'tr'},
              ]}
              variant="outlined"
            />
          </View>
          <Text
            style={[
              styles.cardSubtitle,
              {color: theme.colors.onSurfaceVariant, marginTop: 2},
            ]}>
            {t('choose_language')}
          </Text>
        </View>
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
              borderRadius: theme.ui.radius,
            },
          ]}>
          <Text
            style={[
              styles.cardSubtitle,
              {color: theme.colors.onSurfaceVariant, marginBottom: 2},
            ]}>
            {t('about')}
          </Text>
          <View style={styles.cardRow}>
            <Text style={[styles.cardTitle, {color: theme.colors.onSurface}]}>
              {t('version')}
            </Text>
            <Text
              style={[
                styles.cardVersion,
                {color: theme.colors.onSurfaceVariant},
              ]}>
              {APP_VERSION}
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
              borderRadius: theme.ui.radius,
            },
          ]}>
          <Text
            style={[
              styles.cardSubtitle,
              {color: theme.colors.onSurfaceVariant, marginBottom: 2},
            ]}>
            {t('support')}
          </Text>
          <TouchableOpacity
            onPress={handleFeedback}
            style={[styles.cardRowButton, {marginBottom: theme.ui.spacing}]}>
            <Text style={[styles.cardTitle, {color: theme.colors.onSurface}]}>
              {t('feedback')}
            </Text>
            <Icon
              name="help-circle-outline"
              size={22}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleClearCache}
            style={styles.cardRowButton}>
            <Text style={[styles.cardTitle, {color: theme.colors.onSurface}]}>
              {t('clear_cache')}
            </Text>
            <Icon
              name="help-circle-outline"
              size={22}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
          <Text
            style={[
              styles.cardSubtitle,
              {color: theme.colors.onSurfaceVariant, marginTop: 2},
            ]}>
            {t('clear_cache_desc')}
          </Text>
        </View>
      </View>
    </View>
  );
};

const style = (theme: ReturnType<typeof useTheme>['theme']) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.ui.spacing * 2,
      paddingTop: theme.ui.spacing * 2,
      paddingBottom: theme.ui.spacing * 2,
    },
    headerTitle: {
      fontSize: theme.ui.fontSize * 2,
      fontWeight: '700',
      color: theme.colors.onSurface,
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
    card: {
      padding: 18,
      marginBottom: 0,
      marginTop: 0,
      marginHorizontal: 0,
      gap: 8,
    },
    cardRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    cardRowLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    cardTitle: {
      fontSize: theme.ui.fontSize * 1.125,
      fontWeight: '600',
    },
    cardSubtitle: {
      fontSize: theme.ui.fontSize * 0.8125,
      fontWeight: '600',
    },
    cardVersion: {
      fontSize: theme.ui.fontSize * 1,
    },
    cardRowButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  });

export default ProfileScreen;
