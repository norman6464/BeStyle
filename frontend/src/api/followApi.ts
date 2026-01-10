/**
 * フォローAPI
 * BFFの /api/follows/* エンドポイントとの通信
 */

import { apiClient } from './client';
import type { Follow } from '../types/follow';

const FOLLOW_BASE = '/api/follows';

/**
 * フォローする
 */
export const followUser = async (followingId: number): Promise<Follow> => {
  return apiClient.post<Follow>(FOLLOW_BASE, { followingId });
};

/**
 * フォロー解除
 */
export const unfollowUser = async (followingId: number): Promise<void> => {
  return apiClient.delete(`${FOLLOW_BASE}/${followingId}`);
};

/**
 * フォロワー一覧を取得
 */
export const getFollowers = async (userId: number): Promise<Follow[]> => {
  return apiClient.get<Follow[]>(`${FOLLOW_BASE}/followers/${userId}`);
};

/**
 * フォロー中一覧を取得
 */
export const getFollowing = async (userId: number): Promise<Follow[]> => {
  return apiClient.get<Follow[]>(`${FOLLOW_BASE}/following/${userId}`);
};

/**
 * フォロー関係を確認
 */
export const checkFollowStatus = async (followerId: number, followingId: number): Promise<Follow> => {
  return apiClient.get<Follow>(`${FOLLOW_BASE}/${followerId}/${followingId}`);
};

// 名前付きエクスポート
export const followApi = {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  checkFollowStatus,
};

export default followApi;
