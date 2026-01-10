/**
 * ユーザーAPI
 * BFFの /api/users/* エンドポイントとの通信
 */

import { apiClient } from './client';
import type { User, CreateUserRequest, UpdateUserRequest } from '../types/user';

const USER_BASE = '/api/users';

/**
 * ユーザーをIDで取得
 */
export const getUserById = async (id: number): Promise<User> => {
  return apiClient.get<User>(`${USER_BASE}/${id}`);
};

/**
 * ユーザーをユーザー名で取得
 */
export const getUserByUsername = async (username: string): Promise<User> => {
  return apiClient.get<User>(`${USER_BASE}/username/${username}`);
};

/**
 * 現在のユーザー情報を取得
 */
export const getCurrentUser = async (): Promise<User> => {
  return apiClient.get<User>(`${USER_BASE}/me`);
};

/**
 * ユーザーを作成
 */
export const createUser = async (request: CreateUserRequest): Promise<User> => {
  return apiClient.post<User>(USER_BASE, request);
};

/**
 * ユーザーを更新
 */
export const updateUser = async (id: number, request: UpdateUserRequest): Promise<User> => {
  return apiClient.put<User>(`${USER_BASE}/${id}`, request);
};

/**
 * ユーザーを削除
 */
export const deleteUser = async (id: number): Promise<void> => {
  return apiClient.delete(`${USER_BASE}/${id}`);
};

// 名前付きエクスポート
export const userApi = {
  getUserById,
  getUserByUsername,
  getCurrentUser,
  createUser,
  updateUser,
  deleteUser,
};

export default userApi;
