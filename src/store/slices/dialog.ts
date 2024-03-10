import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface DialogState {
  dialogs: {
    id: string;
    title: string;
    content: string;
  }[];
}

const initialState: DialogState = {
  dialogs: [],
};

export const dialogSlice = createSlice({
  name: 'dialog',
  initialState,
  reducers: {
    openDialog: (state, action: PayloadAction<DialogState['dialogs'][0]>) => {
      state.dialogs.push(action.payload);
    },
    closeDialog: (state, action: PayloadAction<string>) => {
      state.dialogs = state.dialogs.filter(
        (dialog) => dialog.id !== action.payload
      );
    },
  },
});

export const { openDialog, closeDialog } = dialogSlice.actions;

export default dialogSlice.reducer;
