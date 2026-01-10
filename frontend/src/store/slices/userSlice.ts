/**
 * ユーザースライス
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { userApi } from '../../api/userApi';
import type { User, UpdateUserRequest, UserState } from '../../types/user';
import type { ApiError } from '../../types/api';

// 初期状態
const initialState: UserState = {
  currentUser: null,
  viewingUser: null,
  loading: false,
  error: null,
};

// 非同期アクション: ユーザー取得（ID）
export const fetchUserByIdAsync = createAsyncThunk(
  'user/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const user = await userApi.getUserById(id);
      return user;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || 'ユーザーの取得に失敗しました');
    }
  }
);

// 非同期アクション: ユーザー取得（ユーザー名）
export const fetchUserByUsernameAsync = createAsyncThunk(
  'user/fetchByUsername',
  async (username: string, { rejectWithValue }) => {
    try {
      const user = await userApi.getUserByUsername(username);
      return user;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || 'ユーザーの取得に失敗しました');
    }
  }
);

// 非同期アクション: ユーザー更新
export const updateUserAsync = createAsyncThunk(
  'user/update',
  async ({ id, request }: { id: number; request: UpdateUserRequest }, { rejectWithValue }) => {
    try {
      const user = await userApi.updateUser(id, request);
      return user;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || 'ユーザーの更新に失敗しました');
    }
  }
);

// スライス
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
    setViewingUser: (state, action: PayloadAction<User | null>) => {
      state.viewingUser = action.payload;
    },
    clearUserError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ユーザー取得（ID）
    builder
      .addCase(fetchUserByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.viewingUser = action.payload;
      })
      .addCase(fetchUserByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ユーザー取得（ユーザー名）
    builder
      .addCase(fetchUserByUsernameAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserByUsernameAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.viewingUser = action.payload;
      })
      .addCase(fetchUserByUsernameAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ユーザー更新
    builder
      .addCase(updateUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(updateUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentUser, setViewingUser, clearUserError } = userSlice.actions;
export default userSlice.reducer;
