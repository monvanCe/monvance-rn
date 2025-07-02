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
  },
});

export const {setUser} = authSlice.actions;

export default authSlice;
