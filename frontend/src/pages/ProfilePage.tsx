/**
 * プロフィールページ（Twitter/X スタイル）
 */

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchUserByUsernameAsync } from '../store/slices/userSlice';
import { followUserAsync, unfollowUserAsync, fetchFollowingAsync } from '../store/slices/followSlice';
import { ProfileHeader, ProfilePosts } from '../components/features/profile';
import { Loading, ErrorDisplay } from '../components/common';

type TabType = 'posts' | 'replies' | 'media' | 'likes';

export const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const dispatch = useAppDispatch();
  const { viewingUser, loading, error } = useAppSelector((state) => state.user);
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const { following, loading: followLoading } = useAppSelector((state) => state.follow);

  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('posts');

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            このアカウントは存在しません
          </h2>
          <p className="text-gray-500">
            @{username} を検索してみてください
          </p>
        </div>
      </div>
    );
  }

  const tabs: { key: TabType; label: string }[] = [
    { key: 'posts', label: 'ポスト' },
    { key: 'replies', label: '返信' },
    { key: 'media', label: 'メディア' },
    { key: 'likes', label: 'いいね' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* 上部ヘッダー */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="flex items-center px-4 h-14">
          <button
            onClick={() => window.history.back()}
            className="p-2 -ml-2 mr-6 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="戻る"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="font-bold text-xl leading-tight">
              {viewingUser.displayName || viewingUser.username}
            </h1>
            <p className="text-sm text-gray-500">
              {viewingUser.postsCount || 0} 件のポスト
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

      {/* タブナビゲーション */}
      <div className="border-b border-gray-200 bg-white sticky top-14 z-10">
        <nav className="flex" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              role="tab"
              aria-selected={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-4 text-center font-medium transition-colors relative
                ${activeTab === tab.key 
                  ? 'text-gray-900' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-blue-500 rounded-full" />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* コンテンツ */}
      <div className="min-h-[50vh]">
        {activeTab === 'posts' && (
          <ProfilePosts
            userId={viewingUser.id}
            username={viewingUser.username}
            isOwnProfile={isOwnProfile}
          />
        )}
        {activeTab === 'replies' && (
          <div className="p-8 text-center text-gray-500">
            <p>返信はまだありません</p>
          </div>
        )}
        {activeTab === 'media' && (
          <div className="p-8 text-center text-gray-500">
            <p>メディアはまだありません</p>
          </div>
        )}
        {activeTab === 'likes' && (
          <div className="p-8 text-center text-gray-500">
            <p>いいねした投稿はまだありません</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
