import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {Text} from '../components/ui/Text';
import {useTheme as useAppTheme} from '../context/ThemeContext';
import {t} from '../localization';
import {useNotificationService} from '../hooks/useNotificationService';
import NotificationItem from '../components/NotificationItem';

const NotificationScreen = () => {
  const {theme: appTheme} = useAppTheme();
  const navigation = useNavigation();
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
  } = useNotificationService();

  return (
    <View
      style={[styles.container, {backgroundColor: appTheme.colors.background}]}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: appTheme.colors.surface,
            borderBottomColor: appTheme.colors.outline,
          },
        ]}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <Icon
              name="arrow-back"
              size={appTheme.ui.spacing * 3}
              color={appTheme.colors.onSurface}
            />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text
              style={[styles.headerTitle, {color: appTheme.colors.onSurface}]}>
              {t('notifications')}
            </Text>
            {unreadCount > 0 && (
              <View
                style={[
                  styles.unreadBadge,
                  {backgroundColor: appTheme.colors.primary},
                ]}>
                <Text
                  style={[
                    styles.unreadText,
                    {color: appTheme.colors.onSurface},
                  ]}>
                  {unreadCount}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.headerActions}>
          {unreadCount > 0 && (
            <TouchableOpacity
              style={[
                styles.actionButton,
                {backgroundColor: appTheme.colors.surfaceVariant},
              ]}
              onPress={markAllAsRead}>
              <Icon
                name="done-all"
                size={appTheme.ui.spacing * 2.5}
                color={appTheme.colors.primary}
              />
            </TouchableOpacity>
          )}
          {notifications.length > 0 && (
            <TouchableOpacity
              style={[
                styles.actionButton,
                {backgroundColor: appTheme.colors.surfaceVariant},
              ]}
              onPress={deleteAllNotifications}>
              <Icon
                name="delete-sweep"
                size={appTheme.ui.spacing * 2.5}
                color={appTheme.colors.error}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.notificationsList}>
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon
              name="notifications-off"
              size={appTheme.ui.spacing * 8}
              color={appTheme.colors.onSurfaceDisabled}
            />
            <Text
              style={[
                styles.emptyText,
                {color: appTheme.colors.onSurfaceDisabled},
              ]}>
              {t('no_notifications')}
            </Text>
          </View>
        ) : (
          notifications.map(item => (
            <NotificationItem
              key={item._id}
              item={item}
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
            />
          ))
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    fontSize: 12,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
  },
  notificationsList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
});

export default NotificationScreen;
