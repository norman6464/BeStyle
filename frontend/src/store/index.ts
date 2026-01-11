/**
 * Redux Store 設定
 */

import { configureStore } from '@reduxjs/toolkit';
import {
  authReducer,
  userReducer,
  postReducer,
  timelineReducer,
  followReducer,
} from './slices';

// ストア作成
export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    post: postReducer,
    timeline: timelineReducer,
    follow: followReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Date オブジェクトなどの非シリアライズ可能な値を許可
        ignoredActions: ['auth/setAuthData', 'user/setCurrentUser'],
        ignoredPaths: ['auth.user', 'user.currentUser'],
      },
    }),
  devTools: import.meta.env.DEV,
});

// 型定義
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
