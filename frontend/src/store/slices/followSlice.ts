/**
 * フォロースライス
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { followApi } from '../../api/followApi';
import type { Follow, FollowState } from '../../types/follow';
import type { ApiError } from '../../types/api';

// 初期状態
const initialState: FollowState = {
  followers: [],
  following: [],
  followRequests: [],
  loading: false,
  error: null,
};

// 非同期アクション: フォロワー取得
export const fetchFollowersAsync = createAsyncThunk(
  'follow/fetchFollowers',
  async (userId: number, { rejectWithValue }) => {
    try {
      const followers = await followApi.getFollowers(userId);
      return followers;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || 'フォロワーの取得に失敗しました');
    }
  }
);

// 非同期アクション: フォロー中取得
export const fetchFollowingAsync = createAsyncThunk(
  'follow/fetchFollowing',
  async (userId: number, { rejectWithValue }) => {
    try {
      const following = await followApi.getFollowing(userId);
      return following;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || 'フォロー中の取得に失敗しました');
    }
  }
);

// 非同期アクション: フォロー
export const followUserAsync = createAsyncThunk(
  'follow/follow',
  async (followingId: number, { rejectWithValue }) => {
    try {
      const follow = await followApi.followUser(followingId);
      return follow;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || 'フォローに失敗しました');
    }
  }
);

// 非同期アクション: フォロー解除
export const unfollowUserAsync = createAsyncThunk(
  'follow/unfollow',
  async (followingId: number, { rejectWithValue }) => {
    try {
      await followApi.unfollowUser(followingId);
      return followingId;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || 'フォロー解除に失敗しました');
    }
  }
);

// スライス
const followSlice = createSlice({
  name: 'follow',
  initialState,
  reducers: {
    clearFollowData: (state) => {
      state.followers = [];
      state.following = [];
      state.followRequests = [];
      state.error = null;
    },
    clearFollowError: (state) => {
      state.error = null;
    },
    // 楽観的更新: フォロー
    optimisticFollow: (state, action: PayloadAction<Follow>) => {
      state.following.push(action.payload);
    },
    // 楽観的更新: フォロー解除
    optimisticUnfollow: (state, action: PayloadAction<number>) => {
      state.following = state.following.filter(f => f.followingId !== action.payload);
    },
  },
  extraReducers: (builder) => {
    // フォロワー取得
    builder
      .addCase(fetchFollowersAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFollowersAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.followers = action.payload;
      })
      .addCase(fetchFollowersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // フォロー中取得
    builder
      .addCase(fetchFollowingAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFollowingAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.following = action.payload;
      })
      .addCase(fetchFollowingAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // フォロー
    builder
      .addCase(followUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(followUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.following.push(action.payload);
      })
      .addCase(followUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // フォロー解除
    builder
      .addCase(unfollowUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unfollowUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.following = state.following.filter(f => f.followingId !== action.payload);
      })
      .addCase(unfollowUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  clearFollowData, 
  clearFollowError, 
  optimisticFollow, 
  optimisticUnfollow 
} = followSlice.actions;
export default followSlice.reducer;
