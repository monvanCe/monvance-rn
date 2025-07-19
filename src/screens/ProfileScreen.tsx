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

const AVATAR_SIZE = 64;
const PLACEHOLDER =
  'https://ui-avatars.com/api/?name=User&background=aaa&color=fff&size=192';

const APP_VERSION = '1.0.0';

const ProfileScreen = () => {
  const {theme} = useTheme();
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
    <View style={{flex: 1, backgroundColor: theme.colors.background}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: theme.ui.spacing * 2,
          paddingTop: theme.ui.spacing * 3,
          paddingBottom: theme.ui.spacing * 2,
        }}>
        <Text
          style={{
            fontSize: 28,
            fontWeight: '700',
            color: theme.colors.onSurface,
          }}>
          {t('settings')}
        </Text>
        <TouchableOpacity style={{position: 'relative'}}>
          <View
            style={{
              backgroundColor: theme.colors.surfaceVariant,
              borderRadius: 100,
              padding: theme.ui.spacing,
            }}>
            <Icon name="bell" size={28} color={theme.colors.premium} />
            <View
              style={{
                position: 'absolute',
                top: 2,
                right: 2,
                backgroundColor: theme.colors.error,
                minWidth: 18,
                height: 18,
                borderRadius: 9,
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2,
                paddingHorizontal: 3,
              }}>
              <Text
                style={{
                  color: theme.colors.onSurface,
                  fontWeight: '700',
                  fontSize: 11,
                }}>
                2
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      <View style={{alignItems: 'center', marginBottom: theme.ui.spacing * 2}}>
        <Image
          source={{uri: avatar}}
          style={{
            width: AVATAR_SIZE,
            height: AVATAR_SIZE,
            borderRadius: AVATAR_SIZE / 2,
            borderWidth: 2,
            borderColor: theme.colors.surface,
            marginBottom: theme.ui.spacing,
          }}
        />
        <Text
          style={{fontSize: 20, fontWeight: '700', color: theme.colors.text}}>
          {username}
        </Text>
      </View>
      <View
        style={{
          gap: theme.ui.spacing * 1.5,
          paddingHorizontal: theme.ui.spacing * 2,
        }}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
              borderRadius: theme.ui.radius,
            },
          ]}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: theme.ui.spacing,
              }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '600',
                  color: theme.colors.onSurface,
                }}>
                👑 {t('dark_mode')}
              </Text>
            </View>
            <ThemeToggle />
          </View>
          <Text style={{color: theme.colors.onSurfaceVariant, marginTop: 2}}>
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
            style={{
              color: theme.colors.onSurfaceVariant,
              fontSize: 13,
              fontWeight: '600',
              marginBottom: 2,
            }}>
            {t('language')}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: theme.ui.spacing,
              }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '600',
                  color: theme.colors.onSurface,
                }}>
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
          <Text style={{color: theme.colors.onSurfaceVariant, marginTop: 2}}>
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
            style={{
              color: theme.colors.onSurfaceVariant,
              fontSize: 13,
              fontWeight: '600',
              marginBottom: 2,
            }}>
            {t('about')}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
                color: theme.colors.onSurface,
              }}>
              {t('version')}
            </Text>
            <Text style={{fontSize: 16, color: theme.colors.onSurfaceVariant}}>
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
            style={{
              color: theme.colors.onSurfaceVariant,
              fontSize: 13,
              fontWeight: '600',
              marginBottom: 2,
            }}>
            {t('support')}
          </Text>
          <TouchableOpacity
            onPress={handleFeedback}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: theme.ui.spacing,
            }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
                color: theme.colors.onSurface,
              }}>
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
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
                color: theme.colors.onSurface,
              }}>
              {t('clear_cache')}
            </Text>
            <Icon
              name="help-circle-outline"
              size={22}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
          <Text style={{color: theme.colors.onSurfaceVariant, marginTop: 2}}>
            {t('clear_cache_desc')}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 18,
    marginBottom: 0,
    marginTop: 0,
    marginHorizontal: 0,
    gap: 8,
  },
});

export default ProfileScreen;
