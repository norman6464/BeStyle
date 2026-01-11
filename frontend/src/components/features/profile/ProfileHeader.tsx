/**
 * プロフィールヘッダーコンポーネント
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Button } from '../../common';
import { ROUTES } from '../../../constants/routes';
import { formatDate } from '../../../utils/formatDate';
import type { User } from '../../../types/user';

interface ProfileHeaderProps {
  user: User;
  isOwnProfile: boolean;
  isFollowing: boolean;
  onFollow: () => void;
  onUnfollow: () => void;
  followLoading?: boolean;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  isOwnProfile,
  isFollowing,
  onFollow,
  onUnfollow,
  followLoading = false,
}) => {
  return (
    <div className="bg-white border-b border-gray-200">
      {/* カバー画像 */}
      <div className="h-32 sm:h-48 bg-gradient-to-r from-blue-400 to-blue-600">
        {user.coverImageUrl && (
          <img
            src={user.coverImageUrl}
            alt="カバー画像"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* プロフィール情報 */}
      <div className="px-4 pb-4">
        {/* アバター & アクション */}
        <div className="flex justify-between items-end -mt-16 mb-4">
          <Avatar
            src={user.profileImageUrl}
            name={user.displayName || user.username}
            size="xl"
            className="border-4 border-white"
          />

          <div className="mt-16">
            {isOwnProfile ? (
              <Link to={ROUTES.SETTINGS.PROFILE}>
                <Button variant="outline" size="sm">
                  プロフィールを編集
                </Button>
              </Link>
            ) : (
              <Button
                variant={isFollowing ? 'outline' : 'primary'}
                size="sm"
                onClick={isFollowing ? onUnfollow : onFollow}
                loading={followLoading}
              >
                {isFollowing ? 'フォロー中' : 'フォローする'}
              </Button>
            )}
          </div>
        </div>

        {/* 名前 */}
        <div className="mb-3">
          <h1 className="text-xl font-bold text-gray-900">
            {user.displayName || user.username}
          </h1>
          <p className="text-gray-500">@{user.username}</p>
        </div>

        {/* 自己紹介 */}
        {user.bio && (
          <p className="text-gray-700 mb-3 whitespace-pre-wrap">{user.bio}</p>
        )}

        {/* 追加情報 */}
        <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm mb-3">
          {user.location && (
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>{user.location}</span>
            </div>
          )}

          {user.website && (
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
              <a
                href={user.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {user.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}

          {user.createdAt && (
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>{formatDate(user.createdAt)} に登録</span>
            </div>
          )}
        </div>

        {/* フォロー情報 */}
        <div className="flex space-x-4">
          <Link
            to={ROUTES.PROFILE.FOLLOWING(user.username)}
            className="hover:underline"
          >
            <span className="font-bold text-gray-900">{user.followingCount || 0}</span>
            <span className="text-gray-500 ml-1">フォロー中</span>
          </Link>
          <Link
            to={ROUTES.PROFILE.FOLLOWERS(user.username)}
            className="hover:underline"
          >
            <span className="font-bold text-gray-900">{user.followersCount || 0}</span>
            <span className="text-gray-500 ml-1">フォロワー</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
