import {createSlice} from '@reduxjs/toolkit';

const initialState: IUser = {
  _id: '',
  username: '',
  bio: '',
  country: '',
  language: '',
  location: {
    latitude: 0,
    longitude: 0,
  },
  avatar: '',
  isPremium: false,
  isOnline: false,
  notificationId: '',
  isAdmin: false,
  version: 0,
  limits: {
    credits: 0,
  },
  token: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      return action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
});

export const {setUser, setToken} = authSlice.actions;

export default authSlice;
