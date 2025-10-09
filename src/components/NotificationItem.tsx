import React from 'react';
import {View, Animated} from 'react-native';
import {
  GestureHandlerRootView,
  PanGestureHandler,
  State,
} from 'react-native-gesture-handler';
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
  const styles = style(appTheme);
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
        onMarkAsRead(item._id);
      } else if (translationX < -100) {
        Animated.timing(translateX, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
        onDelete(item._id);
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
      case 'signal':
        return 'info';
      default:
        return '';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'signal':
        return appTheme.colors.descent;
      default:
        return '';
    }
  };

  return (
    <GestureHandlerRootView style={styles.notificationContainer}>
      <View style={styles.swipeActions}>
        <View
          style={[
            styles.swipeAction,
            styles.markAsReadAction,
            {backgroundColor: appTheme.colors.success},
          ]}>
          <Icon
            name="check"
            size={appTheme.ui.spacing * 2.5}
            color={appTheme.colors.onSurfaceContent}
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
            color={appTheme.colors.onSurfaceContent}
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
              borderColor: appTheme.colors.border,
              transform: [{translateX}, {scale}],
            },
            !item.isRead && {
              borderLeftWidth: appTheme.ui.borderWidth * 4,
              borderLeftColor: appTheme.colors.brand,
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
                    color: appTheme.colors.onSurfaceContent,
                    fontWeight: item.isRead
                      ? ('400' as const)
                      : ('700' as const),
                  },
                ]}>
                {item.title}
              </Text>
              <Text
                style={[
                  styles.notificationMessage,
                  {color: appTheme.colors.textSecondary},
                ]}>
                {item.body}
              </Text>
              <Text
                style={[
                  styles.notificationTime,
                  {color: appTheme.colors.textDisabled},
                ]}>
                {item.timestamp}
              </Text>
            </View>
            {!item.isRead && (
              <View
                style={[
                  styles.unreadIndicator,
                  {backgroundColor: appTheme.colors.brand},
                ]}
              />
            )}
          </View>
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

const style = (appTheme: any) => ({
  notificationContainer: {
    position: 'relative' as const,
    marginBottom: appTheme.ui.spacing * 1.5,
  },
  swipeActions: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    zIndex: 1,
  },
  swipeAction: {
    height: '100%' as const,
    width: 80,
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderRadius: appTheme.ui.radius,
  },
  markAsReadAction: {
    borderTopLeftRadius: appTheme.ui.radius,
    borderBottomLeftRadius: appTheme.ui.radius,
  },
  deleteAction: {
    borderTopRightRadius: appTheme.ui.radius,
    borderBottomRightRadius: appTheme.ui.radius,
  },
  notificationItem: {
    padding: appTheme.ui.spacing * 2,
    borderRadius: appTheme.ui.radius,
    borderWidth: appTheme.ui.borderWidth,
    zIndex: 2,
  },
  notificationHeader: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
  },
  notificationIcon: {
    marginRight: appTheme.ui.spacing * 1.5,
    marginTop: 2,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: appTheme.ui.fontSize * 1,
    marginBottom: appTheme.ui.spacing * 0.5,
  },
  notificationMessage: {
    fontSize: appTheme.ui.fontSize * 0.875,
    marginBottom: appTheme.ui.spacing,
    lineHeight: appTheme.ui.fontSize * 1.25,
  },
  notificationTime: {
    fontSize: appTheme.ui.fontSize * 0.75,
  },
  unreadIndicator: {
    width: appTheme.ui.spacing,
    height: appTheme.ui.spacing,
    borderRadius: appTheme.ui.spacing / 2,
    marginLeft: appTheme.ui.spacing * 0.5,
    marginTop: appTheme.ui.spacing * 0.25,
  },
});

export default NotificationItem;
