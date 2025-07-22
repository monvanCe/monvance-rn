import {useEffect} from 'react';
import {useAppSelector} from '../store/store';
import {internalService} from '../service/internalServices';
import {eventBus} from '../middleware/eventMiddleware';
import {setLoading} from '../store/slices/notificationSlice';
import {useAppDispatch} from '../store/store';

export const useNotificationService = () => {
  const dispatch = useAppDispatch();
  const {notifications, unreadCount, loading} = useAppSelector(
    state => state.notification,
  );

  useEffect(() => {
    eventBus.on('loginSuccess', async () => {
      fetchNotifications();
      fetchUnreadCount();
    });
  }, []);

  const fetchNotifications = async () => {
    dispatch(setLoading(true));
    try {
      await internalService.getNotifications();
    } catch (error) {
      console.error('Error fetching notifications:', error);
      dispatch(setLoading(false));
    }
  };

  const fetchSignals = async () => {
    dispatch(setLoading(true));
    try {
      await internalService.getSignals();
    } catch (error) {
      console.error('Error fetching signals:', error);
      dispatch(setLoading(false));
    }
  };

  const fetchUnreadCount = async () => {
    try {
      await internalService.getUnreadCount();
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const markAsRead = async (slug: string) => {
    try {
      await internalService.markAsRead(slug);
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await internalService.markAllAsRead();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (slug: string) => {
    try {
      await internalService.deleteNotification(slug);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const deleteAllNotifications = async () => {
    try {
      await internalService.deleteAllNotifications();
    } catch (error) {
      console.error('Error deleting all notifications:', error);
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    fetchSignals,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
  };
};
