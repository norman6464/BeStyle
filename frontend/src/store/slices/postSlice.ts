/**
 * 投稿スライス
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { postApi } from '../../api/postApi';
import type { Post, PostState, CreatePostRequest } from '../../types/post';
import type { ApiError } from '../../types/api';

// 初期状態
const initialState: PostState = {
  posts: [],
  currentPost: null,
  userPosts: [],
  loading: false,
  error: null,
  hasMore: true,
  page: 0,
};

// 非同期アクション: 投稿取得（ID）
export const fetchPostByIdAsync = createAsyncThunk(
  'post/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const post = await postApi.getPostById(id);
      return post;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || '投稿の取得に失敗しました');
    }
  }
);

// 非同期アクション: ユーザーの投稿取得
export const fetchUserPostsAsync = createAsyncThunk(
  'post/fetchByUser',
  async (userId: number, { rejectWithValue }) => {
    try {
      const posts = await postApi.getPostsByUserId(userId);
      return posts;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || '投稿の取得に失敗しました');
    }
  }
);

// 非同期アクション: 投稿作成
export const createPostAsync = createAsyncThunk(
  'post/create',
  async (request: CreatePostRequest, { rejectWithValue }) => {
    try {
      const post = await postApi.createPost(request);
      return post;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || '投稿の作成に失敗しました');
    }
  }
);

// 非同期アクション: 投稿削除
export const deletePostAsync = createAsyncThunk(
  'post/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await postApi.deletePost(id);
      return id;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || '投稿の削除に失敗しました');
    }
  }
);

// 非同期アクション: いいね
export const likePostAsync = createAsyncThunk(
  'post/like',
  async (postId: number, { rejectWithValue }) => {
    try {
      await postApi.likePost(postId);
      return postId;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || 'いいねに失敗しました');
    }
  }
);

// 非同期アクション: いいね解除
export const unlikePostAsync = createAsyncThunk(
  'post/unlike',
  async (postId: number, { rejectWithValue }) => {
    try {
      await postApi.unlikePost(postId);
      return postId;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || 'いいね解除に失敗しました');
    }
  }
);

// 非同期アクション: ブックマーク
export const bookmarkPostAsync = createAsyncThunk(
  'post/bookmark',
  async (postId: number, { rejectWithValue }) => {
    try {
      await postApi.bookmarkPost(postId);
      return postId;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || 'ブックマークに失敗しました');
    }
  }
);

// 非同期アクション: ブックマーク解除
export const unbookmarkPostAsync = createAsyncThunk(
  'post/unbookmark',
  async (postId: number, { rejectWithValue }) => {
    try {
      await postApi.unbookmarkPost(postId);
      return postId;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || 'ブックマーク解除に失敗しました');
    }
  }
);

// スライス
const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setCurrentPost: (state, action: PayloadAction<Post | null>) => {
      state.currentPost = action.payload;
    },
    clearPosts: (state) => {
      state.posts = [];
      state.page = 0;
      state.hasMore = true;
    },
    clearPostError: (state) => {
      state.error = null;
    },
    // 楽観的更新: いいね
    optimisticLike: (state, action: PayloadAction<number>) => {
      const updatePost = (post: Post) => {
        if (post.id === action.payload) {
          post.isLiked = true;
          post.likesCount += 1;
        }
      };
      state.posts.forEach(updatePost);
      state.userPosts.forEach(updatePost);
      if (state.currentPost?.id === action.payload) {
        state.currentPost.isLiked = true;
        state.currentPost.likesCount += 1;
      }
    },
    // 楽観的更新: いいね解除
    optimisticUnlike: (state, action: PayloadAction<number>) => {
      const updatePost = (post: Post) => {
        if (post.id === action.payload) {
          post.isLiked = false;
          post.likesCount = Math.max(0, post.likesCount - 1);
        }
      };
      state.posts.forEach(updatePost);
      state.userPosts.forEach(updatePost);
      if (state.currentPost?.id === action.payload) {
        state.currentPost.isLiked = false;
        state.currentPost.likesCount = Math.max(0, state.currentPost.likesCount - 1);
      }
    },
  },
  extraReducers: (builder) => {
    // 投稿取得（ID）
    builder
      .addCase(fetchPostByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPost = action.payload;
      })
      .addCase(fetchPostByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ユーザーの投稿取得
    builder
      .addCase(fetchUserPostsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPostsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.userPosts = action.payload;
      })
      .addCase(fetchUserPostsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 投稿作成
    builder
      .addCase(createPostAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPostAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload);
        state.userPosts.unshift(action.payload);
      })
      .addCase(createPostAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 投稿削除
    builder
      .addCase(deletePostAsync.fulfilled, (state, action) => {
        state.posts = state.posts.filter(post => post.id !== action.payload);
        state.userPosts = state.userPosts.filter(post => post.id !== action.payload);
        if (state.currentPost?.id === action.payload) {
          state.currentPost = null;
        }
      });
  },
});

export const { 
  setCurrentPost, 
  clearPosts, 
  clearPostError, 
  optimisticLike, 
  optimisticUnlike 
} = postSlice.actions;
export default postSlice.reducer;
