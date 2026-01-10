/**
 * ユーザー関連の型定義
 */

export interface User {
  id: number;
  cognitoSub: string;
  username: string;
  email: string;
  displayName: string;
  bio?: string;
  profileImageUrl?: string;
  headerImageUrl?: string;
  coverImageUrl?: string;
  location?: string;
  website?: string;
  websiteUrl?: string;
  birthDate?: string;
  isPrivate?: boolean;
  isVerified?: boolean;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  followersCount?: number;
  followingCount?: number;
  postsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfile extends User {
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowing?: boolean;
  isFollowedBy?: boolean;
}

export interface CreateUserRequest {
  username?: string;
  displayName?: string;
  bio?: string;
}

export interface UpdateUserRequest {
  username?: string;
  displayName?: string;
  bio?: string;
  profileImageUrl?: string;
  headerImageUrl?: string;
  location?: string;
  websiteUrl?: string;
  birthDate?: string;
  isPrivate?: boolean;
}

export interface UserState {
  currentUser: User | null;
  viewingUser: User | null;
  loading: boolean;
  error: string | null;
}
