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
    updateMessageByLocalId: (
      state,
      action: PayloadAction<{localId: string; data: Partial<IMessage>}>,
    ) => {
      const {localId, data} = action.payload;
      const idx = state.messages.findIndex(msg => msg.localId === localId);
      if (idx !== -1) {
        state.messages[idx] = {...state.messages[idx], ...data};
      }
    },
  },
});

export const {
  setMessages,
  setHasNewMessages,
  addMessage,
  updateMessageByLocalId,
} = chatSlice.actions;
export default chatSlice;
