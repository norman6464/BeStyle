/**
 * 投稿API
 * BFFの /api/posts/* エンドポイントとの通信
 */

import { apiClient } from './client';
import type { Post, CreatePostRequest, UpdatePostRequest } from '../types/post';

const POST_BASE = '/api/posts';

/**
 * 投稿をIDで取得
 */
export const getPostById = async (id: number): Promise<Post> => {
  return apiClient.get<Post>(`${POST_BASE}/${id}`);
};

/**
 * ユーザーの投稿一覧を取得
 */
export const getPostsByUserId = async (userId: number): Promise<Post[]> => {
  return apiClient.get<Post[]>(`${POST_BASE}/user/${userId}`);
};

/**
 * タイムライン取得
 */
export const getTimeline = async (page = 0, size = 20): Promise<Post[]> => {
  return apiClient.get<Post[]>(`${POST_BASE}/timeline`, { page, size });
};

/**
 * 投稿を作成
 */
export const createPost = async (request: CreatePostRequest): Promise<Post> => {
  return apiClient.post<Post>(POST_BASE, request);
};

/**
 * 投稿を更新
 */
export const updatePost = async (id: number, request: UpdatePostRequest): Promise<Post> => {
  return apiClient.put<Post>(`${POST_BASE}/${id}`, request);
};

/**
 * 投稿を削除
 */
export const deletePost = async (id: number): Promise<void> => {
  return apiClient.delete(`${POST_BASE}/${id}`);
};

/**
 * いいねを追加
 */
export const likePost = async (postId: number): Promise<void> => {
  return apiClient.post(`${POST_BASE}/${postId}/likes`);
};

/**
 * いいねを削除
 */
export const unlikePost = async (postId: number): Promise<void> => {
  return apiClient.delete(`${POST_BASE}/${postId}/likes`);
};

/**
 * ブックマークを追加
 */
export const bookmarkPost = async (postId: number): Promise<void> => {
  return apiClient.post(`${POST_BASE}/${postId}/bookmarks`);
};

/**
 * ブックマークを削除
 */
export const unbookmarkPost = async (postId: number): Promise<void> => {
  return apiClient.delete(`${POST_BASE}/${postId}/bookmarks`);
};

/**
 * リポスト
 */
export const repost = async (postId: number): Promise<Post> => {
  return apiClient.post<Post>(POST_BASE, { repostOfId: postId });
};

/**
 * 引用リポスト
 */
export const quotePost = async (postId: number, content: string): Promise<Post> => {
  return apiClient.post<Post>(POST_BASE, { quoteOfId: postId, content });
};

/**
 * リプライ
 */
export const replyToPost = async (postId: number, content: string): Promise<Post> => {
  return apiClient.post<Post>(POST_BASE, { replyToId: postId, content });
};

// 名前付きエクスポート
export const postApi = {
  getPostById,
  getPostsByUserId,
  getTimeline,
  createPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  bookmarkPost,
  unbookmarkPost,
  repost,
  quotePost,
  replyToPost,
};

export default postApi;
