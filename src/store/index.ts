import { configureStore } from '@reduxjs/toolkit';
import dialog from './slices/dialog';

export const store = configureStore({
  reducer: {
    dialog,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
