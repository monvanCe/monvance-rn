import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme as useAppTheme} from '../context/ThemeContext';
import {useAppSelector} from '../store/store';
import {Text} from './ui/Text';
import {useNavigation} from '@react-navigation/native';

const NotificationIcon = () => {
  const {theme: appTheme} = useAppTheme();
  const {unreadCount} = useAppSelector(state => state.notification);
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Notifications' as never)}
      style={{
        position: 'relative',
        marginRight: appTheme.ui.spacing,
        borderRadius: 100,
        backgroundColor: appTheme.colors.surfaceVariant,
        padding: appTheme.ui.spacing,
      }}>
      <Icon
        name="notifications"
        size={appTheme.ui.spacing * 3.5}
        color={appTheme.colors.premium}
      />

      <View
        style={{
          position: 'absolute',
          top: 2,
          right: 2,
          backgroundColor: appTheme.colors.error,
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
            color: appTheme.colors.onSurface,
            fontWeight: '700',
            fontSize: 11,
          }}>
          {unreadCount}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default NotificationIcon;
