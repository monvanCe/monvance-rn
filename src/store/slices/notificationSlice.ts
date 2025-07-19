import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState: INotificationState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<INotification[]>) => {
      state.notifications = action.payload;
    },
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(
        item => item._id === action.payload,
      );
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: state => {
      state.notifications.forEach(notification => {
        notification.isRead = true;
      });
      state.unreadCount = 0;
    },
    deleteNotification: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(
        item => item._id === action.payload,
      );
      if (notification && !notification.isRead) {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
      state.notifications = state.notifications.filter(
        item => item._id !== action.payload,
      );
    },
    deleteAllNotifications: state => {
      state.notifications = [];
      state.unreadCount = 0;
    },
    addNotification: (state, action: PayloadAction<INotification>) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
    },
  },
});

export const {
  setNotifications,
  setUnreadCount,
  setLoading,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  addNotification,
} = notificationSlice.actions;

export default notificationSlice;
