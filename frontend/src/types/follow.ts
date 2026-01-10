/**
 * フォロー関連の型定義
 */

export interface Follow {
  id: number;
  followerId: number;
  followingId: number;
  status: FollowStatus;
  createdAt: string;
  // 拡張情報（フォロワー一覧用）
  followerUsername?: string;
  followerDisplayName?: string;
  followerProfileImageUrl?: string;
  // 拡張情報（フォロー中一覧用）
  followingUsername?: string;
  followingDisplayName?: string;
  followingProfileImageUrl?: string;
  // フォロー状態
  isFollowingBack?: boolean;
  // オブジェクト形式の拡張情報
  follower?: {
    id: number;
    username: string;
    displayName: string;
    profileImageUrl?: string;
  };
  following?: {
    id: number;
    username: string;
    displayName: string;
    profileImageUrl?: string;
  };
}

export type FollowStatus = 'ACTIVE' | 'PENDING' | 'BLOCKED';

export interface FollowRequest {
  id: number;
  requesterId: number;
  targetId: number;
  status: FollowRequestStatus;
  createdAt: string;
  requester?: {
    id: number;
    username: string;
    displayName: string;
    profileImageUrl?: string;
  };
}

export type FollowRequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface FollowState {
  followers: Follow[];
  following: Follow[];
  followRequests: FollowRequest[];
  loading: boolean;
  error: string | null;
}

export interface CreateFollowRequest {
  followingId: number;
}
