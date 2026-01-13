/**
 * プロフィール投稿一覧コンポーネント
 */

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchUserPostsAsync } from '../../../store/slices/postSlice';
import { PostCard } from '../post/PostCard';
import { PostCardSkeleton } from '../../common';
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
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-full max-w-sm text-center">
          {isOwnProfile ? (
            <>
              <div className="mb-4">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-extrabold text-gray-900 mb-2">
                まだポストしていません
              </h3>
              <p className="text-gray-500 text-[15px] leading-relaxed">
                最初のポストを作成して、あなたのスタイルを世界と共有しましょう！
              </p>
            </>
          ) : (
            <>
              <div className="mb-4">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-extrabold text-gray-900 mb-2">
                @{username}はまだポストしていません
              </h3>
              <p className="text-gray-500 text-[15px] leading-relaxed">
                最初のポストを待ちましょう！
              </p>
            </>
          )}
        </div>
      </div>
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
