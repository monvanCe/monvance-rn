import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {useTheme} from '../context/ThemeContext';
import {useAppSelector} from '../store/store';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ThemeToggle from '../components/ui/ThemeToggle';

const AVATAR_SIZE = 96;
const BADGE_SIZE = 28;
const ONLINE_SIZE = 18;
const PLACEHOLDER =
  'https://ui-avatars.com/api/?name=User&background=aaa&color=fff&size=192';

const ProfileScreen = () => {
  const {theme} = useTheme();
  const user = useAppSelector(state => state.auth);
  const isPremium = !!user.isPremium;
  const isAdmin = !!user.isAdmin;
  const avatar = user.avatar || PLACEHOLDER;
  const username = user.username || 'Kullanıcı';
  const bio = user.bio || '';
  const online = user.isOnline;

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View style={styles.profileTop}>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <View>
            <Image source={{uri: avatar}} style={styles.avatar} />
            {online && (
              <View
                style={[
                  styles.onlineDot,
                  {
                    backgroundColor: '#2ecc40',
                    borderColor: theme.colors.background,
                  },
                ]}
              />
            )}
            {isAdmin && (
              <View
                style={[
                  styles.adminBadge,
                  {
                    backgroundColor: theme.colors.secondary,
                    borderColor: theme.colors.background,
                  },
                ]}>
                <Icon
                  name="shield-crown"
                  size={16}
                  color={theme.colors.primary}
                />
              </View>
            )}
          </View>
        </View>
        <View style={{alignItems: 'center', marginTop: 16}}>
          <Text
            style={[
              styles.username,
              {color: isPremium ? theme.colors.primary : theme.colors.text},
            ]}>
            {username}
          </Text>
          {!!bio && (
            <Text style={[styles.bio, {color: theme.colors.onSurfaceVariant}]}>
              {bio}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.section}>
        <ThemeToggle />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 48,
  },
  profileTop: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 3,
    borderColor: '#fff',
    alignSelf: 'center',
  },
  onlineDot: {
    position: 'absolute',
    right: 6,
    bottom: 6,
    width: ONLINE_SIZE,
    height: ONLINE_SIZE,
    borderRadius: ONLINE_SIZE / 2,
    borderWidth: 3,
  },
  adminBadge: {
    position: 'absolute',
    left: 6,
    bottom: 6,
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: BADGE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
  },
  username: {
    fontSize: 24,
    fontWeight: '700',
  },
  bio: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
    maxWidth: 280,
  },
  section: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
});

export default ProfileScreen;
