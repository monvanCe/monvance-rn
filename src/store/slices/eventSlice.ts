import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  slug: '',
  data: {},
} as IEvent;

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    setEvent: (state, action) => {
      state.slug = action.payload.slug;
      state.data = action.payload.data;
    },
  },
});

export const {setEvent} = eventSlice.actions;

export default eventSlice;
