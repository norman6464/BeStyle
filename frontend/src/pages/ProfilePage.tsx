/**
 * プロフィールページ
 */

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchUserByUsernameAsync } from '../store/slices/userSlice';
import { followUserAsync, unfollowUserAsync, fetchFollowingAsync } from '../store/slices/followSlice';
import { ProfileHeader, ProfilePosts } from '../components/features/profile';
import { Loading, ErrorDisplay } from '../components/common';

export const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const dispatch = useAppDispatch();
  const { viewingUser, loading, error } = useAppSelector((state) => state.user);
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const { following, loading: followLoading } = useAppSelector((state) => state.follow);

  const [isFollowing, setIsFollowing] = useState(false);

  // ユーザー情報取得
  useEffect(() => {
    if (username) {
      dispatch(fetchUserByUsernameAsync(username));
    }
  }, [dispatch, username]);

  // フォロー状態取得
  useEffect(() => {
    if (currentUser) {
      dispatch(fetchFollowingAsync(currentUser.id));
    }
  }, [dispatch, currentUser]);

  // フォロー状態チェック
  useEffect(() => {
    if (viewingUser && following.length > 0) {
      const isFollowingUser = following.some(
        (f) => f.followingId === viewingUser.id
      );
      setIsFollowing(isFollowingUser);
    } else {
      setIsFollowing(false);
    }
  }, [viewingUser, following]);

  const isOwnProfile = currentUser?.username === username;

  const handleFollow = async () => {
    if (viewingUser) {
      await dispatch(followUserAsync(viewingUser.id));
      setIsFollowing(true);
    }
  };

  const handleUnfollow = async () => {
    if (viewingUser) {
      await dispatch(unfollowUserAsync(viewingUser.id));
      setIsFollowing(false);
    }
  };

  if (loading) {
    return <Loading fullScreen message="プロフィールを読み込み中..." />;
  }

  if (error) {
    return (
      <div className="p-4">
        <ErrorDisplay error={error} />
      </div>
    );
  }

  if (!viewingUser) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">ユーザーが見つかりませんでした</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* ヘッダー */}
      <div className="sticky top-14 z-10 bg-white border-b border-gray-200">
        <div className="flex items-center px-4 py-2">
          <button
            onClick={() => window.history.back()}
            className="p-2 -ml-2 mr-4 hover:bg-gray-100 rounded-full"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div>
            <h1 className="font-bold text-lg">
              {viewingUser.displayName || viewingUser.username}
            </h1>
            <p className="text-sm text-gray-500">
              {viewingUser.postsCount || 0} 件の投稿
            </p>
          </div>
        </div>
      </div>

      {/* プロフィールヘッダー */}
      <ProfileHeader
        user={viewingUser}
        isOwnProfile={isOwnProfile}
        isFollowing={isFollowing}
        onFollow={handleFollow}
        onUnfollow={handleUnfollow}
        followLoading={followLoading}
      />

      {/* タブ */}
      <div className="border-b border-gray-200">
        <nav className="flex">
          <button className="flex-1 py-4 text-center font-medium border-b-2 border-blue-500 text-blue-600">
            投稿
          </button>
          <button className="flex-1 py-4 text-center font-medium text-gray-500 hover:bg-gray-50">
            返信
          </button>
          <button className="flex-1 py-4 text-center font-medium text-gray-500 hover:bg-gray-50">
            メディア
          </button>
          <button className="flex-1 py-4 text-center font-medium text-gray-500 hover:bg-gray-50">
            いいね
          </button>
        </nav>
      </div>

      {/* 投稿一覧 */}
      <ProfilePosts
        userId={viewingUser.id}
        username={viewingUser.username}
        isOwnProfile={isOwnProfile}
      />
    </div>
  );
};

export default ProfilePage;
