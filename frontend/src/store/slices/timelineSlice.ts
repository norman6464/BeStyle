/**
 * タイムラインスライス
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { postApi } from '../../api/postApi';
import type { Post, TimelineState } from '../../types/post';
import type { ApiError } from '../../types/api';
import { PAGINATION_CONFIG } from '../../constants/config';

// 初期状態
const initialState: TimelineState = {
  posts: [],
  loading: false,
  error: null,
  hasMore: true,
  page: 0,
};

// 非同期アクション: タイムライン取得
export const fetchTimelineAsync = createAsyncThunk(
  'timeline/fetch',
  async ({ page, refresh = false }: { page: number; refresh?: boolean }, { rejectWithValue }) => {
    try {
      const posts = await postApi.getTimeline(page, PAGINATION_CONFIG.DEFAULT_PAGE_SIZE);
      return { posts, page, refresh };
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || 'タイムラインの取得に失敗しました');
    }
  }
);

// スライス
const timelineSlice = createSlice({
  name: 'timeline',
  initialState,
  reducers: {
    // タイムラインをクリア
    clearTimeline: (state) => {
      state.posts = [];
      state.page = 0;
      state.hasMore = true;
      state.error = null;
    },
    // 新しい投稿を追加
    addPost: (state, action: PayloadAction<Post>) => {
      state.posts.unshift(action.payload);
    },
    // 投稿を削除
    removePost: (state, action: PayloadAction<number>) => {
      state.posts = state.posts.filter(post => post.id !== action.payload);
    },
    // いいね状態を更新
    updateLikeStatus: (state, action: PayloadAction<{ postId: number; isLiked: boolean }>) => {
      const post = state.posts.find(p => p.id === action.payload.postId);
      if (post) {
        post.isLiked = action.payload.isLiked;
        post.likesCount += action.payload.isLiked ? 1 : -1;
      }
    },
    // ブックマーク状態を更新
    updateBookmarkStatus: (state, action: PayloadAction<{ postId: number; isBookmarked: boolean }>) => {
      const post = state.posts.find(p => p.id === action.payload.postId);
      if (post) {
        post.isBookmarked = action.payload.isBookmarked;
        post.bookmarksCount += action.payload.isBookmarked ? 1 : -1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTimelineAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTimelineAsync.fulfilled, (state, action) => {
        state.loading = false;
        const { posts, page, refresh } = action.payload;
        
        if (refresh || page === 0) {
          state.posts = posts;
        } else {
          state.posts = [...state.posts, ...posts];
        }
        
        state.page = page;
        state.hasMore = posts.length >= PAGINATION_CONFIG.DEFAULT_PAGE_SIZE;
      })
      .addCase(fetchTimelineAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  clearTimeline, 
  addPost, 
  removePost, 
  updateLikeStatus, 
  updateBookmarkStatus 
} = timelineSlice.actions;
export default timelineSlice.reducer;
