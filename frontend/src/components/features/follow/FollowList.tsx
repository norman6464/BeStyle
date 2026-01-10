/**
 * フォローリストコンポーネント
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Button, UserCardSkeleton, EmptyState } from '../../common';
import { ROUTES } from '../../../constants/routes';
import type { Follow } from '../../../types/follow';

interface FollowListProps {
  follows: Follow[];
  loading: boolean;
  type: 'followers' | 'following';
  currentUserId?: number;
  onFollow?: (userId: number) => void;
  onUnfollow?: (userId: number) => void;
}

export const FollowList: React.FC<FollowListProps> = ({
  follows,
  loading,
  type,
  currentUserId,
  onFollow,
  onUnfollow,
}) => {
  if (loading) {
    return (
      <div className="divide-y divide-gray-200">
        {[...Array(5)].map((_, i) => (
          <UserCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (follows.length === 0) {
    return (
      <EmptyState
        icon={
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        }
        title={type === 'followers' ? 'フォロワーがいません' : 'フォロー中のユーザーがいません'}
        description={
          type === 'followers'
            ? '投稿を続けてフォロワーを増やしましょう！'
            : '気になるユーザーをフォローしてみましょう！'
        }
      />
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {follows.map((follow) => {
        const targetUser = type === 'followers' 
          ? { id: follow.followerId, username: follow.followerUsername, displayName: follow.followerDisplayName, profileImageUrl: follow.followerProfileImageUrl }
          : { id: follow.followingId, username: follow.followingUsername, displayName: follow.followingDisplayName, profileImageUrl: follow.followingProfileImageUrl };

        const isOwnProfile = currentUserId === targetUser.id;

        return (
          <div key={follow.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
            <Link
              to={ROUTES.PROFILE.VIEW(targetUser.username || '')}
              className="flex items-center space-x-3 flex-1 min-w-0"
            >
              <Avatar
                src={targetUser.profileImageUrl}
                name={targetUser.displayName || targetUser.username}
                size="md"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">
                  {targetUser.displayName || targetUser.username}
                </p>
                <p className="text-gray-500 truncate">@{targetUser.username}</p>
              </div>
            </Link>

            {!isOwnProfile && (
              <Button
                variant={follow.isFollowingBack ? 'outline' : 'primary'}
                size="sm"
                onClick={() =>
                  follow.isFollowingBack
                    ? onUnfollow?.(targetUser.id)
                    : onFollow?.(targetUser.id)
                }
              >
                {follow.isFollowingBack ? 'フォロー中' : 'フォローする'}
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FollowList;
