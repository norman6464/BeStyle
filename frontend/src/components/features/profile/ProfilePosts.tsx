/**
 * プロフィール投稿一覧コンポーネント
 */

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchUserPostsAsync } from '../../../store/slices/postSlice';
import { PostCard } from '../post/PostCard';
import { PostCardSkeleton, EmptyState } from '../../common';
import { postApi } from '../../../api/postApi';

interface ProfilePostsProps {
  userId: number;
  username: string;
  isOwnProfile: boolean;
}

export const ProfilePosts: React.FC<ProfilePostsProps> = ({
  userId,
  username,
  isOwnProfile,
}) => {
  const dispatch = useAppDispatch();
  const { userPosts, loading } = useAppSelector((state) => state.post);
  const { user: currentUser } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchUserPostsAsync(userId));
  }, [dispatch, userId]);

  // いいね
  const handleLike = async (postId: number) => {
    try {
      await postApi.likePost(postId);
      dispatch(fetchUserPostsAsync(userId));
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  // いいね解除
  const handleUnlike = async (postId: number) => {
    try {
      await postApi.unlikePost(postId);
      dispatch(fetchUserPostsAsync(userId));
    } catch (error) {
      console.error('Failed to unlike post:', error);
    }
  };

  // ブックマーク
  const handleBookmark = async (postId: number) => {
    try {
      await postApi.bookmarkPost(postId);
      dispatch(fetchUserPostsAsync(userId));
    } catch (error) {
      console.error('Failed to bookmark post:', error);
    }
  };

  // ブックマーク解除
  const handleUnbookmark = async (postId: number) => {
    try {
      await postApi.unbookmarkPost(postId);
      dispatch(fetchUserPostsAsync(userId));
    } catch (error) {
      console.error('Failed to unbookmark post:', error);
    }
  };

  // 削除
  const handleDelete = async (postId: number) => {
    try {
      await postApi.deletePost(postId);
      dispatch(fetchUserPostsAsync(userId));
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  if (loading) {
    return (
      <div>
        {[...Array(3)].map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (userPosts.length === 0) {
    return (
      <EmptyState
        icon={
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        }
        title={isOwnProfile ? 'まだ投稿していません' : `@${username}はまだ投稿していません`}
        description={
          isOwnProfile
            ? '最初の投稿を作成して、あなたのスタイルを共有しましょう！'
            : undefined
        }
      />
    );
  }

  return (
    <div>
      {userPosts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onLike={handleLike}
          onUnlike={handleUnlike}
          onBookmark={handleBookmark}
          onUnbookmark={handleUnbookmark}
          onDelete={handleDelete}
          isOwner={currentUser?.id === post.userId}
        />
      ))}
    </div>
  );
};

export default ProfilePosts;
