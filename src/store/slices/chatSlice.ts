import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState: IChatState = {
  messages: [],
  hasNewMessages: true,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<IMessage[]>) => {
      state.messages = action.payload;
    },
    setHasNewMessages: (state, action: PayloadAction<boolean>) => {
      state.hasNewMessages = action.payload;
    },
    addMessage: (state, action: PayloadAction<IMessage>) => {
      state.messages.push(action.payload);
    },
  },
});

export const {setMessages, setHasNewMessages, addMessage} = chatSlice.actions;
export default chatSlice;
