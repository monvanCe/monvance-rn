import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme as useAppTheme} from '../context/ThemeContext';
import {useAppSelector} from '../store/store';
import {Text} from './ui/Text';
import {useNavigation} from '@react-navigation/native';
import {ROUTE_NAMES} from '../const/routeNames';

const NotificationIcon = () => {
  const {theme: appTheme} = useAppTheme();
  const styles = style(appTheme);
  const {unreadCount} = useAppSelector(state => state.notification);
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate(ROUTE_NAMES.NOTIFICATIONS)}
      style={styles.button}>
      <Icon
        name="notifications"
        size={appTheme.ui.spacing * 3.5}
        color={appTheme.colors.premium}
      />
      <View style={styles.unreadBadge}>
        <Text style={styles.unreadText}>{unreadCount}</Text>
      </View>
    </TouchableOpacity>
  );
};

const style = (appTheme: any) => ({
  button: {
    position: 'relative' as const,
    marginRight: appTheme.ui.spacing,
    borderRadius: 100,
    backgroundColor: appTheme.colors.onSurface,
    padding: appTheme.ui.spacing,
  },
  unreadBadge: {
    position: 'absolute' as const,
    top: appTheme.ui.spacing * 0.25,
    right: appTheme.ui.spacing * 0.25,
    backgroundColor: appTheme.colors.notification,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    zIndex: 2,
    paddingHorizontal: 3,
  },
  unreadText: {
    color: appTheme.colors.onSurface,
    fontWeight: '700' as const,
    fontSize: appTheme.ui.fontSize * 0.7,
  },
});

export default NotificationIcon;
