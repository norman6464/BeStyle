/**
 * 認証スライス
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '../../api/authApi';
import type { AuthState, CurrentUser, LoginForm, SignupForm, ConfirmSignupForm } from '../../types/auth';
import type { ApiError } from '../../types/api';

// 初期状態
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
  initialized: false,
};

// 非同期アクション: ログイン
export const loginAsync = createAsyncThunk(
  'auth/login',
  async (form: LoginForm, { rejectWithValue }) => {
    try {
      const response = await authApi.login(form);
      if (response.error) {
        return rejectWithValue(response.error);
      }
      // ログイン成功後、ユーザー情報を取得
      const user = await authApi.getCurrentUser();
      return user;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || 'ログインに失敗しました');
    }
  }
);

// 非同期アクション: サインアップ
export const signupAsync = createAsyncThunk(
  'auth/signup',
  async (form: SignupForm, { rejectWithValue }) => {
    try {
      const response = await authApi.signup(form);
      if (response.error) {
        return rejectWithValue(response.error);
      }
      return response;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || 'サインアップに失敗しました');
    }
  }
);

// 非同期アクション: サインアップ確認
export const confirmSignupAsync = createAsyncThunk(
  'auth/confirmSignup',
  async (form: ConfirmSignupForm, { rejectWithValue }) => {
    try {
      const response = await authApi.confirmSignup(form);
      if (response.error) {
        return rejectWithValue(response.error);
      }
      return response;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || '確認に失敗しました');
    }
  }
);

// 非同期アクション: ログアウト
export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
      return null;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || 'ログアウトに失敗しました');
    }
  }
);

// 非同期アクション: 現在のユーザー情報取得
export const fetchCurrentUserAsync = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authApi.getCurrentUser();
      return user;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || 'ユーザー情報の取得に失敗しました');
    }
  }
);

// 非同期アクション: OAuthコールバック
export const oauthCallbackAsync = createAsyncThunk(
  'auth/oauthCallback',
  async (code: string, { rejectWithValue }) => {
    try {
      const response = await authApi.oauthCallback(code);
      if (response.error) {
        return rejectWithValue(response.error);
      }
      // コールバック成功後、ユーザー情報を取得
      const user = await authApi.getCurrentUser();
      return user;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || '認証に失敗しました');
    }
  }
);

// スライス
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 認証状態をセット
    setAuthData: (state, action: PayloadAction<CurrentUser>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    // 認証状態をクリア
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    },
    // エラーをクリア
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ログイン
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // サインアップ
    builder
      .addCase(signupAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupAsync.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signupAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // サインアップ確認
    builder
      .addCase(confirmSignupAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(confirmSignupAsync.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(confirmSignupAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ログアウト
    builder
      .addCase(logoutAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logoutAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ユーザー情報取得
    builder
      .addCase(fetchCurrentUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.initialized = true;
      })
      .addCase(fetchCurrentUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload as string;
        state.initialized = true;
      });

    // OAuthコールバック
    builder
      .addCase(oauthCallbackAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(oauthCallbackAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(oauthCallbackAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setAuthData, clearAuth, clearError } = authSlice.actions;
export default authSlice.reducer;
