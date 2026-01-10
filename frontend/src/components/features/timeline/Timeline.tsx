/**
 * タイムラインコンポーネント
 */

import React, { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  fetchTimelineAsync,
  clearTimeline,
  updateLikeStatus,
  updateBookmarkStatus,
  removePost,
} from '../../../store/slices/timelineSlice';
import { PostCard } from '../post/PostCard';
import { PostCardSkeleton, EmptyState, ErrorDisplay } from '../../common';
import { useInfiniteScroll } from '../../../hooks/useInfiniteScroll';
import { postApi } from '../../../api/postApi';

export const Timeline: React.FC = () => {
  const dispatch = useAppDispatch();
  const { posts, loading, error, hasMore, page } = useAppSelector((state) => state.timeline);
  const { user } = useAppSelector((state) => state.auth);

  // 初期読み込み
  useEffect(() => {
    dispatch(fetchTimelineAsync({ page: 0, refresh: true }));

    return () => {
      dispatch(clearTimeline());
    };
  }, [dispatch]);

  // 追加読み込み
  const loadMore = useCallback(async () => {
    if (!loading && hasMore) {
      dispatch(fetchTimelineAsync({ page: page + 1 }));
    }
  }, [dispatch, loading, hasMore, page]);

  // 無限スクロール
  const { sentinelRef } = useInfiniteScroll({
    onLoadMore: loadMore,
    hasMore,
    loading,
  });

  // いいね
  const handleLike = async (postId: number) => {
    dispatch(updateLikeStatus({ postId, isLiked: true }));
    try {
      await postApi.likePost(postId);
    } catch {
      dispatch(updateLikeStatus({ postId, isLiked: false }));
    }
  };

  // いいね解除
  const handleUnlike = async (postId: number) => {
    dispatch(updateLikeStatus({ postId, isLiked: false }));
    try {
      await postApi.unlikePost(postId);
    } catch {
      dispatch(updateLikeStatus({ postId, isLiked: true }));
    }
  };

  // ブックマーク
  const handleBookmark = async (postId: number) => {
    dispatch(updateBookmarkStatus({ postId, isBookmarked: true }));
    try {
      await postApi.bookmarkPost(postId);
    } catch {
      dispatch(updateBookmarkStatus({ postId, isBookmarked: false }));
    }
  };

  // ブックマーク解除
  const handleUnbookmark = async (postId: number) => {
    dispatch(updateBookmarkStatus({ postId, isBookmarked: false }));
    try {
      await postApi.unbookmarkPost(postId);
    } catch {
      dispatch(updateBookmarkStatus({ postId, isBookmarked: true }));
    }
  };

  // 削除
  const handleDelete = async (postId: number) => {
    try {
      await postApi.deletePost(postId);
      dispatch(removePost(postId));
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  // リロード
  const handleReload = () => {
    dispatch(fetchTimelineAsync({ page: 0, refresh: true }));
  };

  // エラー表示
  if (error && posts.length === 0) {
    return <ErrorDisplay error={error} onRetry={handleReload} />;
  }

  // 空の状態
  if (!loading && posts.length === 0) {
    return (
      <EmptyState
        icon={
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        }
        title="まだ投稿がありません"
        description="フォローしているユーザーの投稿がここに表示されます。誰かをフォローして始めましょう！"
      />
    );
  }

  return (
    <div>
      {/* 投稿リスト */}
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onLike={handleLike}
          onUnlike={handleUnlike}
          onBookmark={handleBookmark}
          onUnbookmark={handleUnbookmark}
          onDelete={handleDelete}
          isOwner={user?.id === post.userId}
        />
      ))}

      {/* ローディング */}
      {loading && (
        <div>
          {[...Array(3)].map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* 無限スクロール用センチネル */}
      <div ref={sentinelRef} className="h-10" />

      {/* 全て読み込み完了 */}
      {!hasMore && posts.length > 0 && (
        <div className="p-8 text-center text-gray-500">
          これ以上の投稿はありません
        </div>
      )}
    </div>
  );
};

export default Timeline;
