import React from 'react';
import {View, StyleSheet, TouchableOpacity, Animated} from 'react-native';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Text} from './ui/Text';
import {useTheme as useAppTheme} from '../context/ThemeContext';

interface NotificationItemProps {
  item: INotification;
  onMarkAsRead: (slug: string) => void;
  onDelete: (slug: string) => void;
}

const NotificationItem = ({
  item,
  onMarkAsRead,
  onDelete,
}: NotificationItemProps) => {
  const {theme: appTheme} = useAppTheme();
  const translateX = new Animated.Value(0);
  const scale = new Animated.Value(1);

  const onGestureEvent = Animated.event(
    [{nativeEvent: {translationX: translateX}}],
    {useNativeDriver: true},
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const {translationX} = event.nativeEvent;

      if (translationX > 100) {
        Animated.timing(translateX, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
        onMarkAsRead(item.slug);
      } else if (translationX < -100) {
        Animated.timing(translateX, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
        onDelete(item.slug);
      } else {
        Animated.timing(translateX, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return 'check-circle';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'info';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return appTheme.colors.green;
      case 'warning':
        return appTheme.colors.premium;
      case 'error':
        return appTheme.colors.error;
      default:
        return appTheme.colors.primary;
    }
  };

  return (
    <View style={styles.notificationContainer}>
      <View style={styles.swipeActions}>
        <View
          style={[
            styles.swipeAction,
            styles.markAsReadAction,
            {backgroundColor: appTheme.colors.primary},
          ]}>
          <Icon
            name="check"
            size={appTheme.ui.spacing * 2.5}
            color={appTheme.colors.onSurface}
          />
        </View>
        <View
          style={[
            styles.swipeAction,
            styles.deleteAction,
            {backgroundColor: appTheme.colors.error},
          ]}>
          <Icon
            name="delete"
            size={appTheme.ui.spacing * 2.5}
            color={appTheme.colors.onSurface}
          />
        </View>
      </View>

      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}>
        <Animated.View
          style={[
            styles.notificationItem,
            {
              backgroundColor: appTheme.colors.surface,
              borderColor: appTheme.colors.outline,
              transform: [{translateX}, {scale}],
            },
            !item.isRead && {
              borderLeftWidth: appTheme.ui.borderWidth * 4,
              borderLeftColor: appTheme.colors.primary,
            },
          ]}>
          <View style={styles.notificationHeader}>
            <View style={styles.notificationIcon}>
              <Icon
                name={getNotificationIcon(item.type)}
                size={appTheme.ui.spacing * 3}
                color={getNotificationColor(item.type)}
              />
            </View>
            <View style={styles.notificationContent}>
              <Text
                style={[
                  styles.notificationTitle,
                  {
                    color: appTheme.colors.onSurface,
                    fontWeight: item.isRead ? '400' : '700',
                  },
                ]}>
                {item.title}
              </Text>
              <Text
                style={[
                  styles.notificationMessage,
                  {color: appTheme.colors.onSurfaceVariant},
                ]}>
                {item.message}
              </Text>
              <Text
                style={[
                  styles.notificationTime,
                  {color: appTheme.colors.onSurfaceDisabled},
                ]}>
                {item.timestamp}
              </Text>
            </View>
            {!item.isRead && (
              <View
                style={[
                  styles.unreadIndicator,
                  {backgroundColor: appTheme.colors.primary},
                ]}
              />
            )}
          </View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  notificationContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  swipeActions: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
  },
  swipeAction: {
    width: 80,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  markAsReadAction: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  deleteAction: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  notificationItem: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    zIndex: 2,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  notificationTime: {
    fontSize: 12,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
    marginTop: 4,
  },
});

export default NotificationItem;
